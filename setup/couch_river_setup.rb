# This uses curl, so it only works on systems where curl is in the path (i.e. maybe not Windows)
# This script requires the json gem.

require 'rubygems'
require 'json'

# Make sure to set the ind_name, type_name, and modify the "river_json" fields.

es_address = "http://localhost:9200"

###########################
# RECOMMENDATIONS INDEX   #
###########################
ind_name = "recommendations"
type_name = "recommendations"

# This is describes the CouchDB river you are setting up. It's posted to
# elasticsearch to start indexing CouchDB.
river_json = JSON.generate({
  "type" => "couchdb",              # <= The river type, not the data type.
  "couchdb" => {                    # <= Description of the CouchDB server
    "host" => "127.0.0.1",          #    and the DB you want to index.
    "port" => 5984,
    "db" => "recommendations",
    "filter" => nil
  }
})
File.open('river_json.json', 'w') {|f| f.write(river_json) }

# Delete indexes
puts "Deleting index: #{ind_name}"
puts `curl -X DELETE #{es_address}/#{ind_name} 2>/dev/null`
puts "Deleting index: _river"
puts `curl -X DELETE #{es_address}/_river 2>/dev/null`

# Create the index you will use to access the data.
puts "Creating index: #{ind_name}"

puts `curl -X PUT #{es_address}/#{ind_name} -d '{"index" : {"analysis" : {"analyzer" : {"default" : {"type" : "keyword"}}}}}' 2>/dev/null`
#puts `curl -XPUT 'http://localhost:9200/#{ind_name}/#{type_name}/_mapping?ignore_conflicts=true' -d '{ "date" : { "properties" : {"date" : {"type" : "date", "format":"date"}}}}' 2>/dev/null`
puts `curl -XPUT 'http://localhost:9200/#{ind_name}/#{type_name}/_mapping?ignore_conflicts=true' -d '{ "date" : { "properties" : {"date" : {"type" : "string"}}}}' 2>/dev/null`
puts `curl -XPUT 'http://localhost:9200/#{ind_name}/#{type_name}/_mapping?ignore_conflicts=true' -d '{ "location" : { "properties" : {"location" : {"type" : "geo_point"}}}}' 2>/dev/null`

# Configure river
puts "Configuring river"
#puts `curl -XPUT '#{es_address}/_river/my_es_int_idx/_meta' -d '#{river_json}'`
puts `curl -XPUT '#{es_address}/_river/#{ind_name}/_meta' -d '#{river_json}' 2>/dev/null`


