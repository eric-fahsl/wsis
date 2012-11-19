<?php 
  
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
  		echo "<img src='./images/snowflake-sm.png'/>";
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
	  $state = $parsedJson->{'state'};
	  $latitude = $parsedJson->{'latitude'};
	  $longitude = $parsedJson->{'longitude'};
	  $powderRating = $parsedJson->{'powder'}->{'rating'};
	  //$snowForecast = $parsedJson->{''};
	  //$ = $parsedJson->{''};

	  //echo "<h3>$date</h3>\n";
	  //echo "<h5>" . $parsedResort->{'resort_website'} . "</h5>\n";
	  //$snowForecast = $parsedJson->{'data'}->{'snow_forecast'};
	  //$temp_f = $parsedJson->{'current_observation'}->{'temp_f'};
	  //echo "Current temperature in ${location} is: ${temp_f}\n";
	  //echo "The powder rating for today is ${powderRating} <br/>\n";
	  
	  //Page Title

	  echo "<h2>$resortName, $state</h2>";
	  echo "<p><a href='" . $resortInfo->{'resort_website'} . "'>" . $resortInfo->{'resort_website'} . "</a></p>";
	?>

	<h3>Recommendations for <?=$date ?></h3>
	Powder Rating: 
	<?php printSnowFlakes($powderRating); ?>
	<br/>
	Based off of a potential of <?=$parsedJson->{'powder'}->{'snow_new'} ?>" of fresh snow, 
	<?=$parsedJson->{'powder'}->{'snow_forecast'}?>" of more snow during the day, 
	and <?=$parsedJson->{'powder'}->{'snow_prev'}?>" the prior three days.

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
	


<?php

} else {
	echo "Invalid Page";
}

?>


