<?php 

?>

<div id="map_canvas" style="height: 400px;" class="span12">

</div>

<script type="text/javascript"> 
	$('#map_canvas').gmap({ 'center': '39.8282,-98.5795' });
		//.gmap('addMarker', {'position': '46.07,-117.85', 'bounds': true})
	$('#map_canvas').gmap('option', 'zoom', 5);
	//$('#map_canvas').gmap('addMarker', {'position': '44.2,-72.9244'});
	//$('#map_canvas').gmap('addMarker', {'position': '46.07,-117.85'});
	//$('#map_canvas').gmap('option', 'zoom', 5);
	<?php
	$states = getStates();
	echo json_encode(getStates());
	
	foreach ($states["facets"]["State"]["terms"] as $state) {
		 $stateName = $state["term"];
		 echo "<div class='span2 stateDisplay'>";
		 echo "<h3>". $stateName . "</h3>";
		 $resorts = getResortsForState($stateName);
		 echo $resorts;
		 $today = date("Y-m-d");
		 foreach($resorts["hits"]["hits"] as $resort) {
		 	$resortid = $resort["_id"];
		 	//echo "$('map_canvas').gmap('addMarker', {'position': '" . $resort["latitude"] . "," . $resort["longitude"] . "'});";
		 }
		 
 	}

	?>
	
</script>