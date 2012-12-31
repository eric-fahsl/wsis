<?php
	include("esSearchHelper.php");


	//Retrieve the Facets
	  $requestAttributes = array (
	  	  "dateStart" => date("Y-m-d"),
	  	  "facet" => "t"
	  );
	  $facets = search($requestAttributes);
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
<script src="js/jquery.cookie.min.js" type="text/javascript" ></script>
<script src="js/wsis.js" type="text/javascript" ></script>



<script type="text/javascript">

	
	var mobileFacetsShown = false;
	var facets = {
		"date": { "value": "", "max": <?= sizeof($facets['Date']['terms']) ?> },
		"region": { "value": "", "max": <?= sizeof($facets['Region']['terms']) ?> },
		"distance": { "value": "", "max": 3 },
		"state": {"value": "", "max": <?= sizeof($facets['State']['terms']) ?> },
		"sort": "",
		"coords": ""
	}

	function search() {
		
		//parameters = "";
		parameters = "&dateStart=<?= $dateProvided ?>&landing=t";
		for (var searchParam in facets) {
			val = facets[searchParam];
			if (val.value != null && val.value != "") {
				parameters += "&" + searchParam + "=" + val.value;
			}
		}
		if (facets.sort != "") {
			parameters += "&" + facets.sort + "=t";
		}
		if (facets.coords != "") {
			parameters += "&coords=" + facets.coords;
		}


		$('#searchResults').load('/lib/recSearch.php?size=30' + parameters);
	}

	function init() {

	}

	
</script>


<button class="button visible-phone" id="toggleFilters">Filter</button>
<div id="facets" class="hidden-phone span2">

	<div class="header">
		<h3>Date</h3>
	</div>
	<ol>
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
		 	echo "<li id='state$i' onclick='clickFilter(\"state\", \"$state\", $i)'><span>$state</span><div class='x' id='state-x-$i'>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>


</div>
<div id="results">
	 <div id="resultsHeader">
        <p id="number_results">Hint: use filters <span class="hidden-phone">on the left </span>to narrow your results<br/>
        	Learn about our <a target="new" href="/about">rating system</a>.</p>
        <div id="sort">
          <label for="sort">Sort By: </label>
          <select id="search_sort" name="sort">
            <option value="powder" selected="selected">Powder Rating</option>
             <option value="distance" id="distanceSort">Distance (Direct)</option>
            <option value="bluebird">Bluebird Rating</option>
          </select>
      </div>
     </div>
     <div id="searchResults">

     </div>
</div>

<script type="text/javascript">
	search();

	checkLocation();

	$("#search_sort").change(function() {
		var str = "";
          $("#search_sort option:selected").each(function () {
            //    str += $(this).text() + " " + $(this).val();
                if ($(this).val() == "bluebird") {
                	facets.sort = "sortBluebird";
                } else if ($(this).val() == "distance"){
                	facets.sort = "sortDistance";
                } else {
                	facets.sort="";
                }          
              }); 
         search();
          //alert(str);
	});

	$("#toggleFilters").click(function() {
		if (mobileFacetsShown) {
			$("#facets").addClass("hidden-phone");
			//$("#facets").width(200);
			mobileFacetsShown = false;

		} else {
			$("#facets").removeClass("hidden-phone");
			//$("#facets").width("100%");
			mobileFacetsShown = true;
		}
	});

</script>