// This is API key for Open Weather Map.
// var APIKey = "4e468aa89195ad77b602b51a3d8f8672";

var city = "Leawood";
// Here we are building the URL we need to query the database
var queryURL =
  "https://api.openweathermap.org/data/2.5/find?q=" +
  city +
  "&units=imperial&appid=4e468aa89195ad77b602b51a3d8f8672";
console.log(queryURL);
console.log(city);

// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  console.log(response);

  //City Name
  var cityName = $("<h3><strong>").text(response.list[0].name);

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

  var latitude = response.list[0].coord.lat;
  var longitude = response.list[0].coord.lon;
  fiveDay(latitude, longitude);
  console.log("lon" + response.list[0].coord.lon);

  $("#citySummary").append(cityName, temp, humidity, windSpeed);
});

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
    var uvi = $("<p>").text("UVI: " + response5Day.current.uvi);
    $("#citySummary").append(uvi);

    //5 days data will be render from here
    for (i = 1; i < 6; i++) {
      var fiveDate = response5Day.daily[1].dt + moment().format("MM/DD/YYYY");

      var fiveIcon = $("<p>").append(
        '<img src="http://openweathermap.org/img/wn/' +
          response5Day.daily[1].weather[0].icon +
          '.png" />'
      );

      var fiveTemp = $("<p>").text(
        "Temp: " + response5Day.daily[1].temp.day + " °F"
      );

      var fiveHumidity = $("<p>").text(
        "Humidity: " + response5Day.daily[1].humidity + "%"
      );

      $("#fiveDaySum").append(fiveDate, fiveIcon, fiveTemp, fiveHumidity);
    }
  });
}
