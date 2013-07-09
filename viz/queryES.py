import requests, json

es_url = "http://localhost:9200/recommendations/_search"

#relevant_date = "2012-12-20"
def retrieveReccsForDate(relevant_date) :

	data = json.dumps({"query": {"filtered": {"query": {"bool": {"must": [{"term": {"date": relevant_date}}]}}}},"size": "300","fields": [ "location", "powder.rating", "bluebird.rating", "date", "freezing_level.rating" ]}) 
	r = requests.post(es_url, data)

	#response_data = r.json()
	return r.json()