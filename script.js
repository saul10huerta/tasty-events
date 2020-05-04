var body = document.querySelector("body");
var cityInput = null;
var eventsContainerEl = document.querySelector("#events-container");
var page = 0;
var totalPages = null;
var cityForm = document.querySelector("#city-form");

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
                    .append(eventImg, eventName, eventDateVenue);
                // create elements for event info
                var eventImg = $("<img>")
                    .attr("src", eventList[i].images[0].url);
                var eventName = $("<h4>")
                    .text(eventList[i].name);
                var eventDateVenue = $("<p>")
                    .text("Date: " + eventList[i].dates.start.localDate + " | " + eventList[i]._embedded.venues[0].name + eventList[i]._embedded.venues[0].city.name + eventList[i]._embedded.venues[0].state.stateCode);
                // append event containter to events container
                $(eventsContainerEl).append(event);
            };
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

