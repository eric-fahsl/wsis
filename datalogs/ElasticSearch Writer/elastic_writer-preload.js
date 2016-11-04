var fs = require('fs');
var jsonpack = require('jsonpack');
// var readPath = 'results/latestResults2.json';
// var readStream = fs.createReadStream(readPath, {flags: 'r', encoding: 'utf-8'});
var elasticsearch = require('elasticsearch');
// var buf = '';


var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});



console.log("\n *STARTING* \n");
// Get content from file
var contents = fs.readFileSync("preload-feb10.json");
// var contents = fs.readFileSync("preload-more-complete.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);

var productOfferings = jsonContent.referenceData.productOfferings.productOffering;
console.log("Product Offering Size", productOfferings.length);
for (var i in productOfferings) {
  console.log("Attempting to load index ", i, productOfferings[i]["@productOfferingId"]);
  processRecord(productOfferings[i]);
}


function processRecord(record) { // here's where we do something with a record
   
    // record.image = [];
    // record.conflictingOffers = [];
    record.conflictingOffering = jsonpack.pack(record.conflictingOffering);
    // record.productSpecification = [];
    // console.log("JSONPACK OUTPUT", jsonpack.pack(record.offeringVariant));
    record.offeringVariant = jsonpack.pack(record.offeringVariant);
    record.productOfferingComponent = jsonpack.pack(record.productOfferingComponent);
    record.compatibleOffering = jsonpack.pack(record.compatibleOffering);

    // for (var i in record) {
    //   console.log(record["@productOfferingId"], i, "element size", JSON.stringify(record[i]).length);
    // }

    // if (record[record.length-1] == '\r') record=record.substr(0,record.length-1); // discard CR (0x0D)

    // if (record.length > 0) { // ignore empty records
        // var obj = JSON.parse(record); // parse the JSON
           client.create({
              index: 'product-offering-test',
              id: record["@productOfferingId"],
              type: 'block',
              body: record
            }, function (error, response) {
              if (error) {
                console.log("Error creating Record", record["@productOfferingId"], JSON.stringify(record).length);
                console.log('elasticsearch error: ' + error);
              } 
              else if (response) {
                console.log("Successful Record Creation:", record["@productOfferingId"], JSON.stringify(record).length);
              } 
            });
        
    // }
}
