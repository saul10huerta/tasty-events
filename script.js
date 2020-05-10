var body = document.querySelector("body");
var cityInput = $("#city-input");
var cityEntered = null;
var eventsContainerEl = document.querySelector("#events-container");
var page = 0;
var totalPages = null;
var cityForm = document.querySelector("#city-form");
var eventLat = null;
var eventLon = null;
var cityArray = [];
var savedCityContainerEl = document.querySelector("#save-container");
var divEl = document.querySelector("#restaurants-container");



var loadCity = function () {
    cityArray = JSON.parse(localStorage.getItem("city"));
    if (!cityArray) {
        cityArray = [];
    } 
    else {
        for (var i = 0; i < cityArray.length; i++) {
            var savedCity = document.createElement("p");
            savedCity.setAttribute("id", cityArray[i]);
            savedCity.textContent = cityArray[i];
            savedCityContainerEl.appendChild(savedCity);
        };
    };
};

// clear recent search (local storage)
$("#clear-history").on("click", function() {
    localStorage.clear();
    var child = savedCityContainerEl.lastElementChild;
    while (child) {
        savedCityContainerEl.removeChild(child);
        child = savedCityContainerEl.lastElementChild
    };
    cityArray = [];
});

var saveCity = function () {
    // if array is empty, add city to local storage
    if (cityArray.length === 0) {
        cityArray.push(cityEntered)
        var savedCity = document.createElement("p")
        savedCity.setAttribute("id", cityEntered)
        savedCity.textContent = cityEntered
        savedCityContainerEl.appendChild(savedCity)
        localStorage.setItem("city", JSON.stringify(cityArray))
    }
    // if cityInput matches value in local storage, don't do anything
    else if (checkCity() === true) {
    }
    // if cityInput doesn't match value, add it to local storage
    else {
        cityArray.push(cityEntered)
        var savedCity = document.createElement("p")
        savedCity.setAttribute("id", cityEntered)
        savedCity.textContent = cityEntered
        savedCityContainerEl.appendChild(savedCity)
        localStorage.setItem("city", JSON.stringify(cityArray))
    };
};

// function to check if cityInput matches value in array
var checkCity = function () {
    for (var i = 0; i < cityArray.length; i++) {
        if (cityEntered === cityArray[i]) {
            return true
        };
    };
};

// Form for city
var formSubmitHandler = function () {
    event.preventDefault();
    $("#events-container").empty();
    cityEntered = cityInput.val()
    ticketmaster(cityEntered, 0);
    // saveCity();
};

// Get data from Ticketmaster
var ticketmaster = function (city, pageNumber) {
    fetch("https://app.ticketmaster.com/discovery/v2/events.json?apikey=2umjA6L6GdnhhnFn7dbnGxUBjPWr9bDf&city=" + city + "&sort=date,asc&page=" + pageNumber)
    .then((response) => {
        if (response.ok) {
            return response.json()
            .then((data) => {
                var eventList = data._embedded.events;
                // if there's an invalid respose message when a valid city is entered, remove the message
                if ($("#invalid-response")) {
                    $("#invalid-response").remove();
                };
                // loop for events
                for (var i = 0; i < eventList.length; i++) {  
                    // create elements for event info
                    var eventImg = $("<img>")
                        .addClass("ui large bordered rounded image")
                        .attr("src", eventList[i].images[0].url);
                    var eventName = $("<h4>")
                        .text(eventList[i].name);
                    var eventDateVenue = $("<p>")
                        .text(eventList[i].dates.start.localDate + " | " + eventList[i]._embedded.venues[0].name + " " + eventList[i]._embedded.venues[0].city.name + " " + eventList[i]._embedded.venues[0].state.stateCode);
                    // if the event doesn't have a location get lat and lon from Mapquest API
                    if (!eventList[i]._embedded.venues[0].location) {
                        var eventAddress = eventList[i]._embedded.venues[0].address.line1
                        var eventCity = eventList[i]._embedded.venues[0].city.name
                        var eventState = eventList[i]._embedded.venues[0].state.name
                        fetch("http://open.mapquestapi.com/geocoding/v1/address?key=D6yxIoaQjYKEF0GYIb5DdsdZlv0W5GSM&location=" + eventAddress + "%20" + eventAddress + eventState)
                        .then((response) => {
                            return response.json()
                            .then((data) => {
                                // get lat and lon for the venue of each event and hide it
                                var latSpan = $("<span hidden>")
                                    .addClass("latitude")
                                    .text(data.results[0].locations[0].latLng.lat)
                                var lonSpan = $("<span hidden>")
                                    .addClass("longitude")
                                    .text(data.results[0].locations[0].latLng.lon)
                            });
                        });
                    } else {
                        // get lat and lon for the venue of each event and hide it
                        var latSpan = $("<span hidden>")
                            .addClass("latitude")
                            .text(eventList[i]._embedded.venues[0].location.latitude);
                        var lonSpan = $("<span hidden>")
                            .addClass("longitude")
                            .text(eventList[i]._embedded.venues[0].location.longitude)
                    };
                    // add button to find nearby food
                    var foodBtn = $("<button>")
                        .addClass("food-button")
                        .text("Nearby Food")
                    // create container for event info
                    var subEvent1 = $("<div>")
                        .addClass("center aligned column")
                        .append(eventName, eventDateVenue, latSpan, lonSpan, foodBtn);
                    var subEvent2 = $("<div>")
                        .addClass("center aligned column")
                        .append(eventImg);
                    var event = $("<div>")
                        .addClass("two column row")
                        .append(subEvent1,subEvent2);    
                    // append event containter to events container
                    $(eventsContainerEl).append(event);
                };
                // when certain food button is clicked, look at the parent to find specific lat and lon of venue
                $(".food-button").click(function () {
                    eventLat = $(this).parent().find(".latitude").text()
                    eventLon = $(this).parent().find(".longitude").text()
                    $("#restaurants-container").empty();
                    displayZomato();
                    $("#food-modal").modal("show");
                })
                // grabs page total from API and assigns it to totalPages to be used outside of function
                totalPages = data.page.totalPages
                saveCity();
            });
        };
    })
    // if an invalid city is entered, display message 
    .catch(function(error) {
        var invalidResponse = $("<p>")
            .attr("id", "invalid-response")
            .text("Your search was invalid. Please enter a valid city.");
        $("#form-container").append(invalidResponse);
    });
};

// load more button click
$("#load-more").click(function() {
    // adds 1 to page number and runs ticketmaster function with the next page number which loads underneath current page
    page++;
    ticketmaster(cityEntered, page);
    // removes the load more button on the last page
    if(page === totalPages-1) {
        $("#load-more").remove();
    };
});

// divEl = document.querySelector("#restaurants-container");

var displayZomato = function() {
    var key = "82359ff64f3766634a1dab8ede2ba7d9";
    var apiURL = "https://developers.zomato.com/api/v2.1/geocode?apikey=" + key + "&lat=" + eventLat + "&lon=" + eventLon;

    fetch(apiURL)
    .then((response) => {
        return response.json()        
        .then((data) => {
            for(let i = 0; i < data.nearby_restaurants.length; i++) {
                var restName = data.nearby_restaurants[i].restaurant.name;
                var restLocation = data.nearby_restaurants[i].restaurant.location.address;
                var restCuisine = data.nearby_restaurants[i].restaurant.cuisines
                var restCost = data.nearby_restaurants[i].restaurant.average_cost_for_two;
                var restAggregateRating = data.nearby_restaurants[i].restaurant.user_rating.aggregate_rating;
                var restImg = data.nearby_restaurants[i].restaurant.featured_image
                // create a modal to hold restaurants info
                var restaurantsNameEl = document.createElement("h3");
                restaurantsNameEl.className =" ";
                restaurantsNameEl.id = "";
                restaurantsNameEl.textContent = restName;
                divEl.appendChild(restaurantsNameEl);

                var restCuisineEl = document.createElement("p");
                restCuisineEl.className =" ";
                restCuisineEl.id = "";
                restCuisineEl.textContent = "Cuisine: " + restCuisine;
                divEl.appendChild(restCuisineEl);

                var restCostEl = document.createElement("p");
                restCostEl.className =" ";
                restCostEl.id = "";
                restCostEl.textContent = "Average cost for two people: $" + restCost;
                divEl.appendChild(restCostEl);

                var ratingEl = document.createElement("p");
                ratingEl.className =" ";
                ratingEl.id = "";
                ratingEl.textContent = "Restaurant Rating: " + restAggregateRating;
                divEl.appendChild(ratingEl);

                var restLocationEl = document.createElement("p");
                restLocationEl.className =" ";
                restLocationEl.id = "";
                restLocationEl.textContent = "Address: " + restLocation;
                divEl.appendChild(restLocationEl);

                var imgEl = document.createElement("img");
                imgEl.className = "ui large bordered rounded image"
                imgEl.id = "";
                imgEl.src = restImg;
                divEl.appendChild(imgEl);
            };   
        });
    });    
};

// click on saved city name load city weather
$("#save-container").on("click", "p", function () {
    var text = $(this)
        .text()
        .trim();
    cityInput.val(text);
    formSubmitHandler();
});

loadCity();
// when city is submitted run form submit handler
cityForm.addEventListener("submit", formSubmitHandler);