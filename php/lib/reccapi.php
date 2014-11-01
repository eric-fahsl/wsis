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

if (isset($_GET['resortData'])) {
    $results = getResortDetails($_GET['resortData']);
    $allResults = $results['_source'];
}

elseif (isset($_GET['resort'])) {    
    $dtime = new DateTime('NOW');
    $displayDate = $dtime->format('Y-m-d');
    if (isset($_GET['date'])) {
        $displayDate = $_GET['date'];
    }
    $url = 'http://localhost:9200/recommendations/recommendations/' . $_GET['resort'] . '_' . $displayDate;    
    $allResults = queryES($url, "");
    // print $url;
    // $ch = curl_init($url);
    // $esResult = curl_exec($ch);
    // $allResults = json_decode($esResult, true);

    $resortData = getResortDetails($_GET['resort']);
    $allResults['_source']['resortData'] = $resortData['_source'];

    // return $results['_source'];
    // return $resortData;

}
//check if showing a specific date, if so, just do a single standard search
elseif (isset($_GET['date'])) {
    //echo json_encode(getResultsForDate($_GET) , true );
    if (!isset($_GET['size'])) {
        $_GET['size'] = 30;
    }

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
        $_GET['dateStart'] = date("Y-m-d");
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

// var_dump($allResults);
echo json_encode($allResults, true);
//echo $results["hits"]["hits"][0]['_id'];
//print json_encode($decoded["hits"]);                                                                                                             
?>