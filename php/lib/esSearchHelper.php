<?php

function addSearchParam(&$mustTerms, $parameter) {
	if (isset($_GET[$parameter])) {
		$term = createTerm($parameter, $_GET[$parameter]);
		array_push($mustTerms, $term);
	}
}

function buildQuery() {

	$mustTerms = array();
	//addSearchParam($mustTerms, "date");
	addSearchParam($mustTerms, "region");
	addSearchParam($mustTerms, "state");
	addSearchParam($mustTerms, "rating");
	addSearchParam($mustTerms, "resort");

	if (isset($_GET['dateStart'])) {
		array_push($mustTerms, 
			array(
				"range" => array( 
					"date" => array(
						"gte" => $_GET['dateStart']
					)
				)
			) 
		);
	}
	if (isset($_GET['dateMin'])) {
		array_push($mustTerms, 
			array(
				"range" => array( 
					"date" => array(
						"gt" => $_GET['dateMin']
					)
				)
			) 
		);
	}
	if (isset($_GET['dateMax'])) {
		array_push($mustTerms, 
			array(
				"range" => array( 
					"date" => array(
						"lt" => $_GET['dateMax']
					)
				)
			) 
		);
	}

	$shouldTerms = array();

	if (isset($_GET["date"])) {
		$searchDates = explode(",", $_GET["date"]);
		foreach ($searchDates as $searchDate) {
			array_push($shouldTerms, createTerm("date", $searchDate));
		}
	}

	$mustNotTerms = array();
	createExcludeTerm($mustNotTerms, "regionx", "region");
	createExcludeTerm($mustNotTerms, "powderx", "powder.rating");
	createExcludeTerm($mustNotTerms, "bluebirdx", "bluebird.rating");
	createExcludeTerm($mustNotTerms, "statex", "state");
	/*
	if (isset($_GET["regionx"])) {
		$regions = explode(",", $_GET["regionx"]);
		foreach ($regions as $region) {
			array_push($mustNotTerms, createTerm("region", $region));
		}	
	}
	if (isset($_GET["regionx"])) {
		$regions = explode(",", $_GET["regionx"]);
		foreach ($regions as $region) {
			array_push($mustNotTerms, createTerm("region", $region));
		}	
	}*/

	$query = array(
			"bool" => array(
				"must" => $mustTerms,
				"must_not" => $mustNotTerms,
				"should" => $shouldTerms,
				"minimum_number_should_match" => 1
				)
			);
	// /print json_encode($query);
	//$query = array ( "query" => $match_all );

	
	$filter = array();
	if (isset($_GET['distance'])) {
		$filter = array(
			"geo_distance" => array(
				"distance" => $_GET['distance'] . "mi",
				"location" => $_GET['coords']
			)
		);
	}
	$filteredArray = array (
		"query" => $query,
		"filter" => $filter	
	);

	$outerQuery = array(
		"filtered" => $filteredArray
	);

	return $outerQuery;
}

function createExcludeTerm(&$excludeArray, $parameter, $termName) {
	if (isset($_GET[$parameter]) && $_GET[$parameter] != "") {
		$regions = explode(",", $_GET[$parameter]);
		foreach ($regions as $region) {
			array_push($excludeArray, createTerm($termName, $region));
		}	
	}
}

function createTerm($name, $value) {
	
	$term = array(
			"term" => array(
				$name => $value
			)
		); 
	return $term;
}

function addSortTerm(&$sort, $term, $order) {
	array_push($sort, 
		array($term => array(
			"order" => $order
		)));
}

function addGeoSort(&$sort, $coords) {
	array_push($sort, 
		array("_geo_distance" => 
			array(
				"location" => $coords,
				"order" => "asc",
				"unit" => "mi"
			)
		)
	);
}


function buildSort() {
	$sort = array();

	if (isset($_GET['sortDate'])) {
		addSortTerm($sort, "date", $_GET['sortDate']);
	}

	//check if the lat/lon coordinates are provided, if so, this is the primary sort

	if (isset($_GET['sort'])) {
		if (isset($_GET['coords']) && strcasecmp($_GET['sort'], 'distance') == 0) {
			addGeoSort($sort, $_GET['coords']);
		} elseif (strcasecmp($_GET['sort'], 'bluebird') == 0) {
			addSortTerm($sort, "bluebird.rating", "desc");
		} elseif (strcasecmp($_GET['sort'], 'fl') == 0) {
			addSortTerm($sort, "freezing_level.rating", "desc");
		}	
	}

	addSortTerm($sort, "powder.rating", "desc");
	addSortTerm($sort, "bluebird.rating", "desc");
	addSortTerm($sort, "powder.snow_new", "desc");
	addSortTerm($sort, "powder.snow_forecast", "desc");

	return $sort;	
}

function buildFacets() {
	$facets = array(
		"Date" => array(
			"terms" => array(
				"field" => "date",
				"order" => "term"
			)
		),
		"Region" => array(
			"terms" => array(
				"field" => "region"
			)
		),
		"State" => array(
			"terms" => array(
				"field" => "state",
				"order" => "term",
				"size" => 20
			)
		)
	);
	return $facets;
}

function search($_GET) {
	$queryArray = array();
	if (isset($_GET['facet'])) {
		$queryArray = array (
			"query" => buildQuery(), 
			"facets" => buildFacets(), 
			"size" => "0"
		);
	} else {
		$queryArray = array (
			"query" => buildQuery(), 
			"sort" => buildSort()
		);
	}

	if (isset($_GET['size']) && is_numeric($pageSize = $_GET['size'])) {
		if (intval($pageSize) > 30) {
			$pageSize = 30;
		}
		$queryArray['size'] = $pageSize;
	}

	$queryObject = json_encode($queryArray);
	//print $queryObject;

	return queryES("http://localhost:9200/recommendations/_search", $queryObject);
}

function queryES($searchUrl, $queryObject) {
	$ch = curl_init($searchUrl);                                                                      
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "XGET");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $queryObject);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
	    'Content-Type: application/json',                                                                                
	    'Content-Length: ' . strlen($queryObject))                                                                       
	);      
	$esResult = curl_exec($ch);
	$results = json_decode($esResult, true);

	return $results;
}

function getStates() {
	$queryArray = array (
		"query" => array(
			"match_all" => json_decode ("{}")
		), 
		"facets" => array(
			"State" => array(
				"terms" => array(
					"field" => "state_full",
					"order" => "term",
					"size" => 50
				)
			)
		),
		"size" => 0
	
	);
		//"sort" => buildSort()

	$queryObject = json_encode($queryArray);
	//print $queryObject;

	return queryES("http://localhost:9200/resorts/_search", $queryObject);
}

function getResortsForState($state) {
	$sort = array();
	addSortTerm($sort, "name", "asc");

	$queryArray = array (
		"query" => array(
			"bool" => array(
			
				"must" => array(
					array(
						
							"term" => array(
								"state_full" => $state
							)
							
						
					)
				)
		
			)
		),
		"size" => 100,
		"sort" => $sort
	);

	$queryObject = json_encode($queryArray);
	//print $queryObject;

	return queryES("http://localhost:9200/resorts/_search", $queryObject);

}

function printSnowFlakes($count, $large = False) {
	$width = $count * 30;
	$class = "flakes";
	if ($large) {
		$class = "flakes-large";
		$width = $count * 60;
	}
  	echo "<div class='$class' style='width: ". $width . "px' title='Rating: $count / 5'></div>";
}

function printSuns($count, $large = False) {
	$width = $count * 30;
	$class = "suns";
	if ($large) {
		$class = "suns-large";
		$width = $count * 60;
	}
  	echo "<div class='$class' style='width: ". $width . "px' title='Rating: $count / 5'></div>";
}

function printFreezingLevel($rating, $freezing_level, $large = False) {
	$offset = -24 + (24/4) * ($rating-1);
	$largeClass = "";
	if ($large) {
		$largeClass = "-large";
		$offset = -30 + (30/4) * ($rating-1);
	}
	echo "<div class='mtnContainer$largeClass'><div class='mtnShading$largeClass' style='background-position-y: " . $offset . "px;' title='Freezing Level: $freezing_level'></div></div>";
}

function displayRecommendationWidget($rec, $resultClass, $showDate) {
	?>
	<div class="<?= $resultClass ?>">
		<?php 
			if ($showDate) {
				$dtime = new DateTime($rec['date']);
				$displayDate = $dtime->format('l, M j');
				//echo $dtime->format('l, M j') . "<br/>";
				?>
				<a href="resorts?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>"><?= $displayDate ?></a>
				<?php
			} else {
				?>
				<div class="recheader"><a href="resorts?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>"><?=$rec['resort_name'] ?></a></div>
				<span><?=$rec['state_full'] ?></span><br/>
				<?php
			}
		?>
		<?php 
			printSnowFlakes($rec['powder']['rating']); 
			printSuns($rec['bluebird']['rating']); 
			printFreezingLevel($rec['freezing_level']['rating'], $rec['freezing_level']['freezing_level_avg']);
		
		echo "</div>";
}

?>