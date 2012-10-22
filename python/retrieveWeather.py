import urllib2
import simplejson
import datetime
import time
import _mysql

def getWundergroundInfo (query) :
	url = 'http://api.wunderground.com/api/229c169e5500c157/conditions/q/' + query + '.json'
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
db = _mysql.connect("localhost","wsis","wsis","wsis")

#Retrieve the columns of the resort_master table, allows for future changes to table
db.query("desc resort_master")
r = db.store_result()

resort_master_fields = {}
results = r.fetch_row(0)

i=0
for result in results :
    #Conduct a reverse-index for field lookups
    resort_master_fields[result[0]] = i
    i += 1
 
#print resort_master_fields

#Retrieve the list of resorts
db.query("select * from resort_master where active='T'")
r = db.store_result()

resorts = []
results = r.fetch_row(0)

for result in results :
	resort = resort_master_fields.copy()
	for k,v in resort_master_fields.iteritems() :
		resort[k] = result[v]
	resorts.append(resort)

#resorts now is a dictionaried list of all resorts in the resort_master DB
print resorts

'''
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
'''

db.close()