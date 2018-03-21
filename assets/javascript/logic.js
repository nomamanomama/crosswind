// xplor

var wikiPageTitle1;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDjc4tJqAYyrcIUGQUrKHEuRnHBEMbEZEI",
    authDomain: "xplor-f51f6.firebaseapp.com",
    databaseURL: "https://xplor-f51f6.firebaseio.com",
    projectId: "xplor-f51f6",
    storageBucket: "xplor-f51f6.appspot.com",
    messagingSenderId: "337857743907"
};
firebase.initializeApp(config);

// create a variable for the Firebase database
var db = firebase.database();
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

//Login configuration options
var uiConfig = {
    callbacks: {
        signInSuccess: function (currentUser, credential, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'http://127.0.0.1:5500/index.html',
    signInOptions: [
        // providers available for signin
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

$(function () {
    console.log("hello world");
    // ---------------------
    // Global Variables
    var InputType = 1;
    // Ticket Master Search Word Keys  
    var cityCode = "New York";
    var stateCode = "NY";
    var zipCode;
    var size = 8;
    var countryCode = "US"; //Can be removed if desired
    var ticketmaster_queryURL;
    var tmIsScrolling = false;

    // ---------------------
    //open modals with trigger
    $('.modal').modal();

    //get the community pinned map markers from database
    populateCommunityMarkers();

    // this makes the side bar open in mobile view
    $(".button-collapse").sideNav();

    //bind left-scroll button to animation
    $("#left-scroll").bind("mousedown", function () {
        $("#tm-feed").animate({ scrollLeft: $("#tm-feed").scrollLeft() - 300 }, 500);
        return false;
    });

    //bind right-scroll button to animation
    $("#right-scroll").bind("mousedown", function () {
        $("#tm-feed").animate({ scrollLeft: $("#tm-feed").scrollLeft() + 300 }, 500);
        return false;
    });







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
        // Wikipedia Search Word Keys
        // https://www.mediawiki.org/wiki/API:Search
        var sizeWiki = 6;
        var format = "json";
        var action = "query";
        var generator = "search";
        var gsrnamespace = "0";
        var prop = "titlesnippet|snippet";
        var srwhat = "text"
        var pilimit = "max";
        var exsentences = "1";
        var exlimit = "max";
        var list = "search";
        console.log(cityCode, stateCode);

        $.getJSON('https://en.wikipedia.org/w/api.php?format=' + format + '&action=' + action + '&list=' + list + '&srprop=' + prop + '&srlimit=' + sizeWiki + '&srsearch=' + cityCode + "+" + stateCode + '&callback=?', function (data) {
            console.log(data);
            wikiPageTitle1 = data.query.search[0].title;
            console.log(data.query.search[0].title);
            $(".carousel").empty();
            $(".carousel").removeClass("initialized");
            // Loop to add all cards data pulled from API
            for (var i = 0; i < sizeWiki; i++) {
                var n = i + 1;
                var num = numberToWords.toWords(n);
                // console.log(num);

                var wikiPageTitle = data.query.search[i].title;

                var wikiPageSnippet = data.query.search[i].snippet;
                // console.log(wikiPageTitle);
                // console.log(wikiPageSnippet);
                // Loop to all cards pull form API
            }


        }).then(function () {





            $.ajax({
                type: "GET",
                url: 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + wikiPageTitle1 + '&callback=?',
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    console.log(data);

                    console.log(wikiPageTitle1);

                    var markup = data.parse.text["*"];
                    var blurb = $('<div>').html(markup);

                    // remove links as they will not work
                    blurb.find('a').each(function () { $(this).replaceWith($(this).html()); });

                    // remove any references
                    blurb.find('sup').remove();

                    // remove cite error
                    blurb.find('.mw-ext-cite-error').remove();
                    $('#wp-feed').html($(blurb).find('p'));
                    // console.log(blurb);

                    //     var wpDiv1 = $("<div>");
                    //     wpDiv1.addClass("card z-depth-2 ");
                    //     var wpDiv2 = $("<div>");
                    //     wpDiv2.addClass("card-content");
                    //     var wpSpanTitle = $("<span>");
                    //     wpSpanTitle.addClass("card-title activator grey-text text-darken-4");
                    //     wpSpanTitle.text(wikiPageTitle);
                    //     var wpDivInfo = $("<div>");
                    //     wpDivInfo.addClass("card-content");
                    //     var wpPInfo = $("<p>");
                    //     wpPInfo.html(wikiPageSnippet);
                    //     var wpDiv3 = $("<div>");
                    //     wpDiv3.addClass("card-action");
                    //     var wpA1 = $("<a>");
                    //     wpA1.attr("href", "#");
                    //     wpA1.text("READ MORE");
                    //     wpDiv3.append(wpA1);
                    //     wpDivInfo.append(wpPInfo);
                    //     wpDiv2.append(wpSpanTitle);
                    //     wpDiv2.append(wpSpanTitle, wpDivInfo, wpDiv3);
                    //     wpDiv1.append(wpDiv2);
                    //     $("#wp-feed").append(wpDiv1);

                    //     $("#wp-feed").append(wpDiv1);

                },
                error: function (errorMessage) {
                }
            });
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
        findGeo(cityCode + "," + stateCode);
        findTickets();
        getWiki();
    });
    // ---------------------


    $("#addMarker").on("click", function () {
        console.log("add a marker");

        var lat = gm_marker.getPosition().lat();
        var lng = gm_marker.getPosition().lng();
        //update db storage with new marker position
        addCommunityMarker(lat, lng);

    });





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
            //check length of response results
            if (response.results.length !== 0) {
                gm_geoLat = response.results[0].geometry.location.lat;
                gm_geoLng = response.results[0].geometry.location.lng;

                console.log("Location: " + gm_geoLat, ", " + gm_geoLng);
                updatePosition();
            }
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
    if (gm_markers.indexOf(latLng) === -1)
        gm_markers.push(latLng);

    db.ref().once("value", function (snapshot) {
        var markers = [];
        if (snapshot.val()) {
            if (snapshot.val().community) {
                markers = JSON.parse(snapshot.val().community);
            }
            //check if position is already in community board
            if (markers.indexOf(latLng) === -1) {
                //it was not in the list so push to the local array
                markers.push(latLng);
                //update the database key with a stringified array
                db.ref().update({ 'community': JSON.stringify(markers) });
            }
        }
    });
}

//get existing favorites from database community key
function populateCommunityMarkers() {

    //on initial load with gm_markers array empty, fill the array with community saved pins
    if (gm_markers.length === 0) {
        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
            url: './assets/images/windsock.png',
            // This marker is 32 pixels wide by 32 pixels high.
            size: new google.maps.Size(50, 50),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (16, 32).
            anchor: new google.maps.Point(25, 50)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
            coords: [17,4,48,1,48,5,23,15,25,48,1,49,1,16,17,4],
            type: 'poly'
        };
        //get a snapshot of the database 
        db.ref().once("value", function (snapshot) {
            if (snapshot.val().community) {
                gm_markers = JSON.parse(snapshot.val().community);
                //create google markers to display in community map
                gm_markers.forEach(element => {
                    var latLng = element.split(",");
                    var pos = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]));
                    var marker = new google.maps.Marker({
                        position: (pos),
                        map: gm_map,
                        icon: image,
                        shape: shape
                    });
                });
            }
        });
    }
}
