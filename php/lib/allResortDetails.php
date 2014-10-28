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
    	$resortDetail = array(
    		"id" => $resort["_id"],
    		"name" => $resort["_source"]["name"]
    	);
    	array_push($stateResorts, $resortDetail);
    }
    //$resortsOutput[$stateName] = $stateResorts;
    // $stateResorts['state'] = $stateName;
    array_push($resortsOutput, array(
    	"state" => $stateName,
    	"resorts" => $stateResorts)
    );
	 
}
	
echo json_encode(array("resorts" => $resortsOutput));


//}

?>