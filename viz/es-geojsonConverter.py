import json
import queryES

#first open the availale dates
#filename to open 
filename = "availDates.json"

json_file=open(filename)
response_data = json.load(json_file)
json_file.close()
dates = []
allData = []
error = ""

for term in response_data['facets']['Dates']['terms'] :
	dates.append(term['term'])

for date in dates :

	response_data = queryES.retrieveReccsForDate(date)

	features = []
	try :
		for hit in response_data['hits']['hits'] :

			recc = hit['fields']

			coordinates = [ float(recc['location']['lon']), float(recc['location']['lat']) ] 

			geometry = { "type": "Point", "coordinates": coordinates }
			properties = { "count": recc['powder.rating'] }

			feature = {'type': 'Feature', 'id' : hit['_id'], "geometry" : geometry, "properties": properties}
			
			features.append(feature)

		data = {"date":date, "type": "FeatureCollection", "features": features}
		allData.append(data)
	except :
		error = ""

#json.dumps(allData)
print json.dumps(allData)

