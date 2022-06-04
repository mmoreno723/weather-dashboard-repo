var today = moment();
$("#date").text(today.format("MM/D/YYYY"));

var searchBtn = document.getElementById("searchBtn");
var historyBtn = document.getElementById("historyBtn");
var currentTemp = document.getElementById("currentCityTemp");
var currentFeels = document.getElementById("currentCityFeels");
var currentWind = document.getElementById("currentCityWind");
var currentHum = document.getElementById("currentCityHum");
var currentUV = document.getElementById("currentCityUV");

$("#fiveDays").text("");

function getCurrentApi() {
  var search = document.getElementById("searchCity");
  var requestUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    search.value +
    `&units=imperial&appid=6db1fa369ae9cc9c6649966d9a9904bd`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var cityTemp = data.main.temp;
      var cityFeels = data.main.feels_like;
      var cityWind = data.wind.speed;
      var cityHum = data.main.humidity;
      var icon = data.weather[0].icon;
      var iconLink = `https://openweathermap.org/img/wn/${icon}.png`;
      $("#icon").attr("src", `${iconLink}`);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var uviUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly&units=imperial&appid=6db1fa369ae9cc9c6649966d9a9904bd";
      $("#historyBtn").append(
        `<a class="btn btn-dark" id="searchResult"> ${search.value} </a>`
      );

      $("#currentCity").text(search.value);
      $("#currentCityTemp").text(cityTemp + " °F");
      $("#currentCityFeels").text(cityFeels + " °F");
      $("#currentCityWind").text(cityWind + " MPH");
      $("#currentCityHum").text(cityHum + " %");

      fetch(uviUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var uvIndex = data.current.uvi;
          if (uvIndex < 4) {
            $("#uvi").attr("style", "background-color: lightgreen");
          } else if (uvIndex < 8) {
            $("#uvi").attr("style", "background-color: yellow");
          } else {
            $("#uvi").attr("style", "background-color: lightred");
          }
          $("#uvi").text(uvIndex);

          $("h4").text("5-Day Forecast");
          currentWeatherInfo = {
            temp: "Temp: " + cityTemp,
            feels: "Feels Like: " + cityFeels,
            wind: "Wind: " + cityWind,
            humidity: "Humidity: " + cityHum,
            ultraVIndex: "UV Index: " + uvIndex,
          };
          function renderLastRegistered() {
            var cityDisplay = localStorage.getItem("currentCity");

            if (!cityDisplay) {
              return;
            }
            localStorage.setItem(
              search.value,
              JSON.stringify(currentWeatherInfo)
            );
          }
          renderLastRegistered();
          search.value = "";
          function renderFiveDays() {
            for (var i = 0; i < 5; i++) {
              var forecastIcon = data.daily[i].weather[0].icon;
              $("#fiveDays").append(
                "<div class='p-2' id='forecast-card'>" +
                  "<p>" +
                  moment()
                    .add(i + 1, "days")
                    .format("MM/D/YYYY") +
                  "<p>" +
                  `<img src="https://openweathermap.org/img/wn/${forecastIcon}.png">` +
                  "<p>" +
                  "Temperature: " +
                  data.daily[i].temp.day +
                  " F" +
                  "</p>" +
                  "<p>" +
                  "Wind: " +
                  data.daily[i].wind_speed +
                  " MPH" +
                  "</p>" +
                  "<p>" +
                  "Humidity: " +
                  data.daily[i].humidity +
                  "%" +
                  "</p>" +
                  "</div>"
              );
            }
            var cityFiveDisplay = localStorage.getItem("currentCity");

            if (!cityFiveDisplay) {
              return;
            }
            localStorage.setItem(
              search.value,
              JSON.stringify(currentWeatherInfo)
            );
          }
          renderFiveDays();
          search.value = "";
        });
    });
}

searchBtn.addEventListener("click", getCurrentApi);
