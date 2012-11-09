<?php 


function buildQuery() {
	$match_all = array ( "match_all" => array() );

	$mustTerms = array();
	if ($_GET["date"] != null) {
		$term = createTerm("Date", $_GET["date"]);
		array_push($mustTerms, $term);
	}

	if ($_GET["state"] != null) {
		$term = createTerm("State", $_GET["state"]);
		array_push($mustTerms, $term);
	}

	if ($_GET["rating"] != null) {
		$term = createTerm("Rating", $_GET["rating"]);
		array_push($mustTerms, $term);
	}


	$query = array(
		"query" => array(
			"bool" => array(
				"must" => $mustTerms
				)
			)
		);
	// /print json_encode($query);
	//$query = array ( "query" => $match_all );
	return $query;
}

function createTerm($name, $value) {
	$term = array(
			"term" => array(
				$name => $value
			)
		);
	return $term;
}

function buildSort() {
	$sort = array ( "sort" => 
	array(
		"Rating" => array(
			"order" => "desc"
			)
		)
	);
	return $sort;	
}





$data_string = json_encode(array (
	buildQuery(), buildSort()
));

#print json_encode($datatopost);

//$url = "http://localhost:9200/recommendations/_search -d '" . json_encode($datatopost) . "'";

$ch = curl_init("http://localhost:9200/recommendations/_search");                                                                      
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "XGET");                                                                     
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
);      
$result = curl_exec($ch);

$decoded = json_decode($result, true);
print json_encode($decoded["hits"]);                                                                                                             
?>