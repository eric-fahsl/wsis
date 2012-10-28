import urllib2
import simplejson
import datetime
import time
import _mysql

def getTemperature (location) :
	url = 'http://api.wunderground.com/api/229c169e5500c157/conditions/q/' + location + '.json'
	#print url
	response = simplejson.load(urllib2.urlopen(url) )
	#print response
	current_observation = response["current_observation"]
	weatherData = {}
	weatherData["zip"] = location
	weatherData["temperature"] = current_observation["temp_f"]
	weatherData["time"] = datetime.datetime.now()
	weatherData["humidity"] = current_observation["relative_humidity"]
	weatherData["conditions"] = current_observation["weather"]
	weatherData["local_time"] = current_observation["observation_time"].replace("Last Updated on ", "")
	weatherData["uv"] = current_observation["UV"]
	weatherData["precip_1hr"] = current_observation["precip_1hr_in"]
	weatherData["wind_mph"] = current_observation["wind_mph"]
	#print weatherData
	return weatherData


#Connect to DB
db = _mysql.connect("localhost","data","data","data")

#Retrieve the list of zip codes from the ziplabels table
db.query("select zip from ziplabels")
r = db.store_result()

locations = []
locs = r.fetch_row(0)
for loc in locs :
    locations.append(loc[0])

#locations = ['99354', '55403', '80482', '99501', '78701', '97201', '98101', '92101', '10453', '94111']
for location in locations :
	
	#print "starting for loop iteration " + str(datetime.datetime.now())
	#sleep for 1 second to prevent going over API rate cap
	time.sleep(1)
	weatherData = getTemperature(location)
	queryString = "insert into weather "

	firstTime = True;
	columnNames = "("
	columnValues = "("
	for key in weatherData.iterkeys(): 
		if (firstTime != True):
			columnNames += ", "
			columnValues += ", "	
		columnNames += key
		columnValues += "'" + str(weatherData[key]) + "'"
		firstTime = False
	columnNames += ")"
	columnValues += ")"

	queryString += columnNames + " values " + columnValues + ";"

	#print queryString
	db.query(queryString)
	#Sleep for 10 seconds to prevent from going over API rate of 10 per min
	time.sleep(10)
db.close()