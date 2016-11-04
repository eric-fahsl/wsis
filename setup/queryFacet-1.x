{
    "query": {
        "filtered": {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "date": {
                                "gte": "2016-02-01"
                            }
                        }
                    }],
                    "should": [],
                    "minimum_number_should_match": 1
                }
            },
            "filter": []
        }
    },
    "facets": {
        "date": {
            "terms": {
                "field": "date",
                "order": "term"
            }
        },
        "region": {
            "terms": {
                "field": "region"
            }
        },
        "state": {
            "terms": {
                "field": "state",
                "order": "term",
                "size": 30
            }
        },
        "powder": {
            "range": {
                "field": "powder.rating",
                "ranges": [{
                    "from": 4
                }, {
                    "from": 3,
                    "to": 4
                }, {
                    "from": 2,
                    "to": 3
                }]
            }
        },
        "distance": {
            "geo_distance": {
                "location": "47.5926955,-122.30560419999999",
                "unit": "mi",
                "ranges": [{
                    "to": 100
                }, {
                    "from": 100,
                    "to": 200
                }, {
                    "from": 200,
                    "to": 400
                }]
            }
        }
    },
    "sort": [{
        "powder.rating": {
            "order": "desc"
        }
    }, {
        "snow_quality.rating": {
            "order": "desc"
        }
    }, {
        "bluebird.rating": {
            "order": "desc"
        }
    }, {
        "powder.snow_new": {
            "order": "desc"
        }
    }],
    "fields": ["powder.rating", "state_full", "freezing_level.rating", "resort", "date", "bluebird.rating", "resort_name", "snow_quality.rating"]
}