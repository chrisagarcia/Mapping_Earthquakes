
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

let darkLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let baseMaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets,
    "Dark Mode": darkLayer
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 5,
    layers: [streets]
});

// L.control.layers(baseMaps).addTo(map);

// geoJSON url from github
let eqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// function to use in styleInfo to get the desired radius
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

// funciton for assigning a color
function getColor(magnitude) {
    if (magnitude > 5) {
      return "#e31a1c";
    }
    if (magnitude > 4) {
      return "#fc4e2a";
    }
    if (magnitude > 3) {
      return "#fd8d3c";
    }
    if (magnitude > 2) {
      return "#feb24c";
    }
    if (magnitude > 1) {
      return "#fed976";
    }
    return "#ffffb2";
  }


// style data for each of the eqs, mag goes in to calc th eradius
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: .8,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}


// eq layer
let earthquakes = new L.layerGroup();
// plates layer
let plates = new L.layerGroup();
// big quakes
let bigEq = new L.layerGroup();

// overlay obj
let overlays = {
    "Earthquakes": earthquakes,
    "Tectonics": plates,
    "Earthquakes > 4.5m": bigEq
};

// user controll
L.control.layers(baseMaps, overlays).addTo(map);
// adding the layers to default
map.addLayer(earthquakes);
map.addLayer(plates);
map.addLayer(bigEq);


// using the onEachFeature callback inside L.geoJSON
d3.json(eqData).then(data => {
    // console.log(data);
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            // console.log(data);
            return L.circleMarker(latlng);
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<hr>Location: " + feature.properties.place);
        },
        style: styleInfo
    }).addTo(earthquakes);
});


// function to provide contrast in darkmode
// function lineColor() {
//     if (d3.select("img").src === ) {
//         return "#ffffff"
//     }
//     else {return "#000000"}
// };

console.log(d3.select("img")._groups[0][0].src);

// adding tectonic plate lines for fun
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(tectonicData).then(data => {
    L.geoJson(data, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`Name: ${feature.properties.Name}`)
        },
        style: {
            color: "#FF33F3",
            weight: 1,
        }
    }).addTo(plates);
});

// adding the layer for the large eqs
let bigEqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
d3.json(bigEqData).then(data => {
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            let options = {
                radius: feature.properties.mag * 8
            };
            return L.circleMarker(latlng, options);
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>Magnitude: ${feature.properties.mag}</b><hr>${feature.properties.place}`)
        },
        style: styleInfo
    }).addTo(bigEq);
})

// legend control object
let legend = L.control({position: "bottomright"});


// add legend details
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
    "#ffffb2",
    "#fed976",
    "#feb24c",
    "#fd8d3c",
    "#fc4e2a",
    "#e31a1c"
    ];

    // loop through the intervals to generate the label with color square
    for (var i=0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(map);