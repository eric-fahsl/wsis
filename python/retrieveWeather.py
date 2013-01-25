import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster
import createRecommendations
import snowforecastWeather
import snowParser

QUERY_DATA_SOURCES = True;
#Only use this linefor debugging
#QUERY_DATA_SOURCES = False;

#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

resorts = resortMaster.getResorts(db)

#resorts now is a dictionaried list of all resorts in the resort_master DB
#print resorts

if QUERY_DATA_SOURCES :
	for resort in resorts :
		snowforecastWeather.getWeather(resort, db)
		if (resort['domestic'] == 'T') :
			nwsWeather.getWeather(resort, db)

createRecommendations.create(db)


#moved this to the snowParser file
#if QUERY_DATA_SOURCES :
#	snowParser.retrieveNewSnow("ski_resorts_snowfall.txt", db)

db.close()