// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
let markers = L.featureGroup();
//create an empty global variable
let csvdata;
let lastdate;

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

// create the empty map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
// where is the data / path? bring it in. Once in, do something
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
            //put the data that has been loaded via this reading function into the global variable
            //Now, this variable can be used globally
            csvdata = data;
            
            //allows for you to just type in lastdate in console to always get the last date for which data is available//
            lastdate = csvdata.meta.fields[csvdata.meta.fields.length-1];

            createSidebarButtons();
            // call the mapCSV function to map the data
			mapCSV(lastdate);
			
		}
	});
}

// feeding function a date means it will genreate map of that particulate date
function mapCSV(date){
    //clear markers every time loaded
    markers.clearLayers();

	// loop through every row in the now-globalized csv data
	csvdata.data.forEach(function(item,index){
		// check to make sure the Latitude column exists
		if(item.Lat != undefined){

            let circleOptions = {
                radius: 5,
                weight:1,
                color: "white",
                fillColor:"pink",
                fillOpacity: 0.5,
                radius: getRadiusSize(item[date]),　// call a function to determine radius size
            }
			// Lat exists, so create a circleMarker for each country
            newmarker = L.circleMarker([item.Lat, item.Long], circleOptions)
            .on('mouseover', function(){
                this.bindPopup(`${item["Country/Region"]}<br>Total confirmed cases as of ${date}: ${item[date]}`).openPopup()
            })

			// add the circleMarker to the featuregroup
            markers.addLayer(newmarker)

		} // end if
        else{
            return
        }
	})

	// add the featuregroup to the map
    markers.addTo(map);

	// fit the circleMarkers to the map view
    map.fitBounds(markers.getBounds())

}

function getRadiusSize(value){
	// calculate the min/max values in the data, 
	// and create a range so that the largest circle size is 100
	let values = [];
    csvdata.data.forEach(function(item, index){
        if(item[lastdate] != undefined){
            values.push(Number(item[lastdate]))
        }
    })
    let min = Math.min(...values);
    let max = Math.max(...values);

    // per pixel if 100 pixel is the max range
	perpixel = max/100;
	return value/perpixel
}

function createSidebarButtons(){

	// put all available dates into an array (dates)
	// using slice to remove first x (4) columns which are not dates, which we determined from looking at the dataset
	let dates = csvdata.meta.fields.slice(4)

	// loop through each date append them to the sidebar as a circle 
    // create a hover-able button
	dates.forEach(function(item,index){
		$('.sidebar').append(`<span onmouseover="mapCSV('${item}')" class="sidebar-item" title="${item}">●</span>`)
	})
}


