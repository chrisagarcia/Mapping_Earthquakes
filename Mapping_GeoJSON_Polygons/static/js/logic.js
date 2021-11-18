
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let baseMaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [43.68108112399995, -79.39119482699992],
    zoom: 11,
    layers: [streets]
});

L.control.layers(baseMaps).addTo(map);

// geoJSON url from github
let torontoData = "https://raw.githubusercontent.com/chrisagarcia/Mapping_Earthquakes/main/torontoNeighborhoods.json";


// using the onEachFeature callback inside L.geoJSON
d3.json(torontoData).then(data => {
    console.log(data);
    L.geoJson(data, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>${feature.properties.AREA_NAME}</h3><hr><h3>${feature.properties.AREA_S_CD}</h3>`)
        }
    }).addTo(map);
});
