import csv
import _mysql

#f = open("ski_resorts.csv")
f = open('ski_resorts.csv', 'rU')
data = csv.reader(f)
fields = data.next()

db = _mysql.connect("localhost","wsis","wsis","wsis")

for values in data :

	#values = line.strip().split(',')

	resort = {}
	for i in range(0, len(fields)) :
		resort[fields[i]] = values[i]

	'''
	resort['id'] = values[0]
	resort['name'] = values[2]
	resort['state'] = values[1]
	resort['latitude'] = values[3]
	resort['longitude'] = values[4]
	resort['web_url'] = values[7]
	resort['snow_forecast_id'] = values[6]
	resort['active'] = 'F'

	if resort['longitude'] != '' :
		resort['active'] = 'T'
	'''

	#Only insert if active
	if resort['active'] == 'T' :
		insertStatement = "INSERT INTO resort_master "
		firstTime = True
		columnNames = ""
		columnValues = ""
		updateString = ""
		for key, val in resort.iteritems() :
			if (firstTime != True):
				columnNames += ", "
				columnValues += ", "
				updateString += ", "
			columnNames += key
			columnValues += "'" + val + "'"
			updateString += key + "='" + val + "'"
			firstTime = False
		
		insertStatement += " ( " + columnNames + " ) "	
		insertStatement += " VALUES "
		insertStatement += " ( " + columnValues + " ) "
		insertStatement += " ON DUPLICATE KEY Update " + updateString

		print insertStatement
		db.query(insertStatement)
	
f.close()
db.close()
