// xplor

$(function () {
    console.log("hello world");




    // ---------------------
    // Search Word Keys  
    var cityCode = "Houston";
    var stateCode = "TX";
    var countryCode = "US"; //Can be removed if desired
    // ticket master API AJAX call function
    // Chrome and Opera browswers show error codes that M70 and Opera 57  (started March 15, 2018); the call is still functional
    // Firefox and Safari show no errors at this moment
    function findTickets() {
        var ticketMaster_APIKey = "LArupGEb8gAMQ2uWg9JAZbXzTHjcEMY5";
        var ticketmaster_queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=' + countryCode + '&stateCode=+' + stateCode + '&cityCode=' + cityCode + '&apikey=' + ticketMaster_APIKey;
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








    findTickets();

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


