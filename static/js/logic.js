// Create a map object
const myMap = L.map("map", {
  center: [30, -90],
  zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// Store our API endpoint inside the queryURL
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
    console.log(data);
    console.log(d3.extent(data.features.map(d => d.properties.mag)))
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {

      // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><h3>Magnitude: "(feature.properties.mag) + "</h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");
    }

    // Create circle size based on magnitude
    // function circleSize(magnitude) {
    //   return (magnitude * 10000)
    }

    const setColor = (depth) => {
      switch (true) {
        case depth < 10:
          return "green";
        case depth <30 :
          return "yellow";
        case depth > 50:
          return "orange";
        case depth <= 100:
          return "red";
        default:
          return "blue"
      }
    

      // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
     });

    const mags = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (earthquakeData, latlng) => {
        return new L.Circle(latlng, {
            radius: feature.properties.mag*25000,
            Color: setColor(earthquakeData.geometry.coordinates[2]),
            fillOpacity: .5,
            storke: false,

        });
       }
      
    }).catch(error => console.log(error));
  // Sending our earthquakes layer to the createMap function
//      createMap(earthquakes, mags);
// }


/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls, 
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/ 