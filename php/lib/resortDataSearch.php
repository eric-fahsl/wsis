<?

include('esSearchHelper.php');

	$powderResults = array();
	$bluebirdResults = array();
	$results = search($_GET);


	foreach ($results["hits"]["hits"] as $rec) {
		//adding time of day for javascript support
	 	$dataPoint = array($rec['_source']['date'] . " 00:00:00", $rec['_source']['powder']['rating']);
	 	array_push($powderResults, $dataPoint);

	 	$dataPoint = array($rec['_source']['date'] . " 00:00:00", $rec['_source']['bluebird']['rating']);
	 	array_push($bluebirdResults, $dataPoint);
	}

	$jsonResults = array($powderResults, $bluebirdResults);
	echo json_encode($jsonResults, true);

?>