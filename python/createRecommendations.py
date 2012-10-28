import urllib2
import simplejson
import datetime
import time
import _mysql
import nwsWeather
import resortMaster

PCT_LEVER_NEW_SNOW = 0.5
PCT_LEVEL_PREV_SNOW = 0.25
PCT_LEVEL_PROJ_SNOW = 0.25
UPPER_LIMIT = 16
POWDER_STAR_RATING_CUTOFF = [ 0, 2.0, 4.0, 6.0, 8.0, 10.0 ]

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

for resortRec in resorts :
	resortRec['createdOn'] = datetime.datetime.now()
	#data = nwsWeather.getData(resortRec['id'], db)
	print resortRec

	today_rec = {}
	today_rec['new_snow'] = float(11.7)
	today_rec['projected_snow'] = float(90.3)
	today_rec['previous_snow'] = float(10.1)
	rating = calcPowder(today_rec['new_snow'], today_rec['previous_snow'], today_rec['projected_snow'])

	#resortRec['']

db.close()


	