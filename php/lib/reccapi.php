<?php 

include('esSearchHelper.php');

$resultClass = "span2 recresult";
$dateFormat = "l, F j";

//check if showing a specific date, if so, no extra headers
if (isset($_GET['date'])) {
	$results = search($_GET);
	$homeWidget = false;
	$showDate = false;

//    $reccResults = array();
    //Iterate through all of the recommendation results and add to the reccResults array
//    foreach ($results['hits']['hits'] as $rec) {
//        $rec = $rec['_source'];
//        $reccResults[] = array(
//            'resort_name' => $rec['resort_name'],
//            'powder_rating' => $rec['powder']['rating'],
//            '_id' => $rec['_id'],
//            'state_full' => $rec['state_full'],
//            'freezing_level_rating' => $rec['freezing_level']['rating'],
//            'resort' => $rec['resort'],
//            'bluebird_rating' => $rec['bluebird']['rating'],
//            'date' => $rec['date']
//        );
//    }


    $jsonResults = array (
        "results" => $results['hits']['hits'],
        "facets" => $results['facets']
    );

    echo json_encode($jsonResults);
//    echo json_encode($results["hits"]["hits"], true);
	//foreach ($results["hits"]["hits"] as $rec) {
	// 	displayRecommendationWidget($rec['_source'], $resultClass, $showDate);
	//}


} else {

	$displayedNoResults = 0;
	$resultClass = "span2 recresultLanding";
	$requestParams = $_GET;
	$requestParams['size'] = 5;
	$startDate = date("Y-m-d");
	if (isset($_GET['startDate'])) {
		$startDate = strtotime($_GET['startDate']);
        $requestParams['date'] = $startDate;
    }

    $results = search($requestParams);

    $allResults = array();
    $allResults[] = $results['hits']['hits'];


    /*
	for ($i=0; $i<6; $i++) {

		//$dateForRec = strtotime(strtotime($startDate), "+$i day");
		//$dateForRec = date("Y m d",strtotime("+$i day",$startDate));
		//echo "<br/>" . $dateForRec
		$dateForRec = date("Y-m-d",strtotime("+$i day", $startDate));

		$date = new DateTime($dateForRec);
		$dateForRecDisplay = $date->format($dateFormat); 
		
		$requestParams['date'] = $dateForRec;
		$results = search($requestParams);

		$allResults[] = $results['hits']['hits'][0];
		//json_encode($results['hits'], true);


		if ($results["hits"]["total"] == 0 ) {
			if ($displayedNoResults > 1) {
				echo "<h3>No results found, please modify your search and try again</h3>";
				$displayedNoResults = -10;
			}
			$displayedNoResults++;
		} 
		$landingRecClass = $resultClass;
		$j=0;
		foreach ($results["hits"]["hits"] as $rec) {
			if ($j == 0) {
				echo "<h5 onclick='clickFilter(\"date\", \"$dateForRec\", $i)'>$dateForRecDisplay</h5>";
			}
			if ($j >= 3) {
				$landingRecClass = $resultClass . " hidden-phone";
			}
		 	displayRecommendationWidget($rec['_source'], $landingRecClass, False);
		 	$j++;

		}
		echo "<div style='clear:both'></div>"; 

	}
    */
	echo json_encode($allResults, true);
	
}
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>