// Global variables
let landfillsmap;
let landfillslat = 0;
let landfillslon = 0;
let landfillszl = 3;
// path to csv data
let landfillspath = "data/landfills.csv";
// global variables
let landfillsmarkers = L.featureGroup();

// initialize
/*when the website is loaded, do this FIRST! 
in this case, it will create map first with predefined map parameters initialized above */
// initialize
$( document ).ready(function() {
	createlandfillsMap(landfillslat,landfillslon,landfillszl);
	readlandfillsCSV(landfillspath);
});


// create the map
/* a function to create the map that accepts lat, lon, zoom level */
function createlandfillsMap(lat,lon,zl){
	landfillsmap = L.map('landfillsmap').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(landfillsmap);
}

// function to read csv data. from PapaParse
// takes path variable (defined at top) 
/* does the csv fil have a header?
let the file download first
once download is complete, do something with it. */
function readlandfillsCSV(landfillspath){
	Papa.parse(landfillspath, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			maplandfillsCSV(data);

		}
	});
}

function maplandfillsCSV(data){

    let landfillscircleOptions = {
        radius: 5,
        weight: 1,
        color: "white",
        fillColor: "dodgerblue",
        fillOpacity: 1, //no opacity
    }

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker. 
        //added circleOptions to end of circleMarker to call the design options made above
		let landfillsmarker = L.circleMarker([item.sitelat,item.sitelong], landfillscircleOptions)
        
        //chains a mouseover function that shows the location and image in popup when HOVERED
        .on('mouseover',function(){
			this.bindPopup(`${item.name}<br><img src="${item.imageurl}">`).openPopup()
		})

		// add marker to featuregroup
		landfillsmarkers.addLayer(landfillsmarker)

		// add entry to sidebar
		$('.landfillssidebar').append(`<img src="${item.imageurl}" onclick="panToImage(${index})">`)
	})

	// add featuregroup of markers to map
	landfillsmarkers.addTo(landfillsmap)

	// fit markers to map so that the map goes to the fitted markers
	landfillsmap.fitBounds(landfillsmarkers.getBounds())
}

function panToImage(index){
	// zoom to level 17 first
	landfillsmap.setZoom(8);
	// pan to the marker
	landfillsmap.panTo(landfillsmarkers.getLayers()[index]._latlng);
}