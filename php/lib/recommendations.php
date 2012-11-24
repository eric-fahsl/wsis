<?php
	include("esSearchHelper.php");


	//Retrieve the Facets
	  $requestAttributes = array (
	  	  "dateMin" => date("Y-m-d"),
	  	  "facet" => "t"
	  );
	  $facets = search($requestAttributes);
	  //print json_encode($facets);
	  $facets = $facets['facets'];
	  //print $facets['Date'];
	  
?>

<script type="text/javascript">
	

	facets = {
		"date": 5,
		"regionx": 5,
		"powderx": 5,
		"bluebirdx": 5,
		"statex": 10
	}

	function search() {
		parameters = "";

		for (var searchParam in facets) {
			parameters += "&" + searchParam + "=";
			needComma = false;
			for (i=0; i<facets[searchParam]; i++) {
				excludeTerm = false;
				if (searchParam.indexOf('x') >= 0) 
					excludeTerm = true;

				element = $("#" + searchParam + i)[0];
				if ( (!excludeTerm && element.checked ) || (excludeTerm && !element.checked)) {
					if (needComma) 
						parameters += ",";
					parameters += $("#" + searchParam + i).val();
					needComma = true;
				}


				// else if (searchParam.indexOf('x'))
				// 	parameters += $("#" + searchParam + i).val() + ",";
			}
		}


		$('#results').load('/lib/recSearch?size=100' + parameters);
	}
</script>

<div id="filterblock" style="width:235px; float:left; min-height: 100%;">

	<h4>Date</h4>
	<table>
	<?php

		$i = 0;
		foreach ($facets['Date']['terms'] as $facet) {
		 	echo "<tr><td>";

		 	$searchDate = $facet['term'];
		 	$date = new DateTime($searchDate);
			echo $date->format('m/d/y (D)'); 

			echo "</td><td>";

			echo "<input type='checkbox' value='$searchDate' id='date$i' onclick='search();'";
			if ($i == 0) {
				echo "checked";
			}  
			echo " />";

			echo "</td></tr>\n";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>Region</h4>
	<table>
	<?php
		$i = 0;
		 foreach ($facets['Region']['terms'] as $facet) {
		 	$region = $facet['term'];
		 	echo "<tr><td>";
		 	echo $region;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$region' id='regionx$i' checked onclick='search();' />";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>Powder Rating</h4>
	<table>
	<?php
		$i = 0;
		for ($rating = 5; $rating > 0; $rating--) {
		 	echo "<tr><td>";
		 	echo $rating;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$rating' id='powderx$i' checked onclick='search();' />";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>Bluebird Rating</h4>
	<table>
	<?php
		 $i = 0;
		for ($rating = 5; $rating > 0; $rating--) {
		 	echo "<tr><td>";
		 	echo $rating;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$rating' id='bluebirdx$i' checked onclick='search();' />";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>State</h4>
	<table>
	<?php
		$i = 0;
		 foreach ($facets['State']['terms'] as $facet) {
		 	$state = $facet['term'];
		 	echo "<tr><td>";
		 	echo $state;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$state' id='statex$i' checked onclick='search();' >";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>

	<button onclick="search()">Click me to show recommendation</button>


</div>
<div id="results" style="margin-left: 235px;">

</div>

<script type="text/javascript">
	search();
	//for (i=0; i<5; i++) {
	//	$("#date" + i).click(function(){ search(); });
	//}
</script>