<?php 

include('esSearchHelper.php');

function printSnowFlakes($count) {
  	echo "<img src='../images/snowflake$count.png'/>";
}

function printSuns($count) {
  	echo "<img src='../images/bluebird$count.png'/>";
}

function displayRecommendationWidget($rec) {
	?>
	<div class="recResult span2"><h5><?=$rec['resort_name'] ?>, <?=$rec['state'] ?></h5>
		<?php 
			$dtime = new DateTime($rec['date']);
			echo $dtime->format('F d, Y');
		?><br/>
		<?php printSnowFlakes($rec['powder']['rating']); ?><br/>
		<?php printSuns($rec['bluebird']['rating']); ?><br/>
		<a href="resort-detail?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>">Full Details</a>
	</div>
	<?php
}
$results = search($_GET);
if ($results["hits"]["total"] == 0) {
	echo "<h3>No results found, please modify your search and try again</h3>";
}
foreach ($results["hits"]["hits"] as $rec) {
 	displayRecommendationWidget($rec['_source']);
}
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>