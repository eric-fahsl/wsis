<?php

function addSearchParam(&$mustTerms, $parameter) {
    if (isset($_GET[$parameter])) {
        $term = createTerm($parameter, $_GET[$parameter]);
        array_push($mustTerms, $term);
    }
}

function buildQuery() {

    $mustTerms = array();
    addSearchParam($mustTerms, "date");
    addSearchParam($mustTerms, "region");
    addSearchParam($mustTerms, "state");
    addSearchParam($mustTerms, "rating");
    addSearchParam($mustTerms, "resort");

    if (isset($_GET['dateStart'])) {
        array_push($mustTerms,
            array(
                "range" => array(
                    "date" => array(
                        "gte" => $_GET['dateStart']
                    )
                )
            )
        );
    }

    if (isset($_GET['powder'])) {
        array_push($mustTerms,
            array(
                "range" => array(
                    "powder.rating" => array(
                        "gte" => $_GET['powder']
                    )
                )
            )
        );
    }

    if (isset($_GET['dateMin'])) {
        array_push($mustTerms,
            array(
                "range" => array(
                    "date" => array(
                        "gt" => $_GET['dateMin']
                    )
                )
            )
        );
    }
    if (isset($_GET['dateMax'])) {
        array_push($mustTerms,
            array(
                "range" => array(
                    "date" => array(
                        "lt" => $_GET['dateMax']
                    )
                )
            )
        );
    }

    $shouldTerms = array();


    $query = array(
        "bool" => array(
            "must" => $mustTerms,
            //"must_not" => $mustNotTerms,
            "should" => $shouldTerms,
            "minimum_number_should_match" => 1
        )
    );
    // /print json_encode($query);
    //$query = array ( "query" => $match_all );


    $filter = array();
    if (isset($_GET['distance'])) {
        $filter = array(
            "geo_distance" => array(
                "distance" => $_GET['distance'] . "mi",
                "location" => $_GET['coords']
            )
        );
    }
    $filteredArray = array (
        "query" => $query,
        "filter" => $filter
    );

    $outerQuery = array(
        "filtered" => $filteredArray
    );

    return $outerQuery;
}

function createExcludeTerm(&$excludeArray, $parameter, $termName) {
    if (isset($_GET[$parameter]) && $_GET[$parameter] != "") {
        $regions = explode(",", $_GET[$parameter]);
        foreach ($regions as $region) {
            array_push($excludeArray, createTerm($termName, $region));
        }
    }
}

function createTerm($name, $value) {

    $term = array(
        "term" => array(
            $name => $value
        )
    );
    return $term;
}

function addSortTerm(&$sort, $term, $order) {
    array_push($sort,
        array($term => array(
            "order" => $order
        )));
}

function addGeoSort(&$sort, $coords) {
    array_push($sort,
        array("_geo_distance" =>
            array(
                "location" => $coords,
                "order" => "asc",
                "unit" => "mi"
            )
        )
    );
}


function buildSort() {
    $sort = array();

    if (isset($_GET['sortDate'])) {
        addSortTerm($sort, "date", $_GET['sortDate']);
    }

    //check if the lat/lon coordinates are provided, if so, this is the primary sort

    if (isset($_GET['sort'])) {
        if (isset($_GET['coords']) && strcasecmp($_GET['sort'], 'distance') == 0) {
            addGeoSort($sort, $_GET['coords']);
        } elseif (strcasecmp($_GET['sort'], 'bluebird') == 0) {
            addSortTerm($sort, "bluebird.rating", "desc");
        } elseif (strcasecmp($_GET['sort'], 'fl') == 0) {
            addSortTerm($sort, "freezing_level.rating", "desc");
        } elseif (strcasecmp($_GET['sort'], 'quality') == 0) {
            addSortTerm($sort, "snow_quality.rating", "desc");
        }
    }

    addSortTerm($sort, "powder.rating", "desc");
    addSortTerm($sort, "snow_quality.rating", "desc");
    addSortTerm($sort, "bluebird.rating", "desc");
    addSortTerm($sort, "powder.snow_new", "desc");
    //addSortTerm($sort, "powder.snow_forecast", "desc");

    return $sort;
}

function buildFacets() {
    $facets = array(
        "date" => array(
            "terms" => array(
                "field" => "date",
                "order" => "term"
            )
        ),

        "region" => array(
            "terms" => array(
                "field" => "region"
            )
        ),
        "state" => array(
            "terms" => array(
                "field" => "state",
                "order" => "term",
                "size" => 20
            )
        ),
        "powder" => array(
            "range" => array(
                "field" => "powder.rating",
                "ranges" => array(
                    array("from" => 4),
                    array("from" => 3, "to" => 4),
                    array("from" => 2, "to" => 3)
                )
            )
        )
    );

    if (isset($_GET['coords']))
        $facets["distance"] = array(
            "geo_distance" => array(
                "location" => $_GET['coords'],
                "unit" => "mi",
                "ranges" => array(
                    array("to" => 100),
                    array("from"=>100, "to" => 200),
                    array("from"=>200, "to" => 400)
                )
            )
        );

    return $facets;
}

function search($GET) {
    $queryArray = array();
    if (isset($GET['facet'])) {
        $queryArray = array (
            "query" => buildQuery(),
            "facets" => buildFacets(),
            "size" => "0"
        );
    } else {
        $queryArray = array (
            "query" => buildQuery(),
            "facets" => buildFacets(),
            "sort" => buildSort()
        );
        if (isset($GET['fields'])) {
            $queryArray['fields'] = array('powder.rating', 'state_full', 'freezing_level.rating', 'resort',
                'date', 'bluebird.rating', 'resort_name', 'snow_quality.rating');
        }
    }
   if (isset($GET['size']) && is_numeric($pageSize = $GET['size'])) {
        if (intval($pageSize) > 30) {
            $pageSize = 30;
        }
        $queryArray['size'] = $pageSize;
    }

    $queryObject = json_encode($queryArray);
    //print $queryObject . "<br/><br/>";

    return queryES("http://localhost:9200/recommendations/_search", $queryObject);
}

function queryES($searchUrl, $queryObject) {
    $ch = curl_init($searchUrl);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "XGET");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $queryObject);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($queryObject))
    );
    $esResult = curl_exec($ch);
    $results = json_decode($esResult, true);

    return $results;
}

function getStates() {
    $queryArray = array (
        "query" => array(
            "match_all" => json_decode ("{}")
        ),
        "facets" => array(
            "State" => array(
                "terms" => array(
                    "field" => "state_full",
                    "order" => "term",
                    "size" => 50
                )
            )
        ),
        "size" => 0

    );
    //"sort" => buildSort()

    $queryObject = json_encode($queryArray);
    //print $queryObject;

    return queryES("http://localhost:9200/resorts/_search", $queryObject);
}

function getResortsForState($state) {
    $sort = array();
    addSortTerm($sort, "name", "asc");

    $queryArray = array (
        "query" => array(
            "bool" => array(

                "must" => array(
                    array(

                        "term" => array(
                            "state_full" => $state
                        )


                    )
                )

            )
        ),
        "size" => 100,
        "sort" => $sort
    );

    $queryObject = json_encode($queryArray);
    // print $queryObject;

    return queryES("http://localhost:9200/resorts/_search", $queryObject);

}

function getResortDetails($resort) {
    $resort = explode("/", $resort);
    $resort = $resort[0];
    $url = "http://localhost:9200/resorts/resorts/" . $resort;
    $ch = curl_init($url);
    $esResult = curl_exec($ch);
    return json_decode($esResult, true);
}



?>