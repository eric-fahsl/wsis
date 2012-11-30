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
	

	var facets = {
		"date": { "value": "", "max": <?= sizeof($facets['Date']['terms']) ?> },
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


		$('#results').load('/lib/recSearch.php?size=30&' + parameters);
	}

	function clickDateFilter(searchDate, index) {
		//if date not included
		if(facets['date'].value.indexOf(searchDate) < 0) {
			facets['date'].value += searchDate + ",";
			$("#date-x-" + index).show();			
		} else {
			facets['date'].value = facets['date'].value.replace(searchDate + ",", "");
			$("#date-x-" + index).hide();
		}
		search();
	}

	function clickFilter(type, value, index) {
		if (facets[type].value.indexOf(value) < 0) 
			addFilter(type,value,index);
		else
			removeFilter(type,value,index);
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



<div id="facets" style="width:235px; float:left; min-height: 100%;">

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

		 	echo "<li id='date$i' onclick='clickDateFilter(\"$searchDate\", $i)'><span>$displayDate</span><div class='x' id='date-x-$i'>X</div></li>";
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
<div id="results" style="margin-left: 235px;">

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