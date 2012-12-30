import xmlHelper
import datetime
import sys
import dbHelper


TABLE_NAME = 'snowfall_totals'

cleanUpCharacters = [ '"', "'", 'in', '\xe2', '\x80', '\x9d', '\xc2', '\xa2','\xc3','\xa0', '\x82']
replaceCharacters = { "Trace":"0.2", "  ":" " }

def readDataFromFile(filename) :
	contents = open( filename, "r" )
	data = []
	for line in contents:
		content = line.strip().split('|')
		resortWeatherInfo = {}
		resortWeatherInfo['id'] = content[0]
		resortWeatherInfo['name'] = content[1]
		resortWeatherInfo['url'] = content[2]
		resortWeatherInfo['newSnowCommand'] = content[3]
		resortWeatherInfo['lastUpdatedCommand'] = content[4]
		data.append(resortWeatherInfo)
	return data

def cleanInput(input) :
	value = input[0]
	for char in cleanUpCharacters :
		value = value.replace(char, "")
	for key,val in replaceCharacters.items() :
		value = value.replace(key, val)
	value = value.strip()	
	return value

def getNewSnowFallForResort(resort) :

	snowfallEntry = {}

	try :
	    weatherReportPage = resort['url']
	    soup = xmlHelper.createSoup(weatherReportPage)

	    newSnow = -1
	    lastUpdated = ""
	    #sampleCommand = 'xmlHelper.searchContentForTag("Summit","Last 24 hrs:","lh26\">", "</span", str(soup), 0)'
	    exec "newSnow = " + resort['newSnowCommand']
	    exec "lastUpdated = " + resort['lastUpdatedCommand']

	    snowFallDate = datetime.date.today() - datetime.timedelta(days=1)

	    snowfallEntry = {}
	    snowfallEntry['resort'] = resort['id']
	    snowfallEntry['snowfall'] = cleanInput(newSnow)
	    snowfallEntry['updated_time'] = cleanInput(lastUpdated)
	    snowfallEntry['date'] = str(snowFallDate)

	    return snowfallEntry
	except :
		print "ERROR on resort: " + resort['name'] + ":  " + str(sys.exc_info()[0])
		return None

def retrieveNewSnow(filename, db) :
	resortWeatherInfos = readDataFromFile(filename)
	for resortWeatherInfo in resortWeatherInfos :
		snowfallTotal = getNewSnowFallForResort(resortWeatherInfo)
		queryStatement = dbHelper.createInsertStatement(snowfallTotal, TABLE_NAME, False)
		
		print queryStatement
		db.query(queryStatement)


'''
resortWeatherInfos = readDataFromFile("ski_resorts_snowfall.txt")
for resortWeatherInfo in resortWeatherInfos :
	snowfallTotal = getNewSnowFallForResort(resortWeatherInfo)
	queryStatement = dbHelper.createInsertStatement(snowfallTotal, TABLE_NAME)
	print queryStatement
'''