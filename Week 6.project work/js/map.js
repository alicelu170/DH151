// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 2;
// path to csv data
let path = "data/usa-world-plastic-20161718.csv";
// global variables
let importmarkers2016 = L.featureGroup();
let importmarkers2017 = L.featureGroup();
let importmarkers2018 = L.featureGroup();

var latlongs2016 = [];
var latlongs2017 = [];
var latlongs2018 = [];

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});
// create the empty map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	/*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);*/
    var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);
}
// read data w PapaParse
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

/*–––––––––CIRCLES–––––––––*/
//design for circles of points of import
let circleOptionsImport = {
    radius: 15,
    weight: 0.5,
    color: "",
    fillColor: null,
    fillOpacity: 0.1,
}
//function to map all countries that US exported plastic to for a given year
function mapImportingCountries(setcolor, datayear, year, dataweight, latitude, longitude, reporter, flow, partner, latlongsyear, arrayyear){
    if (datayear === year){
        circleOptionsImport.color = setcolor
        circleOptionsImport.radius = dataweight * 0.0000001
        let importedMarker = L.circleMarker([latitude, longitude], circleOptionsImport)
        .on('mouseover',
            function(index){
                this.bindPopup(`${reporter + " " + flow + "ed " + dataweight + " kg of plastic waste to " + partner + " in " + datayear}`).openPopup();
        })
        let templatlong = [latitude, longitude];
        latlongsyear.push(templatlong);
        //adds all markers of countries that US exported plastic to in 2016
        arrayyear.addLayer(importedMarker);
    }
};

/*–––––––––ANTLINES–––––––––*/
//design for AntLines
let antlineoptions={
    color : '', 
    weight: 2,
    opacity:0.5,
    delay: 700,
};
//function to make AntLines to all countries that US exported plastic to for a given year and add to layer
function makeAntLines(latlongsyear,arrayyear, setcolor){
    for(i=0; i<latlongsyear.length; i++){
        antlineoptions.color = setcolor;

        antPolyline = L.polyline.antPath([[37.09024, -95.712891], [latlongsyear[i][0], latlongsyear[i][1]]], antlineoptions);
        antPolyline.addTo(map);
        arrayyear.addLayer(antPolyline);
    }
}

function mapCSV(data){
    //mapping each layer by year and adding to map
    data.data.forEach(function(item,index){
        if (item["Trade Flow"] === "Export" || item ["Trade Flow"] === "Re-Export"){
            mapImportingCountries("green", item.Year, "2016", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2016, importmarkers2016);

            mapImportingCountries("pink", item.Year, "2017", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2017, importmarkers2017);

            mapImportingCountries("red", item.Year, "2018", item["Netweight (kg)"], item.importLat, item.importLong, item.Reporter, item["Trade Flow"], item.Partner, latlongs2018, importmarkers2018);
        }
	    // add featuregroup of markers to map
		importmarkers2016.addTo(map)
        importmarkers2017.addTo(map)
        importmarkers2018.addTo(map)
	})

    //adding toggle layers by year
	let addedlayers = {
        "2016 Imports": importmarkers2016,
        "2017 Imports": importmarkers2017,
        "2018 Imports": importmarkers2018,
    }

    //making AntLines by year
    makeAntLines(latlongs2016,importmarkers2016,"green");
    makeAntLines(latlongs2017,importmarkers2017, "pink");
    makeAntLines(latlongs2018,importmarkers2018, "red");

    // add layer control box. "null" is for basemap. layers, i.e., is defined above
    L.control.layers(null,addedlayers).addTo(map);

	// fit markers to map so that the map goes to the fitted markers
	map.fitBounds(importmarkers2016.getBounds());

    //for loop to make sidebar items, but unable to figure out how to reduce duplicates 
    var latlongs = []; //which includes ALL COORD of every PARTNER COUNTRY 
    var countries = [];

    data.data.forEach(function(item, index){ 
        if(i=0, i<= countries.length){
            if(item.Partner !== countries[i]){
                i++;
            }
            else{
                return;
            }
            eachpoint = [item.importLat, item.importLong];
            latlongs.push(eachpoint);
            countries.push(item.Partner);
        }
    });

    //for loop to add sidebar buttons
    latlongs.forEach(function(item){
        //console.log(latlongs[i])
        $(".mapsidebar").append(`
            <div class ="sidebar-item"
            onclick= "map.flyTo([${latlongs[i]}], 5)"> 
            <p class = "font2">
            ${countries[i]} </p>
            </div>`)
        i++;
    })

}