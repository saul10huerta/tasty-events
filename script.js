var body = document.querySelector("body");
var cityInput = null;
var eventsContainerEl = document.querySelector("#events-container");
var page = 0;
var totalPages = null;
var cityForm = document.querySelector("#city-form");
var eventLat = null;
var eventLon = null;

// Form for city
var formSubmitHandler = function () {
    event.preventDefault();
    $("#events-container").empty();
    cityInput = $("#city-input").val();
    ticketmaster(cityInput, 0);
}

// Get data from Ticketmaster
var ticketmaster = function (city, pageNumber) {
    fetch("https://app.ticketmaster.com/discovery/v2/events.json?apikey=2umjA6L6GdnhhnFn7dbnGxUBjPWr9bDf&city=" + city + "&sort=date,asc&page=" + pageNumber)
    .then((response) => {
        return response.json()
        .then((data) => {
            var eventList = data._embedded.events;
            // loop for events
            for (var i = 0; i < eventList.length; i++) {                 
                // create container for event info
                var event = $("<div>")
                    .append(eventImg, eventName, eventDateVenue, latSpan, lonSpan, foodBtn);
                // create elements for event info
                var eventImg = $("<img>")
                    .attr("src", eventList[i].images[0].url);
                var eventName = $("<h4>")
                    .text(eventList[i].name);
                var eventDateVenue = $("<p>")
                    .text("Date: " + eventList[i].dates.start.localDate + " | " + eventList[i]._embedded.venues[0].name + eventList[i]._embedded.venues[0].city.name + eventList[i]._embedded.venues[0].state.stateCode);
                // get lat and lon for the venue of each event and hide it
                // if the event doesn't have a location get lat and lon from Mapquest API
                if (!eventList[i]._embedded.venues[0].location) {
                    var eventAddress = eventList[i]._embedded.venues[0].address.line1
                    var eventCity = eventList[i]._embedded.venues[0].city.name
                    var eventState = eventList[i]._embedded.venues[0].state.name
                    fetch("http://open.mapquestapi.com/geocoding/v1/address?key=D6yxIoaQjYKEF0GYIb5DdsdZlv0W5GSM&location=" + eventAddress + "%20" + eventAddress + eventState)
                    .then((response) => {
                        return response.json()
                        .then((data) => {
                            // console.log(data.results[0].locations[0].latLng)
                            var latSpan = $("<span hidden>")
                                .addClass("latitude")
                                .text(data.results[0].locations[0].latLng.lat)
                            var lonSpan = $("<span hidden>")
                                .addClass("longitude")
                                .text(data.results[0].locations[0].latLng.lon)
                        });
                    })
                } else {
                    var latSpan = $("<span hidden>")
                        .addClass("latitude")
                        .text(eventList[i]._embedded.venues[0].location.latitude);
                    var lonSpan = $("<span hidden>")
                        .addClass("longitude")
                        .text(eventList[i]._embedded.venues[0].location.longitude)
                };
                var foodBtn = $("<button>")
                    .addClass("food-button")
                    .text("Nearby Food")
                // append event containter to events container
                $(eventsContainerEl).append(event);
            };
            // when certain button is clicked, look at the parent to find specific lat and lon of venue
            $(".food-button").click(function () {
                eventLat = $(this).parent().find(".latitude").text()
                eventLon = $(this).parent().find(".longitude").text()
                $("#restaurants-container").empty();
                displayZomato();
                $("#food-modal").modal("show");
                
            })
            // grabs page total from API and assigns it to totalPages to be used outside of function
            totalPages = data.page.totalPages
            // return totalPages
        });
    });
};

// load more button click
$("#load-more").click(function() {
    // adds 1 to page number and runs ticketmaster function with the next page number which loads underneath current page
    page++
    ticketmaster("Austin", page);
    // removes the load more button on the last page
    if(page === totalPages-1) {
        $("#load-more").remove()
    };
});

// when city is submitted run form submit handler
cityForm.addEventListener("submit", formSubmitHandler);

divEl = document.querySelector("#restaurants-container");

var key = "82359ff64f3766634a1dab8ede2ba7d9";

var lat = "30.2672";
var lon = "-97.7431"

// var apiURL = "https://developers.zomato.com/api/v2.1/geocode?apikey=" + key + "&lat=" + eventLat + "&lon=" + eventLon;

// fetch(apiURL)
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
// //   displayZomato(data);
//   console.log(data);
// });


// function to display Zomato Restautant Data based on location with lat & lon
// restaurant name, restaurant location, cuisine, cost,aggregate rating, featured-img

var displayZomato = function() {
    var apiURL = "https://developers.zomato.com/api/v2.1/geocode?apikey=" + key + "&lat=" + eventLat + "&lon=" + eventLon;

    fetch(apiURL)
    .then((response) => {
    return response.json();
    })
    .then((data) => {
    //   displayZomato(data);
    console.log(data);
   


  for(let i = 0; i < data.nearby_restaurants.length; i++) {

    var restName = data.nearby_restaurants[i].restaurant.name;
    var restLocation = data.nearby_restaurants[i].restaurant.location.address;
    var restCuisine = data.nearby_restaurants[i].restaurant.cuisines
    var restCost = data.nearby_restaurants[i].restaurant.average_cost_for_two;
    var restAggregateRating = data.nearby_restaurants[i].restaurant.user_rating.aggregate_rating;
    var restImg = data.nearby_restaurants[i].restaurant.featured_image

    console.log(restName,restCuisine,restCost,restAggregateRating,restLocation,restImg);

    // create a modal to hold restaurants info
    var restaurantsNameEl = document.createElement("p");
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
    imgEl.id = "";
    imgEl.src = restImg;
    divEl.appendChild(imgEl);

  }
    
    });

}
