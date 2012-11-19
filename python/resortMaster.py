import urllib2
import simplejson
import datetime
import time
import _mysql
import os

COUCH_DB_SERVER = "http://localhost:5984"
COUCH_DB_NAME = "resorts"
COUCH_DB_URL = COUCH_DB_SERVER + "/" + COUCH_DB_NAME 

def getResorts(db) :
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

	return resorts

def updateCouchDocuments(db) :
	resorts = getResorts(db)

	for resort in resorts :

		docId = resort['name'].lower().replace(' ','')
		docUrl = COUCH_DB_URL + "/" + docId
	
		#check if we need to override the existing record
		try :	
			currentDocLocationResponse = simplejson.load(urllib2.urlopen(docUrl))
			resort['_rev'] = str(currentDocLocationResponse['_rev'])
		except urllib2.HTTPError:
			print docId + " not found, will create a new record"
		#print id

		curlCommand = "curl -X PUT " + COUCH_DB_URL + "/" + docId + " -H 'Content-Type: application/json' -d " + "'" + simplejson.dumps(resort) + "'"
		print curlCommand
		os.system(curlCommand)

	#resortRec['']