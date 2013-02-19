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
	<link class="include" rel="stylesheet" type="text/css" href="/js/jquery.jqplot.min.css" />
	
	<h3 class="minPhoneWidth">Recommendations for <?=$dateFormatted ?></h3>
	<div class="smallItalic">Generated on <?= $recommendationCreateDate ?> PST</div>

	<table cellpadding="3" id="resortDetailRatings">
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
		<td><h5>Freezing <br/> Level</h5></td>
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
		$last24 = ""; $newSnow = ""; $last72 = "";
		if ($isDomestic) {
			$last24 = $parsedJson->{'powder'}->{'snow_new'} . "&rdquo;";
			$newSnow = $parsedJson->{'powder'}->{'snow_forecast'} . "&rdquo;";
			$last72 = $parsedJson->{'powder'}->{'snow_prev'} . "&rdquo;";
		} else {
			$last24 = convertInToCm($parsedJson->{'powder'}->{'snow_new'}) . "cm";
			 $newSnow = convertInToCm($parsedJson->{'powder'}->{'snow_forecast'}) . "cm";
			 $last72 = convertInToCm($parsedJson->{'powder'}->{'snow_prev'}) . "cm";
		}
	?>

	<h4>Snowfall Projections</h4>
    <ul class="precipitationPotential">
      <li>
        <p class="measure"><?= $last24 ?></p>
        <p class="measureLabel">Last 24hrs</p>
      </li>
      <li>
        <p class="measure"><?= $last72 ?></p>
        <p class="measureLabel">Last 72 hrs</p>
      </li>
      <li>
        <p class="measure"><?= $newSnow ?></p>
        <p class="measureLabel">New Daytime</p>
      </li>
    </ul>
    <div class="smallItalic divider">Projections for mid-mountain elevation</div>

	<?php 
		if ($isDomestic) {
			echo "<div style='clear:both;'></div><i>NOAA Weather Summary</i>: " . $parsedJson->{'bluebird'}->{'weather_summary'} . "<br/>";
		}
	?>
	<div style="clear:both;">

	<?php
		//calculate start/ending date of chart
		$chartStart = date('Y-m-d', strtotime($date . ' - 7 days'));
		$chartEnd = date('Y-m-d', strtotime($date . ' + 7 days'));
	?>

	<h4>Additional Dates</h4>
	<div class="ital">Click any rating point to load recommendation details for that date.</div>
	
	<div id="ratingsChart" class="span12"></div>

	<script type="text/javascript">
	$(document).ready(function(){
	   
	var ajaxDataRenderer = function(url, plot, options) {
	    var ret = null;
	    $.ajax({
	      async: false,
	      url: url,
	      dataType:"json",
	      success: function(data) {
	        ret = data;
	      }
	    });
	    return ret;
	  };

	    var plot1 = $.jqplot('ratingsChart', "/lib/resortDataSearch.php?resort=<?= $resort ?>&dateStart=<?= $chartStart ?>&dateMax=<?= $chartEnd ?>&size=30", { 
	        //title: 'Ratings for <?= $resortName ?>', 
	        dataRenderer: ajaxDataRenderer,
		    series: [		        		        
		        {
		        	yaxis: 'y2axis',
		        	color: '#a9a9a9',
		        	shadow: false,
		        	label: 'Top Elevation',
		        	showMarker: false
		        },
		        {
		        	yaxis: 'y2axis',
		        	color: '#a9a9a9',
		        	shadow: false,
		        	label: 'Bottom Elevation',
		        	showMarker: false
		        },
		        {
		        	label: 'Freezing Level',
		        	color: '#d092db',
		        	yaxis: 'y2axis',		        	
		        	markerOptions: { style: 'x'}
		        },
		        {
		            label: 'Bluebird',
		            color: '#dbb346',
		            lineWidth: 4,
		            markerOptions: { size: 12 }
		        },
		        { 
		            label: 'Powder',
		            markerOptions:{ size: 12, style:'diamond'},
		            lineWidth: 4,
		            color: '#18c2e1'
		            
		        },	      
		        
	        ], 
	        axes: { 
	            xaxis: { 
	                renderer:$.jqplot.DateAxisRenderer,
	                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                tickOptions: {
	                  angle: -40,
	                  formatString:'%a, %b %#d'

	                }
	            },
	            yaxis: {
	            	min: 0, max: 5,
	            	label: 'Rating',
	            	labelRenderer: $.jqplot.CanvasAxisLabelRenderer

	           	},
	           	y2axis: {
	           		label: 'Freezing Level',
	           		labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	           		labelOptions: { angle: 90 }
	           	}
	        }, 
	        highlighter: {
		        show: true,
		        sizeAdjust: 7.5
		    },
	        legend: { show: true } 
	    });

	    
	    $('#ratingsChart').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                //$('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
                var d = new Date(data[0]);
                var month = d.getMonth() + 1;
                if (month < 10) month = "0" + month;
                var day = d.getDate();
                if (day < 10) day = "0" + day;
                var ratingDate = d.getFullYear() + "-" + month + "-" + day;
                var url = "resorts?resort=<?= $resort ?>&date=" + ratingDate;
                window.location.href = url;
            }
        );
	});
	</script>
	<div class="divider"></div>

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
			"sort" => "distance"
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

?>
	<!--[if IE]><script language="javascript" type="text/javascript" src="/js/excanvas.min.js"></script><![endif]-->
	<script type="text/javascript" src="/js/jquery.jqplot.min.js"></script>  
<!-- End Don't touch this! -->

<!-- Additional plugins go here -->
    <script class="include" type="text/javascript" src="/js/plugins/jqplot.cursor.min.js"></script>
    <script class="include" type="text/javascript" src="/js/plugins/jqplot.dateAxisRenderer.min.js"></script>
    <script class="include" type="text/javascript" src="/js/plugins/jqplot.canvasTextRenderer.min.js"></script>
    <script class="include" type="text/javascript" src="/js/plugins/jqplot.canvasAxisTickRenderer.min.js"></script>
    <script class="include" type="text/javascript" src="/js/plugins/jqplot.CanvasAxisLabelRenderer.min.js"></script>
    <script type="text/javascript" src="/js/plugins/jqplot.highlighter.min.js"></script>
  

<?php
	}

	else {
		echo "Invalid Page";
	}

} else {
	//If defaulting to the resort listing page
	?>
		<h2>Resorts Listing</h2>
		See below for our complete list of all supported ski resorts. We are always adding more resorts and we 
		apologize if your resort of choice is not yet available. If there is something that we have missed, please 
		feel free to give us some <a href="feedback">feedback</a>.

		<div class='divider'></div>
		<div class="row-fluid" id="stateListing">
	
	
	<div id="map_canvas" class="span12">

	</div>



	<script type="text/javascript"> 
		$('#map_canvas').gmap({ 'center': '41.8282,-100.5795' });
		<?php
		$states = getStates();
		//echo json_encode(getStates());
		
		$today = date("Y-m-d");
		foreach ($states["facets"]["State"]["terms"] as $state) {
			 $stateName = $state["term"];
			 $resorts = getResortsForState($stateName);			 
			 foreach($resorts["hits"]["hits"] as $resort) {
			 	$resortid = $resort["_id"];
			 	//echo json_encode($resort);
			 	$resort = $resort["_source"];

			 	$resortInfo = "<h6>" . $resort["name"] . ", " . $resort["state"] . "</h6>"; 
			 	$resortInfo .= "<a href=\"resorts?resort=$resortid&date=$today\">Current Ratings</a>";
			 	
			 	echo "$('#map_canvas').gmap('addMarker', {'position': '" . $resort["latitude"] . "," . $resort["longitude"] . "'})";
			 	echo ".click(function() { ";
			 	echo "$('#map_canvas').gmap('openInfoWindow', { 'content': '$resortInfo' }, this) ";
       			echo "});\n";
			 }
			 
	 	}

		?>
		$('#map_canvas').gmap('option', 'zoom', 4);
		
	</script>
	<?php
	/*
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
 	*/
}

//}

?>