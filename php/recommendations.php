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


<head>
	  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/bootstrap.min.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/bootstrap-responsive.min.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/font-awesome.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/joomla25.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/1_template.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/style-theme1.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/default.css" type="text/css">
  <link rel="stylesheet" href="./betasite/WhereShouldISki.com - Home_files/nivo-slider.css" type="text/css">
  <style type="text/css">
#toTop {width:100px;z-index: 10;border: 1px solid #333; background:#121212; text-align:center; padding:5px; position:fixed; bottom:0px; right:0px; cursor:pointer; display:none; color:#fff;text-transform: lowercase; font-size: 0.7em;}
  </style>
<script type="text/javascript" src="js/jquery-1.8.3.js"></script>
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
		//alert(parameters);
		/*
		searchDates = "&date=";
		for (i=0; i<5; i++) {
			if ( $("#date" + i)[0].checked ) {
				searchDates += $("#date" + i).val() + ",";
			}
		}
		searchRegions = "&regionx=";
		for (i=0; i<5; i++) {
			if ( !$("#regionx" + i)[0].checked ) {
				searchRegions += $("#regionx" + i).val() + ",";
			}
		} */

		$('#results').load('recSearch.php?size=100' + parameters);
	}
</script>

</head>



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
		 	//echo date_format($date, 'm/d/y') . "<br/>";
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
		 	echo "<input type='checkbox' value='$region' id='regionx$i' checked onclick='search();'";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>Powder Rating</h4>
	<table>
	<?php
		$i = 0;
		 foreach ($facets['PowderRating']['terms'] as $facet) {
		 	$powder = $facet['term'];
		 	echo "<tr><td>";
		 	echo $powder;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$powder' id='powderx$i' checked onclick='search();'";
		 	echo "</td></tr>";
		 	$i++;
		 }
		
	?>
	</table>
	<h4>Bluebird Rating</h4>
	<table>
	<?php
		$i = 0;
		 foreach ($facets['BluebirdRating']['terms'] as $facet) {
		 	$bluebird = $facet['term'];
		 	echo "<tr><td>";
		 	echo $bluebird;
		 	echo "</td><td>";
		 	echo "<input type='checkbox' value='$bluebird' id='bluebirdx$i' checked onclick='search();'";
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
		 	echo "<input type='checkbox' value='$state' id='statex$i' checked onclick='search();'";
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