var today = moment().format("M/D/YYYY");
var searchForm = $("#search-form");
var weatherDisplayEl = $("#weather-container");
var citySearchReq = $("#city-search-request");
var forecastDisplayEl = $("#forecast");
var prevCities = [];
var savedCitiesEl = $("#saved-cities");

var citySubmitHandler = function (event) {
  event.preventDefault();
  $("#weather-container").empty();
  $("#forecast").empty();

  var city = citySearchReq.val();

  if (city) {
    getWeather(city);
    getForecast(city);

    citySearchReq.value = "";
  } else {
    alert("Please enter a city");
  }
  saveCities(city);
};

var getWeather = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=c963db2b8ba8a668e63b8a7bd1313865";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect weather app");
    });
};
var getForecast = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=c963db2b8ba8a668e63b8a7bd1313865";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayForecast(data.list, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect weather app");
    });
};

var displayWeather = function (weather, citySearch) {
  citySearchReq.textContent = citySearch;
  var city = weather.name;
  document.querySelector("#current-city").innerHTML = city + " (" + today + ")";
  var currentWeather = document.createElement("div");
  currentWeather.classlist = "card weatherEl";
  var iconImg = document.createElement("img");
  iconImg.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  var temp = document.createElement("p");
  temp.innerHTML = "Temp: " + weather.main.temp + "°F";
  var wind = document.createElement("p");
  wind.innerHTML = "Wind: " + weather.wind.speed + "mph";
  var humidity = document.createElement("p");
  humidity.innerHTML = "Humidity: " + weather.main.humidity + "%";

  $("#current-city").append(iconImg);
  currentWeather.append(temp);
  currentWeather.append(wind);
  currentWeather.append(humidity);
  weatherDisplayEl.append(currentWeather);
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  uvIndexGet(lat, lon);
};

var displayForecast = function (weather, citySearch) {
  if (weather.length === 0) {
    repoContainerEl.textContent = "nope";
    return;
  }

  citySearchReq.textContent = citySearch;

  for (var i = 0; i < weather.length; i++) {
    if (weather[i].dt_txt.indexOf("21:00:00") !== -1) {
      var forecastEl = document.createElement("div");
      forecastEl.classList =
        "card forecast-card col m-1 justify-space-between flex-direction-row";

      var dateEl = document.createElement("p");
      dateEl.classList = "list-item align-center";
      dateEl.innerHTML = moment(
        weather[i].dt_txt,
        "YYYY-MM-DD, hh:mm:ss"
      ).format("MM/DD/YYYY");
      var iconEl = document.createElement("img");
      iconEl.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weather[i].weather[0].icon}@2x.png`
      );
      var tempEl = document.createElement("p");
      tempEl.classList = "list-item align-center";
      tempEl.innerHTML = "Temp: " + weather[i].main.temp + "°F";
      var windEl = document.createElement("p");
      windEl.classList = "list-item flex-column align-center";
      windEl.innerHTML = "Wind: " + weather[i].wind.speed + "mph";
      var humidityEl = document.createElement("p");
      humidityEl.classList = "list-item align-center";
      humidityEl.innerHTML = "Humidity: " + weather[i].main.humidity + "%";

      forecastEl.appendChild(dateEl);
      forecastEl.appendChild(iconEl);
      forecastEl.appendChild(tempEl);
      forecastEl.appendChild(windEl);
      forecastEl.appendChild(humidityEl);

      forecastDisplayEl.append(forecastEl);
    }
  }
};
var uvIndexGet = function (lat, lon) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/uvi?&appid=c963db2b8ba8a668e63b8a7bd1313865&lat=" +
    lat +
    "&lon=" +
    lon;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUV(data.value);
    });
  });
};
var displayUV = function (index) {
  var indexEl = document.createElement("div");
  var uvIndex = document.createElement("p");
  uvIndex.innerHTML = "UV Index: " + index;
  indexEl.appendChild(uvIndex);
  weatherDisplayEl.append(indexEl);
  if (index <= 3) {
    uvIndex.setAttribute("style", "background-color: green");
  } else if (index > 3 && index <= 8) {
    uvIndex.setAttribute("style", "background-color: yellow");
  } else if (index > 8) {
    uvIndex.setAttribute("style", "background-color: red");
    return
  } 

};
var searchPrevCity = function (event) {
  $("#weather-container").empty();
  $("#forecast").empty();
  var cityButton = $(event.target).text();
  getWeather(cityButton);
  getForecast(cityButton);
};

var saveCities = function (city) {
  prevCities.push(city);
  var prevCity = $("<button>");
  prevCity.text(city);
  prevCity.addClass("w-100 btn-light current-city");
  prevCity.attr("type", "submit");

  savedCitiesEl.append(prevCity);
  localStorage.setItem("city", JSON.stringify(prevCities));
};
var renderSavedCities = function () {
  for (var i = 0; i < prevCities.length; i++) {
    if (prevCities[i]) {
      prevCities[i] = $("<button>");
      prevCities[i].text(city);
      prevCities[i].addClass("w-100 btn-light current-city");
      prevCities[i].attr("type", "submit");
      savedCitiesEl.append(prevCities);
    }
  }
};
function init() {
  var prevSearches = JSON.parse(localStorage.getItem("prevCities"));
  if (prevSearches !== null) {
    prevCities = prevSearches;
  }

  renderSavedCities();
}
init();
$("#search-btn").on("click", citySubmitHandler);
$("#saved-cities").on("click", ".current-city", searchPrevCity);
