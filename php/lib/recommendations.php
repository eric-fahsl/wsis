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
	

	var facets = {
		"date": { "value": "", "max": <?= sizeof($facets['Date']['terms']) ?> },
		"region": { "value": null, "max": <?= sizeof($facets['Region']['terms']) ?> },
		"state": {"value": null, "max": <?= sizeof($facets['State']['terms']) ?> }
	}

	function search() {
		
		parameters = "";
		//parameters = "dateMin=2012-11-28";
		for (var searchParam in facets) {
			val = facets[searchParam];
			if (val.value != null) {
				parameters += "&" + searchParam + "=" + val.value;
			}
		}

		/*
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
		*/
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


		$('#results').load('/lib/recSearch.php?size=30&' + parameters);
	}

	function addDateFilter(searchDate, index) {
		//if date not included
		if(facets['date'].value.indexOf(searchDate) < 0) {
			facets['date'].value += searchDate + ",";
			$("#date-x-" + index).show();
			search();
		}
	}
	function removeDateFilter(searchDate, index) {
		//if date not included
		val = facets['date'].value
		if(val.indexOf(searchDate) >= 0) {
			facets['date'].value = val.replace(searchDate + ",", "");
			$("#date-x-" + index).hide();
			search();
		}
	}

	function addFilter(type, value) {
		facets[type].value = value;
		//parameters += "&" + type + "=" + value;
		for (var i=0; i<facets[type].max; i++) {
			element = $("#" + type + i);
			if (element.text() != (value + "X" )) {
				element.hide();
			} else {
				$("#" + type + "-x-" + i).show();
			}
		}
		search();

	}

	function removeFilter(type, value) {
		facets[type].value = null;
		$("#" + type + "-x-" + value).hide();
		for (var i=0; i<facets[type].max; i++) {
			$("#" + type + i).show();
		}
		search();
	}
</script>

 <STYLE type=text/css>

 #facets .header {
 	font-size: 13px;
	padding: 9px;
	margin: 0;
	background-color: #F9F9F9;
	border-top: 3px solid #BCE8F1;
	height: auto;
	overflow: auto;
 }

 #facets ol {
 	list-style: none;
	margin: 0;
 }

 #facets li {

	display: block;
	padding: 9px;
	margin: 0;
	border-top: 1px solid #D6D6D6;
	text-decoration: none;
	color: #0055A4;
 }

 #facets span {
 	cursor: pointer;
 	padding-right: 20px;
 }

 #facets li:hover {
 	background-color: lightgrey;
 }

 #facets .x {
 	color: red;
 	display: none;
 	float: right;
 	cursor: pointer;
 	padding-left: 20px;
 	padding-right: 5px;
 }


    </STYLE>

</head>



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

		 	echo "<li id='date$i'><span onclick='addDateFilter(\"$searchDate\", $i)'>$displayDate</span><div class='x' onclick='removeDateFilter(\"$searchDate\",$i)' id='date-x-$i'>X</div></li>";
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
		 	echo "<li id='region$i'><span onclick='addFilter(\"region\", \"$region\")'>$region</span><div class='x' onclick='removeFilter(\"region\",$i)' id='region-x-$i'>X</div></li>";
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
		 	echo "<li id='state$i'><span onclick='addFilter(\"state\", \"$state\")'>$state</span><div class='x' onclick='removeFilter(\"state\",$i)' id='state-x-$i'>X</div></li>";
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