import urllib2
import simplejson
import datetime
import time
import _mysql
# import nwsWeather
import resortMaster
import createRecommendations
import snowforecastWeather


#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

resorts = resortMaster.getResorts(db)


resorts = resortMaster.getResorts(db)

#for each resort, calculate the next several days out
for resort in resorts :
	for i in range(1,6) :
		createRecommendations.calculateRecommendation(datetime.date.today() + datetime.timedelta(days=i), resort, db)
	#for i in range(1,20) :
	#	calculateRecommendation(datetime.date.today() - datetime.timedelta(days=i), resort, db)


db.close()