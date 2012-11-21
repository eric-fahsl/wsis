<?php 

include('esSearchHelper.php');

function displayRecommendationWidget($rec) {
	?>
	<div class="module mod_1 no_title span2" style="min-height: 160px;">
		<h4><?=$rec['resort_name'] ?>, <?=$rec['state'] ?></h4>
		Date: <?=$rec['date'] ?> <br/>
		Powder: <?php printSnowFlakes($rec['powder']['rating']); ?><br/>
		<a href="resortDetail.php?resort=<?=$rec['resort'] ?>&date=<?=$rec['date'] ?>">Full Details</a>
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