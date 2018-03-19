// xplor

$(function () {
    console.log("hello world");
    // ---------------------
    // Global Variables
    var InputType = 1;
    // Ticket Master Search Word Keys  
    var cityCode = "Houston";
    var stateCode = "TX";
    var zipCode;
    var size = 8;
    var countryCode = "US"; //Can be removed if desired
    var ticketmaster_queryURL;

    // this makes the side bar open in mobile view
    $(".button-collapse").sideNav();

    // tm scroll buttons, NOT CURRENTLY WORKING
    $("#left-scroll").on("click", function () {
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
            ticketmaster_queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=' + size + '&countryCode=' + countryCode + '&stateCode=+' + stateCode + '&cityCode=' + cityCode + '&apikey=' + ticketMaster_APIKey;
        } else if (InputType === 2) {
            ticketmaster_queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=' + size + '&countryCode=' + countryCode + '&postalCode=+' + zipCode + '&apikey=' + ticketMaster_APIKey;
        }
        $.ajax({
            type: "GET",
            url: ticketmaster_queryURL,
            async: true,
            dataType: "json",
            success: function (json) {
                console.log(json._embedded.events);
                $("#tm-feed").empty();
                // Loop to all cards pull form API
                for (var i = 0; i < size; i++) {
                    var eventList = json._embedded.events[i]
                    var eventName = json._embedded.events[i].name;
                    var eventDate = json._embedded.events[i].dates.start.localDate;
                    var eventLink = json._embedded.events[i].url;
                    var eventImage = json._embedded.events[i].images[i].url;
                    var eventDate = json._embedded.events[i].dates.start.localDate;
                    var eventVenue = json._embedded.events[i]._embedded.venues[0].name;
                    // Createing variables for each element and attributes
                    var tmDiv1 = $("<div>");
                    var tmDiv2 = $("<div>");
                    tmDiv2.addClass("card z-depth-2 hoverable tm-card")
                    var tmDivImg = $("<div>");
                    tmDivImg.addClass("card-image waves-effect waves-block waves-light")
                    var tmImg = $("<img>");

                    tmImg.addClass("activator");
                    tmImg.attr("src", eventImage);


                    var tmDivTitle = $("<div>");
                    tmDivTitle.addClass("card-content")
                    var tmSpanTitle = $("<span>");
                    tmSpanTitle.addClass("card-title activator grey-text text-darken-4 tm-title")
                    tmSpanTitle.text(eventName);
                    var tmIcon = $("<i>");
                    tmIcon.addClass("material-icons right");
                    tmIcon.text("more_vert");


                    var tmDivInfo = $("<div>");
                    tmDivInfo.addClass("card-reveal");
                    var tmSpanInfo = $("<span>");
                    tmSpanInfo.addClass("card-title grey-text text-darken-4");
                    tmSpanInfo.text(eventDate);

                    var tmIconClose = $("<i>");
                    tmIconClose.addClass("material-icons right");
                    tmIconClose.text("close");

                    var tmPInfo = $("<p>");
                    tmPInfo.addClass("tm-blurb");
                    tmPInfo.text(eventVenue);


                    var tmA1Info = $("<a>");
                    tmA1Info.addClass("btn waves-effect waves-teal align-center tm-ticket-btn");
                    tmA1Info.attr("href", eventLink);
                    tmA1Info.text("FIND TICKETS");

                    var tmA2Info = $("<a>");
                    tmA2Info.addClass("btn waves-effect waves-teal align-center tm-ticket-btn");
                    tmA2Info.attr("href", eventLink);
                    tmA2Info.text("TELL FRIENDS");

                    tmDivImg.append(tmImg);
                    tmSpanTitle.append(tmIcon);
                    tmDivTitle.append(tmSpanTitle);

                    tmSpanInfo.append(tmIconClose);
                    tmDivInfo.append(tmSpanInfo, tmPInfo, tmA1Info, tmA2Info);

                    tmDiv2.append(tmDivImg, tmDivTitle, tmDivInfo);
                    tmDiv1.append(tmDiv2);
                    $("#tm-feed").append(tmDiv1);

                }
            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });
    }
    // ---------------------
    function getWiki() {
        // $.getJSON('https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=' + sizeWiki + '&generator=search&origin=*&gsrsearch=' + cityCode + "+" + stateCode, function (data) {


        // $.getJSON('https://en.wikipedia.org/w/api.php?format=' + format + '&action=' + action + '&generator=' + generator + '&gsrnamespace=' + gsrnamespace + '&gsrlimit=' + sizeWiki + '&prop=' + prop + '&pilimit=' + pilimit + '&exintro&explaintext&exsentences=' + exsentences + '&exlimit=' + exlimit + '&gsrsearch=' + cityCode + "+" + stateCode + '&callback=?', function (data) {

        // Wikipedia Search Word Keys
        var sizeWiki = 3;
        var format = "json";
        var action = "query";
        var generator = "search";
        var gsrnamespace = "0";
        var prop = "titlesnippet|snippet";
        var pilimit = "max";
        var exsentences = "1";
        var exlimit = "max";
        var list = "search";


        $.getJSON('https://en.wikipedia.org/w/api.php?format=' + format + '&action=' + action + '&list=' + list + '&srprop=' + prop + '&srlimit=' + sizeWiki + '&srsearch=' + cityCode + "+" + stateCode + '&callback=?', function (data) {
            console.log(data);
            $(".carousel").empty();
            // Loop to all cards pull form API
            for (var i = 0; i < sizeWiki; i++) {
                var num = numberToWords.toWords(i+1);
                console.log(num);
                
                var wikiPageTitle = data.query.search[i].title;
                console.log(wikiPageTitle);

                var wpDiv1 = $("<div>");
                wpDiv1.addClass("carousel-item ");
                wpDiv1.attr("href", "#"+num+"!");
                var wpDiv2 = $("<div>");
                wpDiv2.addClass("card-content wp-card");
                var wpSpanTitle = $("<span>");
                wpSpanTitle.addClass("card-title activator grey-text text-darken-4 wp-title");
                wpSpanTitle.text(wikiPageTitle);
                var wpDivInfo = $("<div>");
                wpDivInfo.addClass("card-content wp-content");
                var wpPInfo = $("<p>");
                wpPInfo.text('Need to add real data ....Topping cookie brownie. Cheesecake oat cake chocolate cake. Cookie oat cake oat cake tootsie roll. Chocolate cake marshmallow chocolate cookie. Icing jelly-o apple pie cotton candy. Chocolate bear claw bonbon jujubes icing liquorice jelly-o muffin. Topping caramels donut lollipop. Powder cotton candy candy tootsie roll ice cream chocolate chupa chups. Chocolate cake dessert marzipan. Powder tootsie roll pastry. Cotton candy caramels croissant chocolate cake wafer chupa chups marshmallow. Jujubes bear claw sweet jelly tart gummi bears topping tart gummies. Icing liquorice pudding bear claw cheesecake jelly brownie. Wafer pastry marshmallow. Bear claw marzipan fruitcake cupcake candy marzipan. Gummies candy canes pudding sweet jujubes gingerbread fruitcake lemon drops powder. Croissant muffin lemon drops lemon drops toffee tootsie roll. Marshmallow lollipop gummies cake. Cookie cake marzipan candy cupcake chocolate ice cream. Brownie wafer bonbon. Marzipan pudding lemon drops candy canes carrot cake carrot cake cheesecake bonbon. Chupa chups apple pie caramels chocolate bar biscuit muffin toffee. Pastry jelly beans liquorice. Cake jelly beans croissant macaroon muffin gingerbread cake sesame snaps fruitcake. Candy canes apple pie tootsie roll powder cupcake. Chupa chups candy canes marzipan cake carrot cake. Dessert pudding chocolate cake.');
                // var wpDiv3 = $("<div>");
                // wpDiv3.addClass("card-action");
                // var wpA1 = $("<a>");
                // wpA1.attr("href", "#");
                // wpA1.text("READ MORE");

                
                // wpDiv3.append(wpA1);
                wpDivInfo.append(wpPInfo);
                wpDiv2.append(wpSpanTitle);
                wpDiv2.append(wpSpanTitle, wpDivInfo);
                wpDiv1.append(wpDiv2);
                $(".carousel").append(wpDiv1);

            }

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


            console.log("city, state");
            //location = location.replace(/,\s?/g, " ");
            location = location.split(",");

            cityCode = location[0];
            stateCode = location[1];
            // console.log(cityCode);
            // console.log(stateCode);
            InputType = 1;

        } else if (regexp2.test(location)) {
            // console.log("zip");
            zipCode = location;
            InputType = 2;

        }
        findGeo(location);
        findTickets();
        getWiki();
    });
    // ---------------------








    findGeo(location);
    findTickets();
    getWiki();

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

