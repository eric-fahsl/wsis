import urllib2
import simplejson
import _mysql
import datetime
import dbHelper

nwsWeatherUrl = "http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=json"
TABLE_NAME = "weather_data_nws"
SNOW_ACCUM_STR = "snow accumulation of "
SNOW_ACCUM_STR_LEN = len(SNOW_ACCUM_STR)
SNOW_ACCUM_SINGLE_INCH = "inch "
LATER_TODAY_STRING = "Late"
NIGHT_STRING = "ight"
columnFields = {}


def getWeather(resort, db) :

	url = nwsWeatherUrl + "&lat=" + resort['latitude'] + "&lon=" + resort['longitude']
	print "getting weather for " + resort['name'] + ": " + url
	
	try :
		response = simplejson.load(urllib2.urlopen(url) )

		row = {}
		row['reported_time'] = response['creationDate']
		row['resort'] = resort['id']

		#first check if entry already exists
		queryString = "select count(*) from " + TABLE_NAME + " where resort='" + resort['id'] + "' and reported_time='" + row['reported_time'] + "'"
		db.query(queryString)
		r = db.store_result()
		results = r.fetch_row(0)
		count = int(results[0][0])
		#print count;

		#only insert if an entry doesnt already exist for this
		if (count == 0) :

			#determine which days to grab, probably will be all but maybe not the first
			startIndex = 0
			if (response['time']['startPeriodName'][0].find(LATER_TODAY_STRING) >= 0) :
				startIndex = 1

			for i in range(startIndex, len(response['time']['startPeriodName'])) :
				
				forecastDate = response['time']['startValidTime'][i]
				row['date'] = forecastDate.split("T")[0]
				if (response['time']['startPeriodName'][i].find(NIGHT_STRING) >= 0) :
					row['forecast_time'] = "night"
				else :
					row['forecast_time'] = "day"
				
				rData = response['data']
				row['summary'] = rData['weather'][i]
				row['pct_precip'] = rData['pop'][i]
				if row['forecast_time'] == 'night' :
					row['low_temp'] = rData['temperature'][i]
				else :
					row['high_temp'] = rData['temperature'][i]

				textSummary = rData['text'][i]
				row['text_summary'] = textSummary
				row['snow_forecast'] = 0
				if textSummary.find(SNOW_ACCUM_SINGLE_INCH) >= 0:
					row['snow_forecast'] = 1
				else :
					print textSummary
					snowAccumIndex = textSummary.find(SNOW_ACCUM_STR)
					if snowAccumIndex > 0 :
						tokenized = textSummary[snowAccumIndex + SNOW_ACCUM_STR_LEN:].split(' ')
						
						#check special case "around X inches"
						if (tokenized[0] == 'around') :
							row['snow_forecast'] = float(tokenized[1])
						else :
							lowSnow = float(tokenized[0])
							highSnow = float(tokenized[2])
							#Use the midpoint of the forecasted snow
							row['snow_forecast'] = (lowSnow + highSnow) / 2
							
							#Going to try just going with the highest snow total expected
							#row['snow_forecast'] = highSnow

				queryString = dbHelper.createInsertStatement(row, TABLE_NAME)
				#print queryString
				db.query(queryString)

	except simplejson.decoder.JSONDecodeError :
		print "*****************************************"
		print "NWS FORECAST FAILED " + str(datetime.datetime.now())
		print url
		print "*****************************************"

def defineColumnFields(db) :
	
	if columnFields == {} : 
		db.query("desc " + TABLE_NAME)
		r = db.store_result()

		results = r.fetch_row(0)

		i=0
		for result in results :
		    #Conduct a reverse-index for field lookups
		    columnFields[result[0]] = i
		    i += 1
	return
		    

def getData(resort, db) :
	#defineColumnFields(db)

	db.query("select * from " + TABLE_NAME + " where resort=" + resort)
	r = db.store_result()

 	data = {}
	results = r.fetch_row(0)

	#for result in results :
	#	new_snow = float(result[columnFields["snow_forecast"]])
	#	data["new_snow"] = new_snow


	return results


def getTotalSnowfallForRangeForResort(startDate, endDate, resort, db, dayFilter=False) :
	queryString = "select sum(snow_forecast) from " + TABLE_NAME 
	queryString += " WHERE date >= '" + str(startDate)
	queryString += "' AND date < '" + str(endDate) 
	queryString += "' AND resort = " + str(resort)
	if (dayFilter) :
		queryString += " AND forecast_time='day'"

	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	return results[0][0]

def getWeatherSummaryForDate(date, resort, db) :
	datePlusOne = date + datetime.timedelta(days=1)
	queryString = "select summary, text_summary from " + TABLE_NAME 
	queryString += " WHERE date >= '" + str(date)
	queryString += "' AND date < '" + str(datePlusOne) 
	queryString += "' AND resort = " + str(resort)
	queryString += " AND forecast_time='day'"

	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	return results[0]

