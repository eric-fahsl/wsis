import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster
import os
import uuid

PCT_LEVER_NEW_SNOW = 0.6
PCT_LEVEL_PREV_SNOW = 0.2
PCT_LEVEL_PROJ_SNOW = 0.2
PCT_FACTOR_PREV_SNOW = 0.5
UPPER_LIMIT = 16
POWDER_STAR_RATING_CUTOFF = [ 0, 2.0, 4.0, 6.0, 8.0, 10.0 ]
COUCH_DB_SERVER = "http://localhost:5984"
COUCH_DB_NAME = "recommendations"
COUCH_DB_URL = COUCH_DB_SERVER + "/" + COUCH_DB_NAME 
REC_POWDER = "Powder"

#Bluebird summaries
BLUEBIRD_SUMMARIES = {}
BLUEBIRD_SUMMARIES[5] = ["Sunny", "Clear"]
BLUEBIRD_SUMMARIES[4] = ["Mostly Sunny","Mostly Clear"]
BLUEBIRD_SUMMARIES[3] = ["Partly Cloudy","Partly Sunny"]
BLUEBIRD_SUMMARIES[2] = ["Mostly Cloudy", "Increasing Clouds"]

def checkUpperLimit(snowfallAmount) :
	if snowfallAmount > UPPER_LIMIT :
		return UPPER_LIMIT
	return snowfallAmount

def calcPowder(new_snow, previous_snow, projected_snow) :
	previous_snow = checkUpperLimit(previous_snow)
	projected_snow = checkUpperLimit(projected_snow)
	
	adjustedSnow = new_snow * PCT_LEVER_NEW_SNOW + previous_snow * PCT_LEVEL_PREV_SNOW * PCT_FACTOR_PREV_SNOW + projected_snow * PCT_LEVEL_PROJ_SNOW
	starRating = -1
	for cutoff in POWDER_STAR_RATING_CUTOFF : 
		starRating += 1
		if adjustedSnow < cutoff :
			break
	return starRating 

def calcBluebird(weatherSummary) :
	for rating,summaries in BLUEBIRD_SUMMARIES.iteritems() :
		for summary in summaries :
			if (summary.lower() == weatherSummary.lower()) :
				return rating

	return 1


def createRecommendationDocument(resort, recDate ) :
	rec = {}
	rec['resort'] = resort['name'].lower().replace(' ','')
	rec['resort_name'] = resort['name']
	rec['state'] = resort['state']
	rec['region'] = resort['region']
	rec['latitude'] = float(resort['latitude'])
	rec['longitude'] = float(resort['longitude'])

	rec['createdOn'] = str(datetime.date.today())
	rec['date'] = recDate

	return rec


def calculateRecommendation(dateOfRecommendation, resort, db) :
	newSnowForTomorrow = nwsWeather.getTotalSnowfallForRangeForResort(dateOfRecommendation - datetime.timedelta(days=1), dateOfRecommendation, resort['id'], db)
	projectedSnowTomorrow = nwsWeather.getTotalSnowfallForRangeForResort(dateOfRecommendation, dateOfRecommendation + datetime.timedelta(days=1), resort['id'], db, True)

	#TODO - update this to read from actual resorts
	previousSnowFall = nwsWeather.getTotalSnowfallForRangeForResort(dateOfRecommendation - datetime.timedelta(days=3), dateOfRecommendation - datetime.timedelta(days=1), resort['id'], db)

	docId = resort['name'].lower().replace(' ','') + "_" + str(dateOfRecommendation)
	docUrl = COUCH_DB_URL + "/" + docId
	
	#Create the base recommendation document
	reccomendationDocument = createRecommendationDocument(resort, str(dateOfRecommendation) )
	
	#Create Powder Forecast first
	powderData = {}
	powderData['snow_prev'] = float(previousSnowFall)
	powderData['snow_new'] = float(newSnowForTomorrow)
	powderData['snow_forecast'] = float(projectedSnowTomorrow)
	
	powderData['rating'] = calcPowder(powderData['snow_new'], powderData['snow_prev'], powderData['snow_forecast'])
	reccomendationDocument['powder'] = powderData

	#Now create the bluebird recommendation
	bluebirdData = {}
	weatherRecord = nwsWeather.getWeatherSummaryForDate(dateOfRecommendation, resort['id'], db)
	bluebirdData['weather_summary'] = weatherRecord[1]
	bluebirdData['rating'] = calcBluebird(weatherRecord[0])
	reccomendationDocument['bluebird'] = bluebirdData

	#check if we need to override the existing record
	try :	
		currentDocLocationResponse = simplejson.load(urllib2.urlopen(docUrl))
		reccomendationDocument['_rev'] = str(currentDocLocationResponse['_rev'])
	except urllib2.HTTPError:
		print docId + " not found, will create a new record"
	#print id

	curlCommand = "curl -X PUT " + COUCH_DB_URL + "/" + docId + " -H 'Content-Type: application/json' -d " + "'" + simplejson.dumps(reccomendationDocument) + "'"
	print curlCommand
	os.system(curlCommand)
 
#Connect to DB
#db = _mysql.connect("localhost","wsis","wsis","wsis")

def create(db) :
	#retrieve the master list of resorts
	resorts = resortMaster.getResorts(db)

	#for each resort, calculate the next several days out
	for resort in resorts :
		for i in range(1,5) :
			calculateRecommendation(datetime.date.today() + datetime.timedelta(days=i), resort, db)
	

#db.close()



