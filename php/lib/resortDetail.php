<?php 

include("esSearchHelper.php");
  
  function createTableRow($label, $value) {
  	if ($value != null && $value != "") {
  		echo "<tr><td>$label</td><td>";
  		
  		echo $value;
  		
  		echo "</td></tr>";
  	}
  }

  function convertInToCm($inches) {
  	$cm = $inches * 2.54;
  	return number_format($cm, 1, '.', '');
  }

if (isset($_GET['resort'])) {
  $resort = $_GET['resort'];
  $date = $_GET['date'];

  //$documentPath = "http://localhost:9200/recommendations/recommendations/whitepass_2012-11-20";
  $documentPath = "http://localhost:9200/recommendations/recommendations/" . $resort . "_" . $date;
  $json_string = file_get_contents($documentPath);
  $parsedJson = json_decode($json_string);
  if ($parsedJson->{'exists'} == 'true') {
	  $parsedJson = $parsedJson->{'_source'};

	  $resortName = $parsedJson->{'resort_name'};
	  $resortDetailsPath = "http://localhost:9200/resorts/resorts/${resort}";
	  //echo $resortDetailsPath;
	  $json_string = file_get_contents($resortDetailsPath);
  	  $parsedResort = json_decode($json_string);
  	  $resortInfo = $parsedResort->{'_source'};

	  $date = $parsedJson->{'date'}; 
	  $dt = new DateTime($date);
	  $dateFormatted = $dt->format('l, F j, Y');

	  $state = $parsedJson->{'state'};
	  $latitude = $parsedJson->{'latitude'};
	  $longitude = $parsedJson->{'longitude'};
	  $powderRating = $parsedJson->{'powder'}->{'rating'};

	  $recommendationCreateDate = $parsedJson->{'createdOn'};
	  $dt = new DateTime($recommendationCreateDate);
	  $recommendationCreateDate = $dt->format('D, M d H:i:s');

	  $isDomestic = True;
	  if (strcmp("F", $resortInfo->{'domestic'}) == 0) {
	  	$isDomestic = False;
	  }
	  //$snowForecast = $parsedJson->{''};

	  echo "<h2>$resortName, $state</h2>";
	  echo "<p><a target='new' href='" . $resortInfo->{'resort_website'} . "'>" . $resortInfo->{'resort_website'} . "</a></p>";
	?>

	<h3>Recommendations for <?=$dateFormatted ?></h3>
	<div id="generatedOn">Generated on <?= $recommendationCreateDate ?></div>
	Precipitation Potential: 
	<?php 
		if ($isDomestic) {
			echo $parsedJson->{'powder'}->{'snow_new'} . "\" of fresh snow (last 24 hours), "
			 . $parsedJson->{'powder'}->{'snow_forecast'} . "\" of more snow during the day, and "
			 . $parsedJson->{'powder'}->{'snow_prev'} . "\" the last 72 hours. ";
		} else {
			echo convertInToCm($parsedJson->{'powder'}->{'snow_new'}) . " cm of fresh snow (last 24 hours), "
			 . convertInToCm($parsedJson->{'powder'}->{'snow_forecast'}) . " cm of more snow during the day, and "
			 . convertInToCm($parsedJson->{'powder'}->{'snow_prev'}) . " cm the last 72 hours. ";
		}
	?>
	<br/><br/>
	<table cellpadding="3">
	<tr>
		<td><h4>Powder</h4></td>
		<td><h6><?= $powderRating ?></h6></td>
		<td><?php printSnowFlakes($powderRating, True); ?></td>
	</tr>
	<tr>
		<td><h4>Bluebird</h4></td>
		<td><h6><?php echo $parsedJson->{'bluebird'}->{'rating'}; ?></h6></td>
		<td><?php printSuns($parsedJson->{'bluebird'}->{'rating'}, True); ?></td>
	</tr>
	<tr>
		<td><h4>Freezing Level</h4></td>
		<td><h6><?php 
			echo $parsedJson->{'freezing_level'}->{'freezing_level_avg'}; 
			if ($isDomestic) {
				echo " ft";
			} else {
				echo " m";
			}
		?></h6></td>
		<td><?php printFreezingLevel($parsedJson->{'freezing_level'}->{'rating'}, $parsedJson->{'freezing_level'}->{'freezing_level_avg'}, True); ?></td>
	</tr>
	</table>
	
	<?php 
		if ($isDomestic) {
			echo "<i>NOAA Weather Summary</i>: " . $parsedJson->{'bluebird'}->{'weather_summary'} . "<br/>";
		}
	?>
	<div style="clear:both;">
	<h4>Recommendations based on the following</h4>
	<?php 
		if ($isDomestic) {
			echo "<a target='new' href='http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=text&lat=" . 
				$resortInfo->{'latitude'} . "&lon=" . $resortInfo->{'longitude'} . "'>$resortName NOAA Forecast</a><br/>\n";
		}
		echo "<a target='new' href='http://www.snow-forecast.com/resorts/" . $resortInfo->{'snowforecast_id'} . "/6day/mid'/>" . 
			"$resortName Snow-Forecast.com Weather <img src='../images/snowforecast-logo.jpg'/></a>";
	?>

<div class="divider"></div>

<h4>Mountain Stats</h4>
	<table>
	<?php 
		$unitStr = " (m, approx)";
		if ($isDomestic) {
			$unitStr = " (ft, approx)";
		}
		createTableRow("Base Elevation" . $unitStr, $resortInfo->{'base_elevation'});
		createTableRow("Summit Elevation" . $unitStr, $resortInfo->{'summit_elevation'});
		createTableRow("Latitude", $resortInfo->{'latitude'});
		createTableRow("Longitude", $resortInfo->{'longitude'});
	?>

	</table>

<div class='divider'></div>

<h4>Nearby Resort Ratings for <?=$dateFormatted ?></h4>
<?php
	 	//Retrieve the additional Forecasted Date Info
		$requestAttributes = array ( 
			"date" => $date,
			"coords" => $resortInfo->{'latitude'} . "," . $resortInfo->{'longitude'},
			"size" => 6,
			"sortDistance" => "t"
		);
		$results = search($requestAttributes);

		$firstTime = True;
		foreach ($results["hits"]["hits"] as $rec) {
			$rec = $rec["_source"];
			if (!$firstTime) {
				displayRecommendationWidget($rec, "span2 recresultDetail", False);
			}
			$firstTime = False;
		}
	?>
<div class='divider'></div>

	<?php
	 	//Retrieve the additional Forecasted Date Info
		$requestAttributes = array (
			"resort" => $resort, 
			"dateMin" => $date,
			"sortDate" => "asc",
			"size" => 5
		);
		$results = search($requestAttributes);
		$i = 0;
		foreach ($results["hits"]["hits"] as $rec) {
			if ($i == 0) {
				echo "<h4>Upcoming Recommendations for $resortName</h4>";
			}
			$rec = $rec["_source"];
			displayRecommendationWidget($rec, "span2 recresultDetail", True);
			$i++;
		}
	?>

<div class="divider"> </div>
<?php
	//Retrieve the additional Forecasted Date Info
	$requestAttributes = array (
		"resort" => $resort, 
		"dateMax" => $date,
		"sortDate" => "desc",
		"size" => 3
	);
	$results = search($requestAttributes);

	$i = 0;
	foreach ($results["hits"]["hits"] as $rec) {
		if ($i == 0) {
			echo "<h4>Prior Recommendations for $resortName</h4>";
		}
		$rec = $rec["_source"];
		displayRecommendationWidget($rec, "span2 recresultDetail", True);
		$i++;
	}

?>




<?php
	}

	else {
		echo "Invalid Page";
	}

} else {
	?>
		<h2>Resorts Listing</h2>
		See below for our complete list of all supported ski resorts. We are always adding more resorts and we 
		apologize if your resort of choice is not yet available. If there is something that we have missed, please 
		feel free to give us some <a href="feedback">feedback</a>.

		<div class='divider'></div>
		<div class="row-fluid" id="stateListing">
	<?php
	$states = getStates();
	//echo json_encode(getStates());
	$i = 1;
	foreach ($states["facets"]["State"]["terms"] as $state) {
		 $stateName = $state["term"];
		 echo "<div class='span2 stateDisplay'>";
		 echo "<h3>". $stateName . "</h3>";
		 $resorts = getResortsForState($stateName);
		 $today = date("Y-m-d");
		 foreach($resorts["hits"]["hits"] as $resort) {
		 	$resortid = $resort["_id"];
		 	echo "<a href='resorts?resort=$resortid&date=$today'>" . $resort["fields"]["name"] . "</a><br/>\n";
		 }
		 echo "</div>";
		 if ($i % 6 == 0) {
		 	echo "<div class='divider'></div>\n";
		 }
		 $i++;
 	}
 	echo "</div>";
}

//}

?>