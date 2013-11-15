import urllib2
import simplejson
#import _mysql
import datetime
import xmlHelper
import dbHelper

sfWeatherUrl = "http://www.snow-forecast.com/resorts/"
sfPostUrl = "/feed.xml"
TABLE_NAME = "weather_data_snowforecast"
SNOW_ACCUM_STR = "snow accumulation of "
SNOW_ACCUM_STR_LEN = len(SNOW_ACCUM_STR)
SNOW_ACCUM_SINGLE_INCH = "inch "
LATER_TODAY_STRING = "Late"
NIGHT_STRING = "ight"
columnFields = {}
FORECAST_LOCATION = "mid"

SNOW_FORECAST_WIND_SYMBOL_PRE = "wind"
SNOW_FORECAST_WIND_SYMBOL_POST = "metric.gif"

def convertCmToIn(centimeters) :
	return float(centimeters) * 0.393701

def getWeather(resort, db) :
	print "getting weather for " + resort['snowforecast_id']
	url = sfWeatherUrl + resort['snowforecast_id'] + sfPostUrl
	soup = xmlHelper.createSoup(url)

	row = {}
	#print xmlHelper.getSnowForecastTag("mid", "dayname", soupStr) 
	row['resort'] = resort['id']
	row['reported_time'] = xmlHelper.getSnowForecastTag("hash", "issued", soup)
	#row['resort'] = resort

	for p in soup.findAll('period') :
			
		forecastTimestamp = xmlHelper.getSnowForecastTag("period", "tstampstart", p)
		forecastDate = datetime.datetime.fromtimestamp(int(forecastTimestamp))
		row['date'] = str(forecastDate)
		row['forecast_time'] = xmlHelper.getSnowForecastTag("period", "ename", p).replace("-&lt;br&gt;","")
		row['freezing_level'] = xmlHelper.getSnowForecastTag("period", "flevel", p)
		row['summary'] = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "pphrase", p)
		row['low_temp'] = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "min", p)
		row['high_temp'] = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "max", p)
		row['wind'] = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "pwind", p)
		# Parse wind symbol data from something like windSW35metric.gif to SW
		wsymbol = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "pwsymbol", p)
		wsymbol = wsymbol.replace(SNOW_FORECAST_WIND_SYMBOL_PRE, "").replace(SNOW_FORECAST_WIND_SYMBOL_POST, "")
		wsymbol = wsymbol.replace(row['wind'], "")
		row['wind_dir'] = wsymbol
		snow_forecast = xmlHelper.getSnowForecastTag(FORECAST_LOCATION, "psnow", p)
		if snow_forecast == "-" :
			snow_forecast = 0
		row['snow_forecast'] = snow_forecast

		queryString = dbHelper.createInsertStatement(row, TABLE_NAME)

		#print queryString
		db.query(queryString)


def getTotalSnowfallForRangeForResort(startDate, endDate, resort, db, dayFilter=False) :
	queryString = "select sum(snow_forecast) from " + TABLE_NAME 
	queryString += " WHERE date >= '" + str(startDate)
	queryString += "' AND date < '" + str(endDate) 
	queryString += "' AND resort = " + str(resort)
	if (dayFilter) :
		queryString += " AND forecast_time <> 'night'"

	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	snowCm = results[0][0]
	return convertCmToIn(snowCm)

def getWeatherSummaryForDate(date, resort, db) :
	datePlusOne = date + datetime.timedelta(days=1)
	queryString = "select summary from " + TABLE_NAME 
	queryString += " WHERE date >= '" + str(date)
	queryString += "' AND date < '" + str(datePlusOne) 
	queryString += "' AND resort = " + str(resort)
	queryString += " AND forecast_time <> 'night'"

	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	return results

def getAverageValueForResort(column, startDate, endDate, resort, db, dayFilter=False) :
	queryString = "select avg(" + column + ") from " + TABLE_NAME 
	queryString += " WHERE date >= '" + str(startDate)
	queryString += "' AND date < '" + str(endDate) 
	queryString += "' AND resort = " + str(resort)
	if (dayFilter) :
		queryString += " AND forecast_time <> 'night'"
	
	db.query(queryString)
	r = db.store_result()
	results = r.fetch_row(0)

	avg_value = results[0][0]
	return float(avg_value)

def getAverageFreezingLevelForResort(startDate, endDate, resort, db, dayFilter=False) :
	return getAverageValueForResort('freezing_level', startDate, endDate, resort, db, dayFilter)

def getAverageWindForResort(startDate, endDate, resort, db, dayFilter=False) :
	return getAverageValueForResort('wind', startDate, endDate, resort, db, dayFilter)

def getAverageTemperatureForResort(startDate, endDate, resort, db, dayFilter=False) :
	return getAverageValueForResort('(high_temp + low_temp)/2', startDate, endDate, resort, db, dayFilter)

