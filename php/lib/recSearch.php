<?php 

include('esSearchHelper.php');

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

function displayRecommendationWidget($rec) {
	?>
	<div class="module mod_1 no_title span2" style="min-height: 160px;">
		<h5><?=$rec['resort_name'] ?>, <?=$rec['state'] ?></h5>
		<?php 
			$dtime = new DateTime($rec['date']);
			echo $dtime->format('F d, Y');
		?> <br/>
		<?php printSnowFlakes($rec['powder']['rating']); ?><br/>
		<?php printSuns($rec['bluebird']['rating']); ?><br/>
		<a href="resort-detail?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>">Full Details</a>
	</div>

	<?php
}

$results = search($_GET);

foreach ($results["hits"]["hits"] as $rec) {
 	displayRecommendationWidget($rec['_source']);
}
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>