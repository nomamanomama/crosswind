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
            location = location.replace(/,\s?/g, " ");
            location = location.split(" ");
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
        findTickets();
    });
    // ---------------------











});



var houston = { lat: 29.7604, lng: -95.3698 };

var map;
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


