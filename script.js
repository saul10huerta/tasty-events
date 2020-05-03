divEl = document.querySelector("#restaurants-container");

var key = "82359ff64f3766634a1dab8ede2ba7d9";

var lat = "30.2672";
var lon = "-97.7431"

var apiURL = "https://developers.zomato.com/api/v2.1/geocode?apikey=" + key + "&lat=" + lat + "&lon=" + lon;

fetch(apiURL)
.then((response) => {
  return response.json();
})
.then((data) => {
  displayZomato(data);
  console.log(data);
});


// function to display Zomato Restautant Data based on location with lat & lon
// restaurant name, restaurant location, cuisine, cost,aggregate rating, featured-img

var displayZomato = function(data) {


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
  

}
