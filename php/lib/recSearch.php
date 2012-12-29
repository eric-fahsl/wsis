<?php 

include('esSearchHelper.php');

$resultClass = "span2 recresult";
$dateFormat = "l, F j";

//check if showing a specific date, if so, no extra headers
if (isset($_GET['date'])) {
	$results = search($_GET);
	$homeWidget = false;
	$showDate = false;

	if (isset($_GET['hw'])) {
		$resultClass = "recresulthome";
	}

	if ($results["hits"]["total"] == 0) {
		echo "<h3>No results found, please modify your search and try again</h3>";
	} else {
		$date = new DateTime($_GET['date']);
		$dateForRecDisplay = $date->format($dateFormat); 
		//don't show this on the home page
		if (!isset($_GET['date'])) {
			echo "<h4>Recommendations For $dateForRecDisplay</h4>";
		}
	}
	foreach ($results["hits"]["hits"] as $rec) {
	 	displayRecommendationWidget($rec['_source'], $resultClass, $showDate);
	}


} else {

	$displayedNoResults = 0;
	$resultClass = "span2 recresultLanding";
	$requestParams = $_GET;
	$requestParams['size'] = 6;
	for ($i=0; $i<6; $i++) {
		$dateForRec = date("Y-m-d",strtotime("+$i day"));
		$date = new DateTime($dateForRec);
		$dateForRecDisplay = $date->format($dateFormat); 
		
		$requestParams['date'] = $dateForRec;
		$results = search($requestParams);
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
	
}
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>