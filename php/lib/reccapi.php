<?php

include('esApiSearchHelper.php');

$allResults = array();

function getResultsForDate($requestParams) {
    $results = search($requestParams);
    return array(
        "results" => $results['hits']['hits'],
        "facets" => $results['facets']
    );
}

//check if showing a specific date, if so, just do a single standard search
if (isset($_GET['date'])) {
    //echo json_encode(getResultsForDate($_GET) , true );
    $_GET['size'] = 30;

    $results = getResultsForDate($_GET);
//    $allResults = $results;
    $allResults = array(
        'results' => array($_GET['date'] => $results['results']),
        'facets' => $results['facets']
    );

} else {

    $displayedNoResults = 0;
    $requestParams = $_GET;
    $requestParams['size'] = 0;
    if (!isset($_GET['dateStart'])) {
        //set to today's date
        $requestParams['dateStart'] = date("Y-m-d");
    }

    //Get the initial results for acquiring the available dates to search
    $results = search($requestParams);
    //echo json_encode($results);

    $allResults = array(
        'results' => array(),
        'facets' => $results['facets']
    );
    //We now want 5 results per date
    $requestParams['size'] = 5;
    foreach ($results['facets']['date']['terms'] as $dateFacet) {
        $reccDate = $dateFacet['term'];
        $requestParams['date'] = $reccDate;
        $results = getResultsForDate($requestParams);
        $allResults['results'][$reccDate] = $results['results'];
    }

}

echo json_encode($allResults, true);
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>