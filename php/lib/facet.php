<?php 

include('esSearchHelper.php');

	  $facets = search($_GET);
	  //print json_encode($facets);
	  $facets = $facets['facets'];
	  //print $facets['Date'];
	  $dateProvided = date("Y-m-d");
	  parse_str($_SERVER['QUERY_STRING'], $parameters);
	  if (isset($parameters['date'])) {
	  	$dateProvided=$parameters['date'];
	  	if (strpos($dateProvided, ",") === false) {
	  		$dateProvided .= ",";
	  	}
	  }


?>

<?php
		$i = 0;
		 foreach ($facets['Date']['terms'] as $facet) {
		 	$searchDate = $facet['term'];
		 	$date = new DateTime($searchDate);
			$displayDate = $date->format('D m/d/y'); 

		 	echo "<li id='date$i' onclick='clickFilter(\"date\", \"$searchDate\", $i)'><span>$displayDate</span><div class='x' id='date-x-$i'>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>
	<span id="distanceSection">
	<div class="header">
		<h3>Distance</h3>
	</div>
	<ol>
	<?php
		$distances = array(100, 200, 400);
		$i = 0;
		 foreach ($distances as $facet) {
		 	$distance = $facet;
		 	echo "<li id='distance$i' onclick='clickFilter(\"distance\", \"$distance\", $i)'><span>Within $distance miles</span><div class='x' id='distance-x-$i'>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>
	</span>
	<div class="header">
		<h3>Region</h3>
	</div>
	<ol>
	<?php
		$i = 0;
		 foreach ($facets['Region']['terms'] as $facet) {
		 	$region = $facet['term'];
		 	echo "<li id='region$i' onclick='clickFilter(\"region\", \"$region\", $i)'><span>$region</span><div class='x' id='region-x-$i'>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>

	<div class="header">
		<h3>State</h3>
	</div>
	<ol>
	<?php
		$i = 0;
		 foreach ($facets['State']['terms'] as $facet) {
		 	$state = $facet['term'];
		 	if (strcmp($jsStateValue, $state) == 0) {
		 		$jsStateIndex = $i;
		 	}
		 	echo "<li id='state$i' onclick='clickFilter(\"state\", \"$state\", $i)'><span>$state</span><div class='x' id='state-x-$i'>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>