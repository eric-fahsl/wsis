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


createRecommendations.calculateRecommendation(datetime.date.today() + datetime.timedelta(days=6), resorts[0], db)


db.close()