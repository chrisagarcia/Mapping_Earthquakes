console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([33.425125, -94.047688], 4);

L.tileLayer("https://api.mapbox.com/")

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

function scaleNum(num, oldCeiling, newScaler) {
    return (num / oldCeiling) * newScaler
};

let line = [
    [33.9416, -118.4085],
    [37.6213, -122.3790],
    [40.7899, -111.9791],
    [47.4502, -122.3088]
];

L.polyline(line, {
    color: "#fd6d5f"
}).addTo(map);