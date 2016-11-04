var circleConfig = {
    color: 'yellow',
    fillColor: 'white',
    fillOpacity: 0.5
}
var baseRadius = 10000;

var circles = [];

var dayIndex = 0;

// var po = org.polymaps;
var jsonData = null;
var newJsonData = null;

function renderMap() {
    // var map = po.map()
    //     .container(document.getElementById("map").appendChild(po.svg("svg")))
    //     .add(po.interact())
    //     .add(po.hash())
    //     .center({lat: 46.14, lon: -101.26})
    //     .zoom(4);

    // map.add(po.image()
    //     .url(po.url("http://{S}tile.cloudmade.com"
    //     + "/9c01b06470084ec3b50e8de888a13e89" // http://cloudmade.com/register
    //     + "/999/256/{Z}/{X}/{Y}.png")
    //     .hosts(["a.", "b.", "c.", ""])));

    // map.add(po.compass().pan("none"));
    map = L.map('map').setView([46.14, -101.26], 4);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJpY2Y1MTUiLCJhIjoiY2lxc3U1dzZ0MDAwM2Z3bnQyajc4dGY5cyJ9.iqBYbA3KpAao6G48Ae4GEA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ericf515.i22837o3',
        accessToken: 'pk.eyJ1IjoiZXJpY2Y1MTUiLCJhIjoiY2lxc3U1dzZ0MDAwM2Z3bnQyajc4dGY5cyJ9.iqBYbA3KpAao6G48Ae4GEA'
    }).addTo(map);


    var circle = L.circle([46.13, -101.24], 500, circleConfig).addTo(map);

    var myVar;

    refreshData(dayIndex++);

    //set up click actions
    for (i = 0; i < allDatesData.length; i++) {
        $('#date' + i).click(selectDate);
        $('#date' + i).addClass('clickable');
    }
}

function startAnimation() {
    myVar = setInterval(function () { refreshData(dayIndex++) }, 500);
}

function renderCircle(recc) {
    var newCircle = L.circle(
        [recc.geometry.coordinates[1], recc.geometry.coordinates[0]],
        baseRadius * recc.properties.count,
        // baseRadius * Math.random(),
        circleConfig).
        addTo(map);
    circles.push(newCircle);
}

function refreshData(index) {
    console.log("refreshData", index);
    if (index < allDatesData.length) {
        while(circles.length > 0) {
            map.removeLayer(circles.pop());
        }
        unhighlightDate(index-1);
        // if (jsonData) {
        //     map.remove(jsonData)
        //     unhighlightDate(i - 1);
        // }
        // jsonData = po.geoJson()
        //     .features(allDatesData[i]['features'])
        //     .on("load", load)
        //     .clip(false);
        // map.add(jsonData);
        for (var i in allDatesData[index].features) {
            renderCircle(allDatesData[index].features[i]);
        }

        $('#date' + index).addClass('selected');

    } else {
        stopTimer();
    }

}

function hideLayer(layer) {
    map.remove(layer);
}

function stopTimer() {
    clearInterval(myVar);
}

function updateCaption(date) {
    $("#title").text(date);
}

/**
 * Handler for new data coming in - render the circles for a given date
 */
function load(e) {
    for (var i in e.tile.element.childNodes) {
        var el = e.tile.element.childNodes[i];
        var val = e.features[i];
        if (val && val.data) {
            count = val.data.properties.count;
            r = 3 * count;
            //if (count > 10000) r = 6;
            //else if (count > 5000) r = 4; 

            el.setAttribute("r", r);
        }
    }
}

function updateData() {
    jsonData = po.geoJson()
        //.url("wsis-sample.json")
        .features(singleDateData)
        .on("load", load)
        .clip(false)
        .reshow();
}

function unhighlightDate(dateIndex) {
    $('#date' + dateIndex).removeClass('selected');
}

function selectDate() {
    unhighlightDate(dayIndex - 1);
    elementId = this.id;
    dayIndex = elementId.substring(4);
    refreshData(dayIndex++);
}

renderMap();