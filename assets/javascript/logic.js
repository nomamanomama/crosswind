 // xplor

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

    // this makes the side bar open in mobile view
    $(".button-collapse").sideNav();

    // tm scroll buttons, NOT CURRENTLY WORKING
    $("#left-scroll").on("click", function(){
        console.log("Left scroll was clicked!");
        var e = jQuery.Event("keyup");
        $("#tm-feed").focus();
        e.keyCode = 37;
        $("#tm-feed").trigger(e);
    });

    //this initializes the wiki carousel
    $('.carousel.carousel-slider').carousel({fullWidth: true});
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











});    




var gm_map;
var gm_APIKey = "AIzaSyDFIsRYpp6K-0m9E21Mtng6wm-FWmY3h3Q";
var gm_geoLat = 40.7127753; 
var gm_geoLng = -74.0059728;
var gm_searchLocation;
var gm_marker;

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

function updatePosition() {
    gm_searchLocation = new google.maps.LatLng(gm_geoLat, gm_geoLng);
    gm_marker.setPosition(gm_searchLocation);
    gm_map.setCenter(gm_searchLocation);
}

