// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
// path to csv data
let path = "data/dunitz.csv";
// global variables
let markers = L.featureGroup();

// initialize
/*when the website is loaded, do this FIRST! 
in this case, it will create map first with predefined map parameters initialized above */
// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});


// create the map
/* a function to create the map that accepts lat, lon, zoom level */
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data. from PapaParse
// takes path variable (defined at top) 
/* does the csv fil have a header?
let the file download first
once download is complete, do something with it. */
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

    let circleOptions = {
        radius: 5,
        weight: 1,
        color: "white",
        fillColor: "dodgerblue",
        fillOpacity: 1, //no opacity
    }

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker. 
        //use "latitude" and "longitude" (instead of lat and lon) because the DATA FILE itself uses those names
        //added circleOptions to end of circleMarker to call the design options made above
		let marker = L.circleMarker([item.latitude,item.longitude], circleOptions)
        
        //chains a mouseover function that shows the location and image in popup when HOVERED
        .on('mouseover',function(){
			this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)

		// add entry to sidebar
		$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
	})

	// add featuregroup of markers to map
	markers.addTo(map)

	// fit markers to map so that the map goes to the fitted markers
	map.fitBounds(markers.getBounds())
}

function panToImage(index){
	// zoom to level 17 first
	map.setZoom(17);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
}