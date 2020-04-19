// This is API key for Open Weather Map.
// APIKey = "4e468aa89195ad77b602b51a3d8f8672";

// var citySearch;
var navCity = [];
var lastCity = localStorage.getItem("lastCity");

if (lastCity != null) {
  citySummary(lastCity);
}

if (localStorage.getItem("leftNav") != null) {
  navCity = JSON.parse(localStorage.getItem("leftNav"));
  //console.log("from local storage: " + navCity);
}

// declared function to get city when click on Search button
var city;
$("#submitCity").on("click", function () {
  city = $("#citySearchBox").val().trim();
  //calling citySummary function
  citySummary(city);
  console.log(city);
});

// declared function to get city when hit enter key
$("#input-form").on("submit", function () {
  event.preventDefault();
  city = $("#citySearchBox").val().trim();
  //calling citySummary function
  citySummary(city);
  console.log(city);
});

function citySummary(city) {
  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/find?q=" +
    city +
    "&units=imperial&appid=4e468aa89195ad77b602b51a3d8f8672";
  console.log(queryURL);
  //console.log(city);

  // We then created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    lastCity = response.list[0].name;
    localStorage.setItem("lastCity", lastCity);
    //console.log(localStorage);
    $("#citySummary").empty();

    var latitude = response.list[0].coord.lat;
    var longitude = response.list[0].coord.lon;
    fiveDay(latitude, longitude);

    //if array does not include last city then add it
    if (!navCity.includes(lastCity)) {
      navCity.push(lastCity);
    }

    localStorage.setItem("leftNav", JSON.stringify(navCity));

    //call for addNav function
    addNav();

    //City Name
    var cityName = $("<h3><strong>").text(lastCity);

    //Current Date
    $(cityName).append(" (" + moment().format("MM/DD/YYYY") + ")");

    //Image
    $(cityName).append(
      '<img src="http://openweathermap.org/img/wn/' +
        response.list[0].weather[0].icon +
        '.png" />'
    );

    var temp = $("<br><p>").text(
      "Temperature: " + response.list[0].main.temp + " °F"
    );
    var humidity = $("<p>").text(
      "Humidity: " + response.list[0].main.humidity + "%"
    );
    var windSpeed = $("<p>").text(
      "Wind Speed: " + response.list[0].wind.speed + " MPH"
    );

    console.log("lon" + response.list[0].coord.lon);

    $("#citySummary").append(cityName, temp, humidity, windSpeed);
  });
}

function fiveDay(lat, lon) {
  var queryURL5Day =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=4e468aa89195ad77b602b51a3d8f8672";

  $.ajax({
    url: queryURL5Day,
    method: "GET",
  }).then(function (response5Day) {
    console.log(response5Day);

    $("#fiveDaySum").empty();

    var uvi = $("<p>").text("UVI: " + response5Day.current.uvi);
    $("#citySummary").append(uvi);

    //for loop to display data for 5 days

    for (i = 1; i < 6; i++) {
      //declared var for date and converting unix format to mm/dd/yy

      var fiveDate = $('<td class="px-2"> <p>').text(
        moment.unix(response5Day.daily[i].dt).format("MM/DD/YYYY")
      );
      //declared var for weather icon
      var fiveIcon = $("<p>").append(
        '<img src="http://openweathermap.org/img/wn/' +
          response5Day.daily[i].weather[0].icon +
          '.png" />'
      );
      //declared var for temperature
      var fiveTemp = $("<p>").text(
        "Temp: " + response5Day.daily[i].temp.day + " °F"
      );
      //declared var for humidity
      var fiveHumidity = $("<p>").text(
        "Humidity: " + response5Day.daily[i].humidity + "%"
      );
      //
      $(fiveDate).append("<p>", fiveIcon, fiveTemp, fiveHumidity);
      //display using .append five day data
      $("#fiveDaySum").append(fiveDate);
    }
  });
}

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
      console.log(citySearch);
      citySummary(citySearch);
    });
  }
}
