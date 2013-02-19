<?

include('esSearchHelper.php');

	$powderResults = array();
	$bluebirdResults = array();
	$freezingLevelResults = array();
	$freezingLevelTop = array();
	$freezingLevelBottom = array();
	$results = search($_GET);

	$timestampAppendStr = " 00:00:00";

	foreach ($results["hits"]["hits"] as $rec) {
		//adding time of day for javascript support
	 	$dataPoint = array($rec['_source']['date'] . $timestampAppendStr, $rec['_source']['powder']['rating']);
	 	array_push($powderResults, $dataPoint);

	 	$dataPoint = array($rec['_source']['date'] . $timestampAppendStr, $rec['_source']['bluebird']['rating']);
	 	array_push($bluebirdResults, $dataPoint);

	 	$dataPoint = array($rec['_source']['date'] . $timestampAppendStr, $rec['_source']['freezing_level']['freezing_level_avg']);
	 	array_push($freezingLevelResults, $dataPoint);

	 	$dataPoint = array($rec['_source']['date'] . $timestampAppendStr, $rec['_source']['freezing_level']['top']);
	 	array_push($freezingLevelTop, $dataPoint);

	 	$dataPoint = array($rec['_source']['date'] . $timestampAppendStr, $rec['_source']['freezing_level']['bottom']);
	 	array_push($freezingLevelBottom, $dataPoint);
	}

	$jsonResults = array($freezingLevelTop, $freezingLevelBottom, $freezingLevelResults, $bluebirdResults, $powderResults);
	echo json_encode($jsonResults, true);

?>