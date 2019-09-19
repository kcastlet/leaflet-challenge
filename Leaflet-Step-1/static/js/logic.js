// store url for api endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// perform GET request to the query url
d3.json(url, function(data) {
  // send data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // function which runs for each feature in the features array
  // gives each feature a popup describing the location and magnitude
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2><center> Location <br></h2>" + feature.properties.place +
    "<hr><center><h2>Magnitude<br></h2>"+feature.properties.mag);
  }

  // color selector based on magnitude
  function chooseColor(feature) {
    if (feature.properties.mag > 5.000) {
        return {color: "red", fillColor: "red", fillOpacity: .7, stroke: true,
        color: "black", weight: .5};
    }
    else if (feature.properties.mag > 4.000 && feature.properties.mag <= 5) {
        return {color: "pink", fillColor: "pink", fillOpacity: .7, stroke: true,
        color: "black", weight: .5};
    }
    else if (feature.properties.mag > 3.000 && feature.properties.mag <= 4) {
        return {color: "orange", fillColor: "orange", fillOpacity: .7, stroke: true,
        color: "black", weight: .5};
    }
    else if (feature.properties.mag >= 2.000 && feature.properties.mag <= 3) {
      return {color: "yellow", fillColor: "yellow", fillOpacity: .7, stroke: true,
      color: "black", weight: .5};
    }
    else if (feature.properties.mag >= 1.00 && feature.properties.mag <= 2) {
        return {color: "#99d8c9", fillColor: "#99d8c9", fillOpacity: .7, stroke: true,
        color: "black", weight: .5};
    }
    else if (feature.properties.mag < 1) {
        return {color: "#006d2c", fillColor:"#006d2c", fillOpacity: .7, stroke: true,
        color: "black", weight: .5};
    }
    else {
      return {color: "black"}
    }
  };

  // create geoJSON layer containing features array on the earthquakeData object
  var earthquakes = L.geoJSON(earthquakeData, {
    // change color of points depending on magnitude
    style: chooseColor,
    // run the onEachFeature function for each piece of data in the array
    onEachFeature: onEachFeature,
    // create circles and resize them
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        {
          radius: (feature.properties.mag)*4,
        });
    }
  });

  // send the earthquake layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // define streetmap and lightmap layers 
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  // define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // create overlay object to hold our overlay layer 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // create our map, giving it the streetmap and earthquak layers
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // create a layer control and pass in our baseMaps and overlayMaps
  // add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   // Add Legend
   let legend = L.control({position: 'bottomright'});

   legend.onAdd = function(map) {
     let div = L.DomUtil.create('div', 'info legend'),
       grades = [0, 1, 2, 3, 4, 5],
       labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

     for (let i = 0; i < grades.length; i++) {
       div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
               grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     }

     return div;
   };

legend.addTo(myMap);

};

// colors for legend
function chooseColor(magnitude) {
  return magnitude >= 5 ? "red":
         magnitude >= 4 ? "pink":
         magnitude >= 3 ? "orange":
         magnitude >= 2 ? "yellow":
         magnitude >= 1 ? "#99d8c9":
         "#006d2c";
}
