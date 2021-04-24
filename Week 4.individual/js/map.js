// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 2;
// path to csv data
let path = "data/plastic_trade.csv";
// global variables
let exportmarkers = L.featureGroup();
let importmarkers = L.featureGroup();

/* Part of my attempt to loop through data and create the sidebar, but I was having issues.
let locations=["USA", "China, Hong Kong SAR", "China"];
let locationcoord = [
	{
		lat:37.09024, 
		long:-95.712891	
	},
	{
		lat: 22.3193039,
		long: 114.1693611
	},
	{
		lat: 35.86166,
		long: 104.195397
	}
]; */

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
	//design for circles of points of export
    let circleOptions = {
        radius: 15,
        weight: 1,
        color: "white",
        fillColor: null,
        fillOpacity: 0.1, 
    }
	//design for circles of points of import
	let circleOptionsEnd = {
		radius: 15,
		weight: 1,
		color: "white",
		fillColor: null,
		fillOpacity: 0.1,
	}
	
	/* I was trying to figure out a way to look through data and create a clickable sidebar, but was having difficulty!
	for(i=1; i<6; i++){
		$(".sidebar").append(`<div class ="sidebar-item" onclick= "map.flyTo(${locationcoord[i-1], locationcoord[i++], 12})"> 
		${locations[i-2]} </div>`)
		
	}
	function flyToLocation(n){
		data.data.forEach(function(item,index){
			if (item.SourceCountry === n){
				map.flyTo([item.LatSource, item.LongSource], 12)
			}
		})
	}*/

	$(".sidebar").append(`<div class ="sidebar-item" onclick= "map.flyTo([37.09024, -95.712891], 5)"> 
	USA </div>`)
	$(".sidebar").append(`<div class ="sidebar-item" onclick= "map.flyTo([22.3193039, 114.1693611], 5)"> 
	China, Hong Kong SAR </div>`)
	$(".sidebar").append(`<div class ="sidebar-item" onclick= "map.flyTo([35.86166, 104.195397], 5)"> 
	China </div>`)


	data.data.forEach(function(item,index){

		if (item.TradeFlow === "Export" || item.TradeFlow === "Re-Export"){
		
			
			circleOptions.radius = item.QtyKg * 0.00000005
			circleOptions.fillColor= "green"

			let exportmarker = L.circleMarker([item.LatSource,item.LongSource], circleOptions)
			.on('mouseover',function(index){
				this.bindPopup(`${item.SourceCountry + " " + item.TradeFlow + "ed " + item.QtyKg + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup()
			})
			exportmarkers.addLayer(exportmarker)

		}
		else {
			circleOptionsEnd.radius = item.QtyKg * 0.00000006
			circleOptionsEnd.fillColor= "red"
			let importmarker = L.circleMarker([item.LatSource,item.LongSource], circleOptionsEnd)
			.on('mouseover',function(){
				this.bindPopup(`${item.SourceCountry + " " + item.TradeFlow + "ed " + item.QtyKg + " kg of plastic waste from " + item.Partner}`).openPopup()
			})
			importmarkers.addLayer(importmarker)

		}
		

	// add featuregroup of markers to map
		importmarkers.addTo(map)
		exportmarkers.addTo(map)

	})

	let addedlayers = {
        "Export": exportmarkers,
        "Import": importmarkers,
    }


// add layer control box. "null" is for basemap. layers, i.e., is defined above
L.control.layers(null,addedlayers).addTo(map);

	// fit markers to map so that the map goes to the fitted markers
	map.fitBounds(exportmarkers.getBounds())
}