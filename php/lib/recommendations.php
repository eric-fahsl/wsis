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
	  $dateProvided = date("Y-m-d") . ",";
	  parse_str($_SERVER['QUERY_STRING'], $parameters);
	  if (isset($parameters['date'])) {
	  	$dateProvided=$parameters['date'];
	  	if (strpos($dateProvided, ",") === false) {
	  		$dateProvided .= ",";
	  	}
	  }
?>


<script type="text/javascript">
	

	var facets = {
		"date": { "value": "<?= $dateProvided ?>", "max": <?= sizeof($facets['Date']['terms']) ?> },
		"region": { "value": "", "max": <?= sizeof($facets['Region']['terms']) ?> },
		"state": {"value": "", "max": <?= sizeof($facets['State']['terms']) ?> }
	}

	function search() {
		
		parameters = "";
		//parameters = "dateMin=2012-11-28";
		for (var searchParam in facets) {
			val = facets[searchParam];
			if (val.value != null && val.value != "") {
				parameters += "&" + searchParam + "=" + val.value;
			}
		}


		$('#results').load('/lib/recSearch.php?size=30' + parameters);
	}

	function init() {

	}

	function clickDateFilter(searchDate, index) {
		//if date not included
		if(facets['date'].value.indexOf(searchDate) < 0) {
			facets['date'].value += searchDate + ",";
			$("#date-x-" + index).show();			
			$("#date" + index).addClass("selected");
		} else {
			facets['date'].value = facets['date'].value.replace(searchDate + ",", "");
			$("#date-x-" + index).hide();
			$("#date" + index).removeClass("selected");
		}
		search();
	}

	function clickFilter(type, value, index) {
		if (facets[type].value.indexOf(value) < 0) {
			addFilter(type,value,index);
			$("#" + type + index).addClass("selected");
		}
		else {
			removeFilter(type,value,index);
			$("#" + type + index).removeClass("selected");
		}
	}

	function addFilter(type, value, index) {
		facets[type].value = value;
		//parameters += "&" + type + "=" + value;
		for (var i=0; i<facets[type].max; i++) {
			if (i != index) {
				$("#" + type + i).hide();
			} else {
				$("#" + type + "-x-" + i).show();
			}
		}
		search();

	}

	function removeFilter(type, value, index) {
		facets[type].value = "";
		$("#" + type + "-x-" + index).hide();
		for (var i=0; i<facets[type].max; i++) {
			$("#" + type + i).show();
		}
		search();
	}
</script>



<div id="facets" class="hidden-phone">

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

			$classExtra = "";
			$xVisibleExtra = "";
			if (strcmp($searchDate . ",", $dateProvided) == 0) {
				$classExtra = "class='selected'";
				$xVisibleExtra = "style='display:block;'";
			}

		 	echo "<li id='date$i' onclick='clickDateFilter(\"$searchDate\", $i)' $classExtra><span>$displayDate</span><div class='x' id='date-x-$i' $xVisibleExtra>X</div></li>";
		 	$i++;
		 }
		
	?>
	</ol>

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

</div>

<script type="text/javascript">
	search();
	/*
	$("#facets .x").click(function() { 
		var splitStr = this.id.split('-');
		removeFilter(splitStr[0], splitStr[2]);
		alert("clicked");
	});*/

	//for (i=0; i<5; i++) {
	//	$("#date" + i).click(function(){ search(); });
	//}
</script>