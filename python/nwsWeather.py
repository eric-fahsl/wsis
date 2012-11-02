import urllib2
import simplejson
import _mysql
import datetime

nwsWeatherUrl = "http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=json&"
TABLE_NAME = "weather_data_nws"
SNOW_ACCUM_STR = "snow accumulation of "
SNOW_ACCUM_STR_LEN = len(SNOW_ACCUM_STR)
SNOW_ACCUM_SINGLE_INCH = "inch "
LATER_TODAY_STRING = "Late"
NIGHT_STRING = "ight"
columnFields = {}


def getWeather(latitude, longitude) :
	print "getting weather for " + latitude + ", " + longitude
	url = nwsWeatherUrl + "&lat=" + latitude + "&lon=" + longitude
	response = simplejson.load(urllib2.urlopen(url) )
	return response

def writeToDb(response, resort, db) :
	print "Attempting to write to db for resort " + resort

	row = {}
	row['reported_time'] = response['creationDate']
	row['resort'] = resort

	#first check if entry already exists
	queryString = "select count(*) from " + TABLE_NAME + " where resort='" + resort + "' and reported_time='" + row['reported_time'] + "'"
	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)
	count = int(results[0][0])
	print count;

	#only insert if an entry doesnt already exist for this
	if (count == 0) :

		#determine which days to grab, probably will be all but maybe not the first
		startIndex = 0
		if (response['time']['startPeriodName'][0].find(LATER_TODAY_STRING) >= 0) :
			startIndex = 1

		for i in range(startIndex, len(response['time']['startPeriodName'])) :
			
			row['date'] = response['time']['startValidTime'][i]
			if (response['time']['startPeriodName'][i].find(NIGHT_STRING) >= 0) :
				row['forecast_time'] = "night"
			else :
				row['forecast_time'] = "day"
			
			rData = response['data']
			row['summary'] = rData['weather'][i]
			row['pct_precip'] = rData['pop'][i]
			row['low_temp'] = rData['temperature'][i]
			row['high_temp'] = rData['temperature'][i]

			textSummary = rData['text'][i]
			row['text_summary'] = textSummary
			row['snow_forecast'] = 0
			if textSummary.find(SNOW_ACCUM_SINGLE_INCH) :
				row['snow_forecast'] = 1
			else :
				snowAccumIndex = textSummary.find(SNOW_ACCUM_STR)
				if snowAccumIndex > 0 :
					tokenized = textSummary[snowAccumIndex + SNOW_ACCUM_STR_LEN:].split(' ')
					lowSnow = float(tokenized[0])
					highSnow = float(tokenized[2])
					row['snow_forecast'] = (lowSnow + highSnow) / 2

			queryString = "insert into " + TABLE_NAME + " "

			updateString = ""
			firstTime = True;
			columnNames = "("
			columnValues = "("
			for key, val in row.iteritems(): 
				if (firstTime != True):
					columnNames += ", "
					columnValues += ", "
					updateString += ", "
				columnNames += key
				columnValues += "'" + str(val) + "'"
				updateString += key + "='" + str(val) + "'"
				firstTime = False
			columnNames += ")"
			columnValues += ")"

			queryString += columnNames + " values " + columnValues
			queryString += " ON DUPLICATE KEY UPDATE " + updateString

			print queryString
			db.query(queryString)

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
	defineColumnFields(db)

	db.query("select * from " + TABLE_NAME + " where resort=" + resort)
	r = db.store_result()

 	data = {}
	results = r.fetch_row(0)

	#for result in results :
	#	new_snow = float(result[columnFields["snow_forecast"]])
	#	data["new_snow"] = new_snow


	return results


def getTotalSnowfallForRangeForResort(startDate, endDate, resort, db) :
	queryString = "select sum(snow_forecast) from " + TABLE_NAME 
	queryString += " WHERE date >= '" + startDate
	queryString += "' AND date < '" + endDate 
	queryString += "' AND resort = " + str(resort)

	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	return results[0][0]

