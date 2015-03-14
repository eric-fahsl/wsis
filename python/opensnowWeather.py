import urllib2
import simplejson
import _mysql
import datetime
import dbHelper
import sys,traceback

opensnowWeatherUrl = "http://opensnow.com/api/public/1.0/locations/data?apikey=where&type=json"
TABLE_NAME = "weather_data_opensnow"
columnFields = {}

#The different period names in open snow api
pDataKeys = ['period1', 'period2', 'period3', 'period4', 'period5']

#The two different periods we are grabbing forecasts for
rDataKeys = ['day', 'night']
				

def parseSnowRange(inputText) :
	snowTotals = inputText.split('-')
	snow_low = float(snowTotals[0])
	snow_high = snow_low
	if (len(snowTotals) > 1) :
		snow_high = float(snowTotals[1])
	return (snow_low + snow_high) / 2

def getWeather(resort, db) :

	url = opensnowWeatherUrl + "&lids=" + resort['opensnow_id']
	print "getting OPEN SNOW weather for " + resort['name'] + ": " + url
	
	try :
		response = simplejson.load(urllib2.urlopen(url) )
		forecast = response['results']['location' + resort['opensnow_id']]['forecast']

		#create the empty row object
		row = {}
		row['reported_time'] = forecast['updated_at']
		row['resort'] = resort['id']

		#first check if entry already exists for that reported time
		queryString = "select count(*) from " + TABLE_NAME + " where resort='" + resort['id'] + "' and reported_time='" + row['reported_time'] + "'"
		db.query(queryString)
		r = db.store_result()
		results = r.fetch_row(0)
		count = int(results[0][0])
		#print count;

		#only insert if an entry doesnt already exist for this
		if (count == 0) :

			for forecastDate in pDataKeys :				
				row['date'] = forecast[forecastDate]['date']
				
				for timeOfDay in rDataKeys :
					forecastDayPeriod = forecast[forecastDate][timeOfDay]
					row['forecast_time'] = timeOfDay
					row['summary'] = forecastDayPeriod['weather']
					row['temp'] = forecastDayPeriod['temp']
					row['text_summary'] = forecastDayPeriod['text']
					row['snow_forecast'] = parseSnowRange(forecastDayPeriod['snow'])

					queryString = dbHelper.createInsertStatement(row, TABLE_NAME)
					#print queryString
					db.query(queryString)

	except :
		print "*****************************************"
		print "OPENSNOW FORECAST FAILED " + str(datetime.datetime.now())
		print url
		traceback.print_exc(file=sys.stdout)
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

