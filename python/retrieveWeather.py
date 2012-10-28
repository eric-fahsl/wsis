import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster


#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

resorts = resortMaster.getResorts(db)

#resorts now is a dictionaried list of all resorts in the resort_master DB
#print resorts

for resort in resorts :
	nwsResponse = nwsWeather.getWeather(resort["latitude"],resort["longitude"])
	nwsWeather.writeToDb(nwsResponse,resort['id'], db)

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