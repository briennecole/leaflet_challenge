// Create a map object
const myMap = L.map("map", {
  center: [40, -90],
  zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Create Circle colors
function circleColor(depth) {
  switch (true) {
    case depth < 5:
      return "green";
    case depth <20 :
      return "yellow";
    case depth > 50:
      return "orange";
    case depth <= 100:
      return "red";
    default:
      return "blue"
  }}

  // Create circle size
function circleSize(magnitude) {
    return (magnitude*40000);
  }
// Store our API endpoint inside the queryURL
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"


  Promise.all(

// Perform a GET request to the query URL
    [d3.json(queryUrl)]).then( ([data]) => {
    console.log(data);

        let earthquakes = data.features;

            earthquakes.forEach(earthquake => {
              let magnitude = earthquake.properties.mag;
              let depth = earthquake.geometry.coordinates[2];
              let place = earthquake.properties.place;

        
              L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                  radius: circleSize(magnitude),
                  fillColor: circleColor(depth),
                  fillOpacity: .5,
                  stroke: false,
              }).bindPopup("<h3>" + "Place: " + place +
              "</h3><hr><h3>Magnitude: " + magnitude + "</h3><h3>Depth: " + depth + "</h3>").addTo(myMap);
            })
  
  }).catch(e => console.warn(e))
  
  
