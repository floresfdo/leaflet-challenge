var myMap = L.map("mapid",{
    center: [37.09024,-95.712891],
    zoom: 5,
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
  
d3.json(url, function(data) {
    function getStyle(feature) {
        
        return {
            fillColor: grabColor(feature.geometry.coordinates[2]),
            radius: grabRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    };
    
    function grabColor(d) {
        return d > 10  ? '#E31A1C' :
               d > 8  ? '#FC4E2A' :
               d > 6   ? '#FD8D3C' :
               d > 4   ? '#FEB24C' :
               d > 2   ? '#FED976' :
                          '#FFEDA0';
    };

    function grabRadius(magnitude){
        
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 5;
    };

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup("Mag: " + feature.properties.mag + "<br>Loc: " + feature.properties.place);
        }
    }).addTo(myMap);
});
