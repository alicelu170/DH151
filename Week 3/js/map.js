let lived = [
    {
        'title':'1/6 Plainsboro',
        'lat': 40.3191,
        'lon': -74.5923,
        'desc': 'Childhood home'
    },
    {
        'title':'2/6 Hong Kong',
        'lat': 22.2842,
        'lon': 114.1512,
        'desc': 'Home in Hong Kong'
    },
    {
        'title':'3/6 Andover',
        'lat': 42.6512,
        'lon': -71.1380,
        'desc': 'Dorm for three years during high school'
    },
    {
        'title': '4/6 UCLA',
        'lat': 34.0699,
        'lon': -118.4500,
        'desc': 'First year dorms at UCLA'
    },
    {
        'title': '5/6 Nicosia',
        'lat': 35.1659,
        'lon': 33.3185,
        'desc': 'Study abroad dorm'
    },
    {
        'title': '6/6 Princeton',
        'lat': 40.3158,
        'lon': -74.6325,
        'desc': 'Currently working from home'
    }
]


var map = L.map('map').setView([40.3191, -74.5923], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


//create feature group
let myMarkers= L.featureGroup();

//loop through data
lived.forEach(function(item, index){
    var marker = L.marker([item.lat, item.lon])
    .bindPopup(item.title+": "+item.desc)

    myMarkers.addLayer(marker)

   $(".sidebar").append(`<div class ="sidebar-item" onclick="flyToIndex(${index})">${item.title} </div>`)

});

myMarkers.addTo(map);


//create object(s) that define layers 
    let layers = {
        "My Markers": myMarkers
    }

// add layer control box. "null" is for basemap. layers, i.e., is defined above
L.control.layers(null,layers).addTo(map);

//returns the boundaries of layer: myMarkers.getBounds() 
map.fitBounds(myMarkers.getBounds());


// to write a function: make a function name, and what parametrs it takes
function flyToIndex(index){
    map.flyTo([lived[index].lat, lived[index].lon],12)
    //to open a popup automatially
    myMarkers.getLayers()[index].openPopup()

}