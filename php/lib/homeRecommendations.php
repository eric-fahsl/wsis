<?php
	$dateFormat = "l, F j";
	$today = date("Y-m-d");
	$date = new DateTime($today);
	$todayDisplay = $date->format($dateFormat); 

	$todayPlus1 = date("Y-m-d",strtotime("+1 day"));
	$date = new DateTime($todayPlus1);
	$todayPlus1Display = $date->format($dateFormat); 

	$todayPlus2 = date("Y-m-d",strtotime("+2 day"));
	$date = new DateTime($todayPlus2);
	$todayPlus2Display = $date->format($dateFormat); 
	
?>

<script type="text/javascript">
var sortBluebird = "";
function loadRecommendations() {
  $('#searchResults1').load('/lib/recSearch.php?size=3&date=<?= $today ?>,&hw=t' + sortBluebird);
  $('#searchResults2').load('/lib/recSearch.php?size=3&date=<?= $todayPlus1 ?>,&hw=t' + sortBluebird);
  $('#searchResults3').load('/lib/recSearch.php?size=3&date=<?= $todayPlus2 ?>,&hw=t' + sortBluebird);
}

function selectPowder() {
	sortBluebird = "";
	loadRecommendations();
	$("#bluebirdRecTab").removeClass("active");
	$("#bluebirdRecTab").removeClass("current");

	$("#powderRecTab").addClass("active");
	$("#powderRecTab").addClass("current");
}
function selectBluebird() {
	sortBluebird = "&sortBluebird=t";
	loadRecommendations();
	$("#bluebirdRecTab").addClass("active");
	$("#bluebirdRecTab").addClass("current");

	$("#powderRecTab").removeClass("active");
	$("#powderRecTab").removeClass("current");
}

</script>
<h3>Upcoming Top Recommendations: </h3>
<span id="seeAllHome" class="visible-phone"><a href="recommendations">See all recommendations</a></span>
<ul class="nav menu nav-tabs" id="forecastHomeWidget">
	<li class="item-178 current active" id="powderRecTab"><a href="javascript:selectPowder();"><img src="../images/snowflake-sm.png" style="height:30px;"/> Powder</a></li>
	<li class="item-178" id="bluebirdRecTab"><a href="javascript:selectBluebird();" ><img src="../images/sun-sm.png"/> Bluebird</a></li>
	<li class="item-178 hidden-phone"><a href="recommendations"><img src="../images/alg-sm.png"/>See All</a></li>
</ul>
		

<div class="row-fluid">
<div class="module mod_1 first no_title span4" >
	<h5><?= $todayDisplay ?></h5>
	<div id="searchResults1"></div>
	<a href="recommendations">See all recommendations</a>
</div>
<div class="module mod_2 no_title span4" >
	<h5><?= $todayPlus1Display ?></h5>
	<div id="searchResults2"></div>
	<a href="recommendations">See all recommendations</a>
</div>
<div class="module mod_3 last no_title span4" >
<h5><?= $todayPlus2Display ?></h5>
	<div id="searchResults3"></div>
	<a href="recommendations">See all recommendations</a>
</div>
</div>

<script type="text/javascript">

	loadRecommendations();

</script>