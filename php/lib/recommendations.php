<?php
	include("esSearchHelper.php");

	function addSortMenuOption(&$sortMenu, $label, $value, &$jsSortValue) {
		$selectedFlag = "";
		//echo "SORT VALUE: " . $_GET['sort'];
		if (isset($_GET['sort']) && strcasecmp($_GET['sort'], $value) == 0) {
			$selectedFlag = "selected";
			$jsSortValue = $value;
		}
		array_push($sortMenu, array($label, $value, $selectedFlag));
	}
	//check Sorting
	$jsSortValue = "";
	$sortingOptions = array('distance', 'bluebird');
	$sortMenu = array();
	//array_push($sortMenu, array('Powder Rating', 'powder', false));
	addSortMenuOption($sortMenu, 'Powder Rating', 'powder', $jsSortValue);
	addSortMenuOption($sortMenu, 'Distance (Direct)', 'distance', $jsSortValue);
	addSortMenuOption($sortMenu, 'Bluebird', 'bluebird', $jsSortValue);
	addSortMenuOption($sortMenu, 'Freezing Level', 'fl', $jsSortValue);

	//check if state selected
	$jsStateValue = "";
	$jsStateIndex = -1;
	if (isset($_GET['state'])) {
		$jsStateValue = $_GET['state'];
	}

	$dateStart = date("Y-m-d");
	if (isset($_GET['date'])) {
		$dateStart = $_GET['date'];
	}

	//Retrieve the Facets
	  $requestAttributes = array (
	  	  "dateStart" => $dateStart,
	  	  "facet" => "t"
	  );
	  $facets = search($requestAttributes);
	  //print json_encode($facets);
	  $facets = $facets['facets'];
	  //print $facets['Date'];
	  $dateProvided = $dateStart;
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
		"sort": "<?= $jsSortValue ?>",
		"coords": ""
	}

	function search() {
		
		parameters = "startDate=<?= $dateStart ?>";
		for (var searchParam in facets) {
			val = facets[searchParam];
			if (val.value != null && val.value != "") {
				parameters += "&" + searchParam + "=" + val.value;
			}
		}
		if (facets.sort != "") {
			parameters += "&sort=" + facets.sort;
		}
		if (facets.coords != "") {
			parameters += "&coords=" + facets.coords;
		}

		$('#searchResults').load('/lib/recSearch.php?size=30&' + parameters);
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
	<ol id="stateFacets">
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
	<div style="clear:both"></div>

</div>
<div id="results">

	 <div id="resultsHeader">
        <p id="number_results">Hint: use filters <span class="hidden-phone">on the left </span>to narrow your results<br/>
        	Learn about our <a target="new" href="/about">rating system</a>.</p>
        

	    <div id="sort">
          
          <label for="sort">Sort By: </label>
          <select id="search_sort" name="sort">

          	<?php
          		foreach($sortMenu as $menuOption) {
          			//check if this is the distance menu option, need to identify the element so it can be hidden if location services not enabled
          			if (strcasecmp($menuOption[1], 'distance') == 0) {
          				$menuOption[2] .= " id='distanceSort'";
          			}
          			echo "<option value='$menuOption[1]' $menuOption[2]>$menuOption[0]</option>\n";
          		}
          		//array_push($sortMenu, array('Powder Rating', 'powder', false));

          	?>
          </select>
      </div>

     </div>
     <div id="searchResults">

     </div>
     <div class="divider"></div>
     <div id="legend"><div class="title">LEGEND</div>
      	<div class="border">
       	Powder: <img src="images/snowflake-sm.png"> Bluebird: <img src="images/sun-sm.png"> Freezing Level: <img src="images/fl-sm.png"></div>
     </div>
</div>

<script type="text/javascript">
	checkLocation();

<?php
	if (strcmp($jsStateValue, "") != 0) {
		echo "clickFilter('state', '$jsStateValue', $jsStateIndex);";	
	} 
?>
	search();
	$("#search_sort").change(function() {
		var str = "";
          $("#search_sort option:selected").each(function () {
            //    str += $(this).text() + " " + $(this).val();
                if ($(this).val() == "bluebird") {
                	facets.sort = "bluebird";
                } else if ($(this).val() == "distance"){
                	facets.sort = "distance";
                } else if ($(this).val() == "fl"){
                	facets.sort = "fl";
                } else {
                	facets.sort="";
                }          
              }); 
         search();
          //alert(str);
	});

	$("#toggleFilters").click(function() {
		if (mobileFacetsShown) {
			hideFilters();
		} else {
			showFilters();
		}
	});

</script>