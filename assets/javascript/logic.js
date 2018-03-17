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
    var geoLat;
    var geoLng;
    var countryCode = "US"; //Can be removed if desired
    var ticketmaster_queryURL;
    // ---------------------



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
                // console.log(json._embedded.events);

            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });
    }
    // ---------------------


function getWiki() {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=15&generator=search&origin=*&gsrsearch=" + cityCode+"+"+stateCode, function(data){
        console.log(data);
        
    });
}


    // ---------------------
    $("form").on("submit", function (e) {
        event.preventDefault();
        var location = $("input").val();
        regexp1 = /[\w ]+, \w{2}/;
        regexp2 = /\d{5}/;
        // console.log(location);
        // console.log(regexp1.test(location))
        // console.log(regexp2.test(location))

        if (regexp1.test(location)) {
            // console.log("city, state");
            // location = location.replace(/,\s?/g, " ");
            location = location.split(", ");
            cityCode = location[0];
            stateCode = location[1];
            // console.log(cityCode);
            // console.log(stateCode);
            InputType = 1;
            findGeo(InputType, cityCode, stateCode);
        } else if (regexp2.test(location)) {
            // console.log("zip");
            zipCode = location;
            InputType = 2;
            findGeo(InputType, zipCode);
        }
        findTickets();
        getWiki();
    });
    // ---------------------











});    



var houston = { lat: 29.7604, lng: -95.3698 };
var map;
var gm_APIKey = "AIzaSyC7qKO6Pu0BX0_Hh7xtqJrFBqCR1hxegDo";

function findGeo(type, p1, p2="") {
    var geo_queryURL;
    //if InputType = city,state
    if (type === 1){
         geo_queryURL = "https://maps.googleapis.com/maps/api/geocode/json?locality=" + p1 + "administrative_area_level_1=" + p2 + "key=" + gm_APIKey;
    }
    //else InputType = zip
    else {
        geo_queryURL = "https://maps.googleapis.com/maps/api/geocode/json?postal_code=" + p1 + "key=" + gm_APIKey;
    }

    $.ajax({
        type: "GET",
        url: geo_queryURL,
        async: true,
        dataType: "json",
        success: function (response) {
            console.log(response.results);
            geoLat = response.result[0].location.lat;
            geoLng = response.result[0].location.lng;
            console.log("Lat:" + geoLat + ", Lng:" + geoLng);

        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: houston,
        zoom: 5
    });

    var marker = new google.maps.Marker({
        position: houston,
        map: map
    });
}


