//import and visualize the data 

let queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



//Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.

//Hint: The depth of the earth can be found as the third coordinate for each earthquake.




  
  //  Perform a GET request to the query URL/
 d3.json(queryUrl).then(function (data) {
 console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 20000;
};

function chooseColor(depth) {
  switch(true) {
    case depth > 10:
      return "red";
    case depth > 8:
      return "orangered";
    case depth > 5:
      return "orange";
    case depth > 3:
      return "gold";
    case depth > 1:
      return "yellow";
    default:
      return "green";
  }
}


function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  // Point to layer used to alter markers
  
    pointToLayer: function(feature, latlng) {

      // Determine the style of markers based on properties
      let markers = {
        radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.40,
          color: chooseColor(feature.geometry.coordinates[2]),
          stroke: true,
          weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });




  // Send our earthquakes layer to the createMap function/
  //Using Leaflet, create a map that plots all the earthquakes 
  //from your dataset based on their longitude and latitude.
  createMap(earthquakes);
}

function createMap(earthquakes) {

   // Define streetmap and darkmap layers
 let grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "grayscale Map": grayscale
  };

  
  // // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [ grayscale, earthquakes]
  });

//Create a legend that will provide context for your map data.
//Include popups that provide additional information about 
//the earthquake when its associated marker is clicked.
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 1, 3, 5, 8, 10];

  div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)

// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps , overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}