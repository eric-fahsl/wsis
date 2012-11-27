import urllib2
import simplejson
#import _mysql
import datetime
import xmlHelper

sfWeatherUrl = "http://www.snow-forecast.com/resorts/"
sfPostUrl = "/feed.xml"
TABLE_NAME = "weather_data_snowforecast"
SNOW_ACCUM_STR = "snow accumulation of "
SNOW_ACCUM_STR_LEN = len(SNOW_ACCUM_STR)
SNOW_ACCUM_SINGLE_INCH = "inch "
LATER_TODAY_STRING = "Late"
NIGHT_STRING = "ight"
columnFields = {}


def getWeather(resort) :
	print "getting weather for " + resort['snowforecast_id']
	url = sfWeatherUrl + resort + sfPostUrl
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
		row['summary'] = xmlHelper.getSnowForecastTag("mid", "pphrase", p)
		row['low_temp'] = xmlHelper.getSnowForecastTag("mid", "min", p)
		row['high_temp'] = xmlHelper.getSnowForecastTag("mid", "max", p)
		snow_forecast = xmlHelper.getSnowForecastTag("mid", "psnow", p)
		if snow_forecast == "-" :
			snow_forecast = 0
		row['snow_forecast'] = snow_forecast


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
		#db.query(queryString)

		

