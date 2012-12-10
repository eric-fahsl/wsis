<?php 

include('esSearchHelper.php');

function printSnowFlakes($count) {
  	echo "<img src='../images/snowflake$count.png'/>";
}

function printSuns($count) {
  	echo "<img src='../images/bluebird$count.png'/>";
}


function displayRecommendationWidget($rec, $resultClass, $showDate) {
	?>
	<div class="<?= $resultClass ?>">
		<div class="recheader"><a href="resort-detail?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>"><?=$rec['resort_name'] ?>, <?=$rec['state'] ?></a></div>
		<?php 
			if ($showDate) {
				$dtime = new DateTime($rec['date']);
				echo $dtime->format('l, M j') . "<br/>";
			}
		?>
		<?php printSnowFlakes($rec['powder']['rating']); ?><br/>
		<?php printSuns($rec['bluebird']['rating']); ?><br/>
	</div>
	<?php
}
$results = search($_GET);
$homeWidget = false;
$showDate = true;
$resultClass = "span2 recresult";
if (isset($_GET['hw'])) {
	$resultClass = "recresulthome";
	$showDate = false;
}

if ($results["hits"]["total"] == 0) {
	echo "<h3>No results found, please modify your search and try again</h3>";
}
foreach ($results["hits"]["hits"] as $rec) {
 	displayRecommendationWidget($rec['_source'], $resultClass, $showDate);
}
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>