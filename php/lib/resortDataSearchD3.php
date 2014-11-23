<?

include('esSearchHelper.php');

    $dataResults = array();
	$results = search($_GET);
	foreach ($results["hits"]["hits"] as $rec) {
		$dt = new DateTime($rec['_source']['date']);
		$dateFormatMonthDay = $dt->format('M j');
		
		$dateData = array(
			"Date" => $dateFormatMonthDay,
			"Powder" => $rec['_source']['powder']['rating'],
			"Snow Quality" => $rec['_source']['snow_quality']['rating'],
			"Bluebird" => $rec['_source']['bluebird']['rating'],
			"sysDate" => $rec['_source']['date']
		);
		array_push($dataResults, $dateData);
	}
	header('Content-Type: application/json');
	echo json_encode($dataResults, true);
?>