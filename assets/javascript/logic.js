 // xplor


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDjc4tJqAYyrcIUGQUrKHEuRnHBEMbEZEI",
    authDomain: "xplor-f51f6.firebaseapp.com",
    databaseURL: "https://xplor-f51f6.firebaseio.com",
    projectId: "xplor-f51f6",
    storageBucket: "",
    messagingSenderId: "337857743907"
};
firebase.initializeApp(config);
var db = firebase.database();


 $(function () {
    console.log("hello world");
    // ---------------------
    // Global Variables
    var InputType;
    // Search Word Keys  
    var cityCode;
    var stateCode;
    var zipCode;
 
    var countryCode = "US"; //Can be removed if desired
    var ticketmaster_queryURL;
    // ---------------------
   
    //get the community pinned map markers from database
    populateCommunityMarkers();

    // ---------------------
    // ticket master API AJAX call function
    // Chrome and Opera browswers show error codes that M70 and Opera 57  (started March 15, 2018); the call is still functional
    // Firefox and Safari show no errors at this moment
    function findTickets() {
        var ticketMaster_APIKey = "LArupGEb8gAMQ2uWg9JAZbXzTHjcEMY5";
        if (InputType === 1) {
            ticketmaster_queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=' + countryCode + '&stateCode=+' + stateCode + '&cityCode=' + cityCode + '&apikey=' + ticketMaster_APIKey;
        } else if (InputType === 2) {
            ticketmaster_queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=' + countryCode + '&postalCode=+' + zipCode + '&apikey=' + ticketMaster_APIKey;
        }
        $.ajax({
            type: "GET",
            url: ticketmaster_queryURL,
            async: true,
            dataType: "json",
            success: function (json) {
                console.log(json._embedded.events);

            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });
    }
    // ---------------------

    // ---------------------
    $("form").on("submit", function (e) {
        event.preventDefault();
        var location = $("input").val();
        regexp1 = /[\w ]+, \w{2}/;
        regexp2 = /\d{5}/;
        console.log(location);
        console.log(regexp1.test(location))
        console.log(regexp2.test(location))

        if (regexp1.test(location)) {
            console.log("city, state");
            //location = location.replace(/,\s?/g, " ");
            location = location.split(",");
            cityCode = location[0];
            stateCode = location[1];
            console.log(cityCode);
            console.log(stateCode);
            InputType = 1;
            
        } else if (regexp2.test(location)) {
            console.log("zip");
            zipCode = location;
            InputType = 2;
            
        }
        findGeo(location);
        findTickets();
    });
    // ---------------------


    $("#addMarker").on("click", function () {
        console.log ("add a marker");
        
        var lat = gm_marker.getPosition().lat();
        var lng = gm_marker.getPosition().lng();
        //update db storage with new marker position
        addCommunityMarker(lat,lng);

    });








});    




var gm_map;
var gm_APIKey = "AIzaSyDFIsRYpp6K-0m9E21Mtng6wm-FWmY3h3Q";
var gm_geoLat = 40.7127753; 
var gm_geoLng = -74.0059728;
var gm_searchLocation;
var gm_marker;
var gm_markers = [];


function findGeo(address) {

    geo_queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + gm_APIKey;

    $.ajax({
        type: "GET",
        url: geo_queryURL,
        async: true,
        dataType: "json",
        success: function (response) {
            console.log(response.results);
            gm_geoLat = response.results[0].geometry.location.lat;
            gm_geoLng = response.results[0].geometry.location.lng;
           
            console.log("Location: " + gm_geoLat, ", " + gm_geoLng);
            updatePosition();

        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function initMap() {
    gm_searchLocation = new google.maps.LatLng(gm_geoLat, gm_geoLng);
    gm_map = new google.maps.Map(document.getElementById('map'), {
        center: gm_searchLocation,
        zoom: 8
    });

    gm_marker = new google.maps.Marker({
        position: gm_searchLocation,
        map: gm_map
    });
}

//update the map location to new search location
function updatePosition() {
    gm_searchLocation = new google.maps.LatLng(gm_geoLat, gm_geoLng);
    //set a marker at the current position
    gm_marker.setPosition(gm_searchLocation);
    gm_map.setCenter(gm_searchLocation);
}

//store gm_markers as string in database key community
function addCommunityMarker(lat, lng) {
    
    var latLng = lat + "," + lng;
    //update global variable if position is not in the list
   if(gm_markers.indexOf(latLng) === -1)
        gm_markers.push(latLng);

    db.ref().once("value", function (snapshot) {
        var markers = [];
        if (snapshot.val()) {
            if(snapshot.val().community){
                markers = JSON.parse(snapshot.val().community);
            }
            //check if position is already in community board
            if (markers.indexOf(latLng) === -1){
                //it was not in the list so push to the local array
                markers.push(latLng);
                //update the database key with a stringified array
                db.ref().update({'community': JSON.stringify(markers) });
            }
        }    
    });
}

//get existing favorites from database community key
function populateCommunityMarkers() {

    //on initial load with gm_markers array empty, fill the array with community saved pins
    if(gm_markers.length === 0){
        //get a snapshot of the database 
        db.ref().once("value", function(snapshot) {
            if(snapshot.val().community){
                gm_markers = JSON.parse(snapshot.val().community);    
                //create google markers to display in community map
                gm_markers.forEach(element => {
                    var latLng = element.split(",");
                    var pos = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]));
                    var marker = new google.maps.Marker({
                        position: (pos),
                        map: gm_map
                    });
                });
            }
        });
    }
}
