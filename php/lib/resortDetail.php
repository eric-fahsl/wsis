<?php 

include("esSearchHelper.php");
  
  function createTableRow($label, $value) {
  	if ($value != null && $value != "") {
  		echo "<tr><td>$label</td><td>";
  		if (strstr($value, "http")) {
  			echo "<a href=\"" . $value . "\">" . $value . "</a>";
  		} else {
  			echo $value;
  		}
  		echo "</td></tr>";
  	}
  }

  function printSnowFlakes($count) {
  	for ($i=0; $i<$count; $i++) {
  		echo "<img src='../images/snowflake-sm.png'/>";
  	}
  }

  function printSuns($count) {
  	for ($i=0; $i<$count; $i++) {
  		echo "<img src='../images/sun-sm.png'/>";
  	}
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

	  //Retrieve the additional Forecasted Date Info
	  $requestAttributes = array (
	  	  "resort" => $resort, 
	  	  "dateMin" => $date,
	  	  "sortDate" => "asc"
	  );
	  $results = search($requestAttributes);


	  echo "<h2>$resortName, $state</h2>";
	  echo "<p><a href='" . $resortInfo->{'resort_website'} . "'>" . $resortInfo->{'resort_website'} . "</a></p>";
	?>

	<h3>Recommendations for <?=$dateFormatted ?></h3>
	
	Powder: <?php printSnowFlakes($powderRating); ?>
	<br/>
	Bluebird: <?php printSuns($parsedJson->{'bluebird'}->{'rating'}); ?><br/>
	

	NOAA Weather Summary: <?=$parsedJson->{'bluebird'}->{'weather_summary'} ?><br/>
	Precipitation Potential: <?=$parsedJson->{'powder'}->{'snow_new'} ?>" of fresh snow, 
	<?=$parsedJson->{'powder'}->{'snow_forecast'}?>" of more snow during the day, 
	and <?=$parsedJson->{'powder'}->{'snow_prev'}?>" the prior three days.

	
	
	<div style="clear:both;">
	<h4>Recommendations based on the following sources / data points:</h4>
	<table>
	<?php 
		createTableRow("Base Elevation (ft, approx)", $resortInfo->{'base_elevation'});
		createTableRow("Summit Elevation (ft, approx)", $resortInfo->{'summit_elevation'});
		createTableRow("Latitude", $resortInfo->{'latitude'});
		createTableRow("Longitude", $resortInfo->{'longitude'});
		createTableRow("NOAA Forecast Link", "http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=text&lat=" 
			. $resortInfo->{'latitude'} . "&lon=" . $resortInfo->{'longitude'});
		createTableRow("Snow-Forecast.com Weather Link", "http://www.snow-forecast.com/resorts/" 
			. $resortInfo->{'snowforecast_id'} . "/6day/mid");
	?>

	</table>
	
<h4>Additional Dates for <?=$resortName ?></h4>

	<?php
		foreach ($results["hits"]["hits"] as $rec) {
			$rec = $rec["_source"];
			$dtime = new DateTime($rec['date']);
			?>
		 	<div class="module mod_1 no_title span2" style="float:left; width: 180px;">
				<h5><?=$dtime->format('F d'); ?> </h5>
				Powder: <?php printSnowFlakes($rec['powder']['rating']); ?><br/>
				Bluebird: <?php printSuns($rec['bluebird']['rating']); ?><br/>
				<a href="resortDetail.php?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>">Full Details</a>
			</div>
			<?php
		}
	?>
<?php

} else {
	echo "Invalid Page";
}

?>


