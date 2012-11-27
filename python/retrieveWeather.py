import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster
import createRecommendations
import snowforecastWeather


#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

resorts = resortMaster.getResorts(db)

#resorts now is a dictionaried list of all resorts in the resort_master DB
#print resorts

for resort in resorts :
	snowforecastWeather.getWeather(resort, db)
	'''
	nwsResponse = nwsWeather.getWeather(resort["latitude"],resort["longitude"])
	nwsWeather.writeToDb(nwsResponse,resort['id'], db)

createRecommendations.create(db)
'''
db.close()