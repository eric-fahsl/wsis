import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster
import os
import uuid
import snowforecastWeather
import sys

PCT_LEVER_NEW_SNOW = 0.5
PCT_LEVEL_PREV_SNOW = 0.3
PCT_LEVEL_PROJ_SNOW = 0.2
PCT_FACTOR_PREV_SNOW = 1.0
UPPER_LIMIT = 18
POWDER_STAR_RATING_CUTOFF = [ 2.0, 5.0, 7.5, 10.0 ]
COUCH_DB_SERVER = "http://localhost:5984"
COUCH_DB_NAME = "recommendations"
COUCH_DB_URL = COUCH_DB_SERVER + "/" + COUCH_DB_NAME 
REC_POWDER = "Powder"
RATING_DELTA_THRESHOLD = .81
POWDER_FACTOR = 2.5
M_TO_FEET_FACTOR = 3.28084
KM_TO_MI_FACTOR = 0.621371
POWDER_QUALITY_TEMPERATURE_RANGE_C = [-12.22222, 4.444]
POWDER_QUALITY_WIND_RANGE = [7,30]
POWDER_QUALITY_NEW_SNOW = [0,6]
POWDER_QUALITY_TEMPERATURE_FACTOR = 0.25
POWDER_QUALITY_WIND_FACTOR = 0.35
POWDER_QUALITY_FREEZING_LEVEL_FACTOR = 0.2
POWDER_QUALITY_NEW_SNOW_FACTOR = 0.2
POWDER_QUALITY_MIN_SNOW_LAST_72 = 4
POWDER_QUALITY_DAY_BEFORE_FACTOR = .666666666666667 * .8
POWDER_QUALITY_2_DAYS_BEFORE_FACTOR = .3333333333333 * .8
POWDER_QUALITY_DAY_OF_FACTOR = .2

#Bluebird summaries
BLUEBIRD_SUMMARIES = {}
BLUEBIRD_SUMMARIES[5] = ["Sunny", "Clear"]
BLUEBIRD_SUMMARIES[4] = ["Mostly Sunny","Mostly Clear", "some clouds"]
BLUEBIRD_SUMMARIES[3] = ["Partly Cloudy","Partly Sunny"]
BLUEBIRD_SUMMARIES[2] = ["Mostly Cloudy", "Increasing Clouds", "light snow"]


def calcAverage(value1, value2) :
	return (float(value1) + float(value2)) / 2

def checkUpperLimit(snowfallAmount) :
	if snowfallAmount > UPPER_LIMIT :
		return UPPER_LIMIT
	return snowfallAmount

def formatFloat(inputNum) :
	return "%.1f" % float(inputNum)

def formatRating(inputNum) :
	return round(inputNum * 4) / 4

def calcPowder(new_snow, previous_snow, projected_snow) :
	previous_snow = checkUpperLimit(previous_snow - new_snow)
	projected_snow = checkUpperLimit(projected_snow)
	
	adjustedSnow = new_snow * PCT_LEVER_NEW_SNOW + previous_snow * PCT_LEVEL_PREV_SNOW * PCT_FACTOR_PREV_SNOW + projected_snow * PCT_LEVEL_PROJ_SNOW
	
	rating = adjustedSnow / POWDER_FACTOR + 1
	if (rating > 5) :
		rating = 5
	return formatRating(rating)

def calcBluebird(weatherSummary) :
	for rating,summaries in BLUEBIRD_SUMMARIES.iteritems() :
		for summary in summaries :
			if (summary.lower() == weatherSummary.lower()) :
				return rating

	return 1

def calcFreezingLevelAverage(yesterday, last3, today, convertToFeet=True) :
	#calc average in meters
	average = PCT_LEVER_NEW_SNOW * yesterday + last3 * PCT_FACTOR_PREV_SNOW + today * PCT_LEVEL_PROJ_SNOW
	if convertToFeet :
		average = average * M_TO_FEET_FACTOR
	return average

def calcValueInRange(value, lower, upper, lowerIsBetter=True) :
	lower = int(lower)
	upper = int(upper)
	rating = 0
	if value >= upper :
		rating = 1
	elif value <= lower :
		rating = 5
	else :
		percentage = (value - lower) / (upper - lower)
		#print percentage
		rating = 5 - percentage * 4.0

	if (not lowerIsBetter) :
		rating = 5 - (rating - 1)
	return formatRating(rating)

def createRecommendationDocument(resort, recDate ) :
	rec = {}
	rec['resort'] = resort['name'].lower().replace(' ','')
	rec['resort_name'] = resort['name']
	rec['state'] = resort['state']
	rec['state_full'] = resort['state_full']
	rec['region'] = resort['region']
	location = {}
	location['lat'] = float(resort['latitude'])
	location['lon'] = float(resort['longitude'])
	rec['location'] = location

	rec['createdOn'] = str(datetime.datetime.now())
	rec['date'] = recDate

	return rec

def calculateTrend(newValue, initialValue) :
	if abs(newValue - initialValue) < RATING_DELTA_THRESHOLD :
		return 0
	elif newValue > initialValue :
		return 1
	else :
		return -1

def calculateDaySnowQualityRating(previousSnowFall, newSnowForTomorrow, freezingLevelData, dateOfRecommendation, nextDay, resort, db) :
	dayRating = 0
	if previousSnowFall < POWDER_QUALITY_MIN_SNOW_LAST_72 :
		dayRating = 1
	else :
		dayFreezingLevelRating = freezingLevelData['rating']
		dayWind = snowforecastWeather.getAverageWindForResort(dateOfRecommendation, nextDay, resort['id'], db, True)			
		#print "dayWind (mph): " + str(dayWind * KM_TO_MI_FACTOR)
		dayWindRating = calcValueInRange(dayWind * KM_TO_MI_FACTOR, POWDER_QUALITY_WIND_RANGE[0], POWDER_QUALITY_WIND_RANGE[1])
		#print "dayWindRating: " + str(dayWindRating)
		dayTemperature = snowforecastWeather.getAverageTemperatureForResort(dateOfRecommendation, nextDay, resort['id'], db, True)
		#print "dayTemperature: " + str(dayTemperature)
		dayTempRating = calcValueInRange(dayTemperature, POWDER_QUALITY_TEMPERATURE_RANGE_C[0], POWDER_QUALITY_TEMPERATURE_RANGE_C[1])
		#print "dayTempRating: " + str(dayTempRating)
		#print "newSnowForTomorrow: " + str(newSnowForTomorrow)
		dayNewSnowRating = calcValueInRange(newSnowForTomorrow, POWDER_QUALITY_NEW_SNOW[0], POWDER_QUALITY_NEW_SNOW[1], False)
		#print "dayNewSnowRating: " + str(dayNewSnowRating)
		
		actualDaySnowQualityRating = POWDER_QUALITY_FREEZING_LEVEL_FACTOR * dayFreezingLevelRating + \
			POWDER_QUALITY_TEMPERATURE_FACTOR * dayTempRating + \
			POWDER_QUALITY_WIND_FACTOR * dayWindRating + \
			POWDER_QUALITY_NEW_SNOW_FACTOR * dayNewSnowRating

		#print "****SNOW QUALITY RATING****: " + str(actualDaySnowQualityRating)
		dayRating = formatRating(actualDaySnowQualityRating)
		'''
		snowQualityCsv.write(docId + ',' + 
				str(dayWind * KM_TO_MI_FACTOR) + ',' +
				str(dayWindRating) + ',' +
				str(dayTemperature) + ',' +
				str(dayTempRating)	+ ',' +
				str(dayFreezingLevelRating) + ',' + 
				str(newSnowForTomorrow) + ',' +
				str(dayNewSnowRating) + ',' + 
				str(snowQuality['rating']) + '\n')
		'''
	return dayRating

def retrieveTotalSnowForDateRange(startDate, endDate, resort, db, dayFilter) :
	#Get the amount of snow from snowForeCast
	snowFallSf = snowforecastWeather.getTotalSnowfallForRangeForResort(startDate, endDate, resort['id'], db, dayFilter)
	if (snowFallSf == None) :
		snowFallSf = 0
	snowFallNws = snowFallSf	
	#check if domestic, if not just use the totals from SnowForecast
	if (resort['domestic'] == 'T') :
		snowFallNws = nwsWeather.getTotalSnowfallForRangeForResort(startDate, endDate, resort['id'], db, dayFilter)
		if snowFallNws == None :
			snowFallNws = 0

	return calcAverage(snowFallSf, snowFallNws)

def calculateRecommendation(dateOfRecommendation, resort, db) :
	previousDay = dateOfRecommendation - datetime.timedelta(days=1)
	nextDay = dateOfRecommendation + datetime.timedelta(days=1)

	try :
		newSnowForTomorrow = retrieveTotalSnowForDateRange(previousDay, dateOfRecommendation, resort, db, False)
		projectedSnowTomorrow = retrieveTotalSnowForDateRange(dateOfRecommendation, nextDay, resort, db, True)
		#TODO - update this to read from actual resortMaster
		previousSnowFall = retrieveTotalSnowForDateRange(dateOfRecommendation - datetime.timedelta(days=3), dateOfRecommendation, resort, db, False)

		resortDocName = resort['name'].lower().replace(' ','') + "_"
		docId =  resortDocName + str(dateOfRecommendation)
		docUrl = COUCH_DB_URL + "/" + docId
		
		#acquire previous day's recommendation so we can make a trending evaluation
		previousDayDocId = resortDocName + str(dateOfRecommendation - datetime.timedelta(days=1))
		previousDocUrl = COUCH_DB_URL + "/" + previousDayDocId
		
		#Create the base recommendation document
		reccomendationDocument = createRecommendationDocument(resort, str(dateOfRecommendation) )
		
		#Create Powder Recommendation first
		powderData = {}
		powderData['snow_prev'] = formatFloat(previousSnowFall)

		powderData['snow_new'] = formatFloat(newSnowForTomorrow)
		powderData['snow_forecast'] = formatFloat(projectedSnowTomorrow)
		
		powderData['rating'] = calcPowder(newSnowForTomorrow, previousSnowFall, projectedSnowTomorrow)
		reccomendationDocument['powder'] = powderData

		#Now create the bluebird recommendation
		bluebirdData = {}
		sfBluebirdAM = calcBluebird(snowforecastWeather.getWeatherSummaryForDate(dateOfRecommendation, resort['id'], db)[0][0])
		sfBluebirdPM = calcBluebird(snowforecastWeather.getWeatherSummaryForDate(dateOfRecommendation, resort['id'], db)[1][0])

		#Check if domestic, if not, do not pull from NWS
		nwsBluebirdRating = calcAverage(sfBluebirdAM, sfBluebirdPM)
		if (resort['domestic'] == 'T') :
			weatherRecord = nwsWeather.getWeatherSummaryForDate(dateOfRecommendation, resort['id'], db)
			bluebirdData['weather_summary'] = weatherRecord[1]
			nwsBluebirdRating = calcBluebird(weatherRecord[0])
		
		bluebirdData['rating'] = formatRating(calcAverage(nwsBluebirdRating, calcAverage(sfBluebirdAM, sfBluebirdPM)))
		reccomendationDocument['bluebird'] = bluebirdData

		#Create the Freezing Level Rating
		freezingLevelData = {}
		freezingLevelData['bottom'] = resort['base_elevation']
		freezingLevelData['top'] = resort['summit_elevation']

		actualDaysFreezingLevel = snowforecastWeather.getAverageFreezingLevelForResort(dateOfRecommendation, nextDay, resort['id'], db, True)
		#if domestic, convert to feet
		if (resort['domestic'] == 'T') :
			actualDaysFreezingLevel *= M_TO_FEET_FACTOR

		freezingLevelData['freezing_level_avg'] = float(int(actualDaysFreezingLevel))
		freezingLevelData['rating'] = calcValueInRange(freezingLevelData['freezing_level_avg'], freezingLevelData['bottom'], freezingLevelData['top'])
		#print freezingLevelData
		reccomendationDocument['freezing_level'] = freezingLevelData

		########Calculate the snow quality rating (BETA?)#############
		
		snowQuality = {}
		snowQuality['prior24'] = calculateDaySnowQualityRating(previousSnowFall, \
			retrieveTotalSnowForDateRange(previousDay, dateOfRecommendation, resort, db, False), \
			freezingLevelData, dateOfRecommendation, nextDay, resort, db)
		
		snowQuality['2DaysPrior'] = calculateDaySnowQualityRating( \
			retrieveTotalSnowForDateRange(dateOfRecommendation - datetime.timedelta(days=4), dateOfRecommendation - datetime.timedelta(days=1), resort, db, False), \
			retrieveTotalSnowForDateRange(dateOfRecommendation - datetime.timedelta(days=2), previousDay, resort, db, False), \
			freezingLevelData, dateOfRecommendation, nextDay, resort, db)

		snowQuality['dayOf'] = calculateDaySnowQualityRating( \
			retrieveTotalSnowForDateRange(dateOfRecommendation - datetime.timedelta(days=2), dateOfRecommendation + datetime.timedelta(days=1), resort, db, True), \
			retrieveTotalSnowForDateRange(dateOfRecommendation, dateOfRecommendation + datetime.timedelta(days=1), resort, db, True), \
			freezingLevelData, dateOfRecommendation, nextDay, resort, db)
		
		snowQualityRating = snowQuality['prior24'] * POWDER_QUALITY_DAY_BEFORE_FACTOR + \
			snowQuality['2DaysPrior'] * POWDER_QUALITY_2_DAYS_BEFORE_FACTOR	+ \
			snowQuality['dayOf'] * POWDER_QUALITY_DAY_OF_FACTOR
		snowQuality['rating'] = formatRating(snowQualityRating)

		reccomendationDocument['snow_quality'] = snowQuality
		
		try :
			previousDocLocationResponse = simplejson.load(urllib2.urlopen(previousDocUrl))
			powderTrend = calculateTrend(reccomendationDocument['powder']['rating'], previousDocLocationResponse['powder']['rating'])
			bluebirdTrend = calculateTrend(reccomendationDocument['bluebird']['rating'], previousDocLocationResponse['bluebird']['rating'])
			flTrend = calculateTrend(reccomendationDocument['freezing_level']['rating'], previousDocLocationResponse['freezing_level']['rating'])
			reccomendationDocument['powder']['trend'] = powderTrend
			reccomendationDocument['bluebird']['trend'] = bluebirdTrend
			reccomendationDocument['freezing_level']['trend'] = flTrend
		#except urllib2.HTTPError :
		except :
			reccomendationDocument['powder']['trend'] = 0
			reccomendationDocument['bluebird']['trend'] = 0
			reccomendationDocument['freezing_level']['trend'] = 0

		#check if we need to override the existing record
		try :	
			currentDocLocationResponse = simplejson.load(urllib2.urlopen(docUrl))
			reccomendationDocument['_rev'] = str(currentDocLocationResponse['_rev'])
		except urllib2.HTTPError:
			print docId + " not found, will create a new record"
		#print id

		curlCommand = "curl -X PUT " + COUCH_DB_URL + "/" + docId + " -H 'Content-Type: application/json' -d " + "'" + simplejson.dumps(reccomendationDocument) + "'"
		#print curlCommand
		os.system(curlCommand)
	except TypeError as error:
		#if the database entry doesn't exist, skip record and move on
		print "ERR: Cannot calculate recommendation for " + resort['name'] + ": " + str(dateOfRecommendation)
		print error
 
#Connect to DB
#db = _mysql.connect("localhost","wsis","wsis","wsis")
TEST_CSV_FILE = 'snow_quality_test.csv'
snowQualityCsv = file(TEST_CSV_FILE, 'w')
snowQualityCsv.write('Recc ID,Wind, Wind Rating, Temperature, Temp Rating, Freezing Level Rating, New Snow, New Snow Rating, SNOW QUALITY RATING\n')

def create(db) :
	#retrieve the master list of resorts
	resorts = resortMaster.getResorts(db)

	#for each resort, calculate the next several days out
	for resort in resorts :
		for i in range(0,6) :
			calculateRecommendation(datetime.date.today() + datetime.timedelta(days=i), resort, db)
		#for i in range(1,20) :
		#	calculateRecommendation(datetime.date.today() - datetime.timedelta(days=i), resort, db)
	
	
	snowQualityCsv.close()

#db.close()



