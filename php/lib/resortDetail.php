<?php 

include("esSearchHelper.php");
  
  function createTableRow($label, $value) {
  	if ($value != null && $value != "") {
  		echo "<tr><td>$label</td><td>";
  		
  		echo $value;
  		
  		echo "</td></tr>";
  	}
  }

  function printSnowFlakes($count) {
  	for ($i=0; $i<$count; $i++) {
  		echo "<img src='../images/snowflake-med.png'/>";
  	}
  }

  function printSuns($count) {
  	for ($i=0; $i<$count; $i++) {
  		echo "<img src='../images/sun-med.png'/>";
  	}
  }

  function displayRecommendationWidget($rec) {
	?>
	<div class="span2 recResult"><h5><?=$rec['resort_name'] ?>, <?=$rec['state'] ?></h5>
		<?php 
			$dtime = new DateTime($rec['date']);
			echo $dtime->format('F d, Y');
		?><br/>
		<img src="../images/snowflake<?= $rec['powder']['rating'] ?>.png"/><br/>
		<img src="../images/bluebird<?= $rec['bluebird']['rating'] ?>.png"/><br/>
		<a href="resort-detail?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>">Full Details</a>
	</div>
	<?php
}

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
	  $dateFormatted = $dt->format('F d Y');

	  $state = $parsedJson->{'state'};
	  $latitude = $parsedJson->{'latitude'};
	  $longitude = $parsedJson->{'longitude'};
	  $powderRating = $parsedJson->{'powder'}->{'rating'};
	  //$snowForecast = $parsedJson->{''};

	  echo "<h2>$resortName, $state</h2>";
	  echo "<p><a href='" . $resortInfo->{'resort_website'} . "'>" . $resortInfo->{'resort_website'} . "</a></p>";
	?>

	<h3>Recommendations for <?=$dateFormatted ?></h3>
	<table>
	<tr>
		<td><h4>Powder</h4></td>
		<td><?php printSnowFlakes($powderRating); ?></td>
	</tr>
	<tr>
		<td><h4>Bluebird</h4></td>
		<td><?php printSuns($parsedJson->{'bluebird'}->{'rating'}); ?></td>
	</tr>
	</table>
	

	<i>NOAA Weather Summary</i>: <?=$parsedJson->{'bluebird'}->{'weather_summary'} ?><br/>
	Precipitation Potential: <?=$parsedJson->{'powder'}->{'snow_new'} ?>" of fresh snow, 
	<?=$parsedJson->{'powder'}->{'snow_forecast'}?>" of more snow during the day, 
	and <?=$parsedJson->{'powder'}->{'snow_prev'}?>" the prior three days.

	
	
	<div style="clear:both;">
	<h4>Recommendations based on the following sources</h4>
	<?php 
		echo "<a href='http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=text&lat=" . 
			$resortInfo->{'latitude'} . "&lon=" . $resortInfo->{'longitude'} . "'>NOAA Forecast</a><br/>\n";
		echo "<a href='http://www.snow-forecast.com/resorts/" . $resortInfo->{'snowforecast_id'} . "/6day/mid'/>" . 
			"Snow-Forecast.com Weather</a>";
	?>


<h4>Future Recommendations for <?=$resortName ?></h4>
	
	<?php
	 	//Retrieve the additional Forecasted Date Info
		$requestAttributes = array (
			"resort" => $resort, 
			"dateMin" => $date,
			"sortDate" => "asc",
			"size" => 5
		);
		$results = search($requestAttributes);

		foreach ($results["hits"]["hits"] as $rec) {
			$rec = $rec["_source"];
			displayRecommendationWidget($rec);
		}
	?>
<div class="divider"></div>

<h4>Previous Recommendations for <?=$resortName ?></h4>
<?php
	//Retrieve the additional Forecasted Date Info
	$requestAttributes = array (
		"resort" => $resort, 
		"dateMax" => $date,
		"sortDate" => "desc",
		"size" => 3
	);
	$results = search($requestAttributes);

	foreach ($results["hits"]["hits"] as $rec) {
		$rec = $rec["_source"];
		displayRecommendationWidget($rec);
	}


?>

<div class="divider"></div>

<h4>Mountain Stats</h4>
	<table>
	<?php 
		createTableRow("Base Elevation (ft, approx)", $resortInfo->{'base_elevation'});
		createTableRow("Summit Elevation (ft, approx)", $resortInfo->{'summit_elevation'});
		createTableRow("Latitude", $resortInfo->{'latitude'});
		createTableRow("Longitude", $resortInfo->{'longitude'});
	?>

	</table>


<?php
}

else {
	echo "Invalid Page";
}

?>
