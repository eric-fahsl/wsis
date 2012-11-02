import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster
import os
import uuid

PCT_LEVER_NEW_SNOW = 0.5
PCT_LEVEL_PREV_SNOW = 0.25
PCT_LEVEL_PROJ_SNOW = 0.25
UPPER_LIMIT = 16
POWDER_STAR_RATING_CUTOFF = [ 0, 2.0, 4.0, 6.0, 8.0, 10.0 ]
COUCH_DB_SERVER = "http://localhost:5984"
COUCH_DB_NAME = "recommendations"
COUCH_DB_URL = COUCH_DB_SERVER + "/" + COUCH_DB_NAME 


def checkUpperLimit(snowfallAmount) :
	if snowfallAmount > UPPER_LIMIT :
		return UPPER_LIMIT
	return snowfallAmount

def calcPowder(new_snow, previous_snow, projected_snow) :
	previous_snow = checkUpperLimit(previous_snow)
	projected_snow = checkUpperLimit(projected_snow)
	
	adjustedSnow = new_snow * PCT_LEVER_NEW_SNOW + previous_snow * PCT_LEVEL_PREV_SNOW + projected_snow * PCT_LEVEL_PROJ_SNOW
	starRating = -1
	for cutoff in POWDER_STAR_RATING_CUTOFF : 
		starRating += 1
		if adjustedSnow < cutoff :
			break
	return starRating 

#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

resorts = resortMaster.getResorts(db)

today = str(datetime.date.today() + datetime.timedelta(days=0))
todayPlusOne = str(datetime.date.today() + datetime.timedelta(days=1))
todayPlusTwo = str(datetime.date.today() + datetime.timedelta(days=2))

for resort in resorts :

	#get the recommendations for tomorrow
	newSnowTomorrow = nwsWeather.getTotalSnowfallForRangeForResort(today, todayPlusOne, resort['id'], db)
	projectedSnowTomorrow = nwsWeather.getTotalSnowfallForRangeForResort(todayPlusOne, todayPlusTwo, resort['id'], db)

	tomorrow_rec = {}
	docId = resort['name'].lower().replace(' ','') + "_" + todayPlusOne + "_" + "powder"
	docUrl = COUCH_DB_URL + "/" + docId

	try :	
		currentDocLocationResponse = simplejson.load(urllib2.urlopen(docUrl))
		tomorrow_rec['_rev'] = str(currentDocLocationResponse['_rev'])
	except urllib2.HTTPError:
		print docId + " not found, will create a new record"
	tomorrow_rec['Resort'] = resort['name']
	tomorrow_rec['State'] = resort['state']
	tomorrow_rec['createdOn'] = str(datetime.date.today())
	tomorrow_rec['Type'] = "Powder"
	tomorrow_rec['Date'] = todayPlusOne
	tomorrow_rec['snow_prev'] = float(0.3)
	tomorrow_rec['snow_new'] = float(newSnowTomorrow)
	tomorrow_rec['snow_forecast'] = float(projectedSnowTomorrow)
	rating = calcPowder(tomorrow_rec['snow_new'], tomorrow_rec['snow_prev'], tomorrow_rec['snow_forecast'])
	tomorrow_rec['Rating'] = rating

	
	#print id

	curlCommand = "curl -X PUT " + COUCH_DB_URL + "/" + docId + " -H 'Content-Type: application/json' -d " + "'" + simplejson.dumps(tomorrow_rec) + "'"
	print curlCommand
	os.system(curlCommand)

	#resortRec['']

db.close()



