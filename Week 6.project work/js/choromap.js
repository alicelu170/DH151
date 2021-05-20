// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = '';

let geojsonPath = 'data/waste1.json'; //where the geojson file is located
let geojson_data; //placeholder for data
let geojson_layer; //placeholder for layer of geojson

let brew = new classyBrew();
let fieldtomap;

//legend box creation. extends leaflet, and place it in bottom right
let legend = L.control({position: 'bottomright'});

let info_panel = L.control(); //postion of panel is default to top right



// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	getGeoJSON();
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('Mismanaged_plastic_waste_2010_tonnes') // add a field to be used
	})
}

//calling this function with ANY FIELD will REDRAW the map to fit those parameters 
function mapGeoJSON(field /*, num_class, etc....*/){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		if(item.properties[field] != undefined){
			values.push(parseFloat(item.properties[field]))
		}
		//values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(9 /*num_class*/); //how many groups of colors there are 
	brew.setColorCode('YlOrRd');
	brew.classify('quantile'); //how the color groups are classiflied 

    // create the geojson layer
    geojson_layer = L.geoJson(geojson_data,{
        style: getStyle,
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);

	map.fitBounds(geojson_layer.getBounds())

    // create the legend. function is created towards bottom of code
	createLegend();

    // create the infopanel
	createInfoPanel(); //(not create legend as in the lab)
}


function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}


// return the color for each feature. called in getStyle --> gets color from population estimate number from data 
/*function getColor(d) {
	return d > 1000000 ? '#800026' : // syntax: if value of d is greater than xxxxx, then make it xxx color.
		   d > 500000  ? '#BD0026' :
		   d > 100000  ? '#E31A1C' :
		   d > 50000  ? '#FC4E2A' :
		   d > 10000   ? '#FD8D3C' :
		   d > 5000   ? '#FEB24C' :
		   d > 1000   ? '#FED976' :
					  '#FFEDA0';
}*/

function createLegend(){
	legend.onAdd = function (map) {
        //creates the html div that holds the info for legend
		var div = L.DomUtil.create('div', 'info legend'),
        //brew info that gets put into legend
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
                    //the numbers that are actually put into the legend
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
    //updates the infopanel
    info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
    info_panel.update(); // resets infopanel when not highlighted, to default
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties fed to it. 
    //whatever is highlighted, put that in the info panel.
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted:
        //but if nothing is highlighted, then panel will tell user to do something
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}
