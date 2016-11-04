curl -X PUT http://localhost:9200/recommendations -d '{"index" : {"analysis" : {"analyzer" : {"default" : {"type" : "keyword"}}}}}' 
#curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "date" : { "properties" : {"date" : {"type" : "date", "format":"date"}}}}' 
curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "date" : { "properties" : {"date" : {"type" : "string"}}}}' 
curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "location" : { "properties" : {"location" : {"type" : "geo_point"}}}}' 
curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "createdOn" : { "properties" : {"createdOn" : {"type" : "string"}}}}' 

curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "powder" : { "properties" : { "powder" : { "properties": { "rating" : { "type": "float"}}}}}}' 
curl -XPUT 'http://localhost:9200/recommendations/_mapping?ignore_conflicts=true' -d '{ "bluebird" : { "properties" : { "bluebird" : { "properties": { "rating" : { "type": "float"}}}}}}' 
