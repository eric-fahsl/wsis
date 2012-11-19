# This uses curl, so it only works on systems where curl is in the path (i.e. maybe not Windows)
# This script requires the json gem.

require 'rubygems'
require 'json'

# Make sure to set the ind_name, type_name, and modify the "river_json" fields.

ind_name = "recommendations"
type_name = "recommendations"

es_address = "http://localhost:9200"

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

# This is the mapping for the data that you want to index.

#File.open('mapping.json', 'w') {|f| f.write(mapping) }

# Delete indexes
puts "Deleting index: #{ind_name}"
puts `curl -X DELETE #{es_address}/#{ind_name}`
puts "Deleting index: _river"
puts `curl -X DELETE #{es_address}/_river`

# Create the index you will use to access the data.
puts "Creating index: #{ind_name}"
#puts `curl -X PUT #{es_address}/#{ind_name} 2>/dev/null`

puts `curl -X PUT #{es_address}/#{ind_name} -d '{"index" : {"analysis" : {"analyzer" : {"default" : {"type" : "keyword"}}}}}'`
puts `curl -XPUT 'http://localhost:9200/recommendations/recommendations/_mapping?ignore_conflicts=true' -d '{ "date" : { "properties" : {"date" : {"type" : "string"}}}}'`

# Create type and upload mapping
#puts "Creating type and uploading mapping."
#puts `curl -X PUT '#{es_address}/#{ind_name}/#{type_name}/_mapping' -d '#{mapping}' 2>/dev/null`

# Configure river
puts "Configuring river"
puts `curl -XPUT '#{es_address}/_river/my_es_int_idx/_meta' -d '#{river_json}'`

