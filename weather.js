// This is API key for Open Weather Map.
// APIKey = "4e468aa89195ad77b602b51a3d8f8672";

// var citySearch;
var navCity = [];
var lastCity = localStorage.getItem("lastCity");

//checking which last city was searched and rendering data for that city
if (lastCity != null) {
  citySummary(lastCity);
}

//checking if local storage has any cities saved
if (localStorage.getItem("leftNav") != null) {
  navCity = JSON.parse(localStorage.getItem("leftNav"));
}

// declared function to get city when click on Search button
var city;
$("#submitCity").on("click", function () {
  city = $("#citySearchBox").val().trim();
  //calling citySummary function to populate the weather data for search city
  citySummary(city);
});

//executing the weather API and retrieving current day weather data for the city passed as parameter
function citySummary(city) {
  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/find?q=" +
    city +
    "&units=imperial&appid=4e468aa89195ad77b602b51a3d8f8672";

  // calling the weather API in this section
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    lastCity = response.list[0].name;
    localStorage.setItem("lastCity", lastCity);
    $("#citySummary").empty();

    //declare the var for latitude and longitude which will be used for next API call to retrieve 5 day weather data
    var latitude = response.list[0].coord.lat;
    var longitude = response.list[0].coord.lon;
    //calling five day weather data function
    fiveDay(latitude, longitude);

    //if array does not include last city then add it
    if (!navCity.includes(lastCity)) {
      navCity.push(lastCity);
    }
    //saving the searched cities in the local storage
    localStorage.setItem("leftNav", JSON.stringify(navCity));
    //call for addNav function to build the previously searched city list on left nav
    addNav();
    //rendering city name
    var cityName = $("<h3><strong>").text(lastCity);

    //rendering current Date
    $(cityName).append(" (" + moment().format("MM/DD/YYYY") + ")");

    //rendering weather icon
    $(cityName).append(
      '<img src="https://openweathermap.org/img/wn/' +
        response.list[0].weather[0].icon +
        '.png" />'
    );
    //rendering temperature
    var temp = $("<br><p>").text(
      "Temperature: " + response.list[0].main.temp + " °F"
    );
    //rendering humidity
    var humidity = $("<p>").text(
      "Humidity: " + response.list[0].main.humidity + "%"
    );
    //rendering wind speed
    var windSpeed = $("<p>").text(
      "Wind Speed: " + response.list[0].wind.speed + " MPH"
    );
    //displaying all collected weather data
    $("#citySummary").append(cityName, temp, humidity, windSpeed);
  });
}

//calling "One Call API" to build and retrieve 5 day weather data based on the latitude and longitude passed as parameter
function fiveDay(lat, lon) {
  var queryURL5Day =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=4e468aa89195ad77b602b51a3d8f8672";
  // calling the weather API in this section
  $.ajax({
    url: queryURL5Day,
    method: "GET",
  }).then(function (response5Day) {
    $("#fiveDaySum").empty();
    var uvi = $("<p>").text("UVI: " + response5Day.current.uvi);
    $("#citySummary").append(uvi);

    //for loop to display data for 5 days
    for (i = 1; i < 6; i++) {
      //var for date and converting unix format to mm/dd/yy
      var fiveDate = $('<td class="px-2"> <p>').text(
        moment.unix(response5Day.daily[i].dt).format("MM/DD/YYYY")
      );
      // var for weather icon
      var fiveIcon = $("<p>").append(
        '<img src="https://openweathermap.org/img/wn/' +
          response5Day.daily[i].weather[0].icon +
          '.png" />'
      );
      //var for temperature
      var fiveTemp = $("<p>").text(
        "Temp: " + response5Day.daily[i].temp.day + " °F"
      );
      //var for humidity
      var fiveHumidity = $("<p>").text(
        "Humidity: " + response5Day.daily[i].humidity + "%"
      );
      //
      $(fiveDate).append("<p>", fiveIcon, fiveTemp, fiveHumidity);
      //display five day data
      $("#fiveDaySum").append(fiveDate);
    }
  });
}

//searched city being displayed on left nav
function addNav() {
  $("#citySearch").empty();
  for (var i = 0; i < navCity.length; i++) {
    var navItem = $("<button>").addClass(
      "btn btn-outline-secondary btn-md btn-block"
    );
    navItem.attr("id", "navButton");
    navItem.attr("value", navCity[i]);
    navItem.text(navCity[i]);
    $("#citySearch").prepend(navItem);

    $("#navButton").on("click", function () {
      var citySearch = $(this).val();
      citySummary(citySearch);
    });
  }
}
