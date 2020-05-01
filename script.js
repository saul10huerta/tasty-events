var city = "Austin";
var eventsContainerEl = document.querySelector("#events-container");
var eventArray = []

// Get data from Ticketmaster
var ticketmaster = function (city) {
    fetch("https://app.ticketmaster.com/discovery/v2/events.json?apikey=2umjA6L6GdnhhnFn7dbnGxUBjPWr9bDf&city=Austin&sort=date,asc")
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

        });
    });
};

ticketmaster();


