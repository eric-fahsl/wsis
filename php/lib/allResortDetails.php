<?php 

include("esSearchHelper.php");
  
$states = getStates();
//echo json_encode(getStates());
$i = 1;

$resortsOutput = array();
foreach ($states["facets"]["State"]["terms"] as $state) {
    $stateName = $state["term"];

    $stateResorts = array();
    $resorts = getResortsForState($stateName);
    foreach($resorts["hits"]["hits"] as $resort) {
    	array_push($stateResorts, $resort["_source"]["name"]);
    }
    $resortsOutput[$stateName] = $stateResorts;
	 
}
	
echo json_encode($resortsOutput);


//}

?>