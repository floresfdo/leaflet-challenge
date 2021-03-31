function createMap (earthquakes) {
    var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satelite Map": satmap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    }

    var myMap = L.map("mapid",{
        center: [37.09024,-95.712891],
        zoom: 3,
        layers: [satmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
}

function markColor(coord) {

    if (coord[2] <= 5) {
        return "#FF0000";
    } else if (5 < coord[2] & coord[2] <= 10) {
        return "#FFA500";
    } else if (10 < coord[2] & coord[2] <= 15) {
        return "#12E510";
    } else if (15 < coord[2] & coord[2] <= 20) {
        return "#FFFF00";
    } else {
        return "#ADFF2F";
    };
  }

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url, function(data) {
    var earthquakes = data.features;
    var earthquakeMarkers = []

    for (var i = 0; i < earthquakes.length; i++) {
        var earthquake = earthquakes[i];
        var marker = L.circleMarker([ earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0] ], {
                radius: earthquake.properties.mag * 3,
                fillColor: markColor(earthquake.geometry.coordinates),
                fillOpacity: 0.7,
                weight: 2,
                color: "black"
            })
            .bindPopup("<h4>Where: " + earthquake.properties.place + "</h4>When: " + new Date (earthquake.properties.time) + "<br>Magnitude: " +  earthquake.properties.mag + "<br>Depth: " + earthquake.geometry.coordinates[2]);

        earthquakeMarkers.push(marker);
    }
    createMap(L.layerGroup(earthquakeMarkers));
});