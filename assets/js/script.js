var today = moment().format("M/D/YYYY");
console.log(today);
var seachForm = $("#search-form");
var weatherDisplayEl = $("#weather-container");
var citySearchReq = $("#city-search-request");

var citySubmitHandler = function (event) {
  event.preventDefault();

  var city = citySearchReq.val();
  console.log(city);

  if (city) {
    getForecast(city);

    citySearchReq.value = "";
  } else {
    alert("Please enter a city");
  }
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
          console.log(data.list.length)
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

  var todayWeather = {
  temp: weather.main.temp,
  wind: weather.wind.speed,
  humidity: weather.main.humidity + "%",
  }

  document.querySelector("#current-city").innerHTML = city + " (" + today + ")";
  var currentWeather = document.createElement('div');
  currentWeather.classlist = 'card'
  var weatherData = document.createElement('span')
  weatherData.innerHTML = `
  <h3> ${todayWeather.map(function(){
    return "hello"
  })}</h3>`
  currentWeather.appendChild(weatherData)
  weatherDisplayEl.append(currentWeather)

};

var displayForecast = function (weather, citySearch) {
  
  if (weather.length === 0) {
    repoContainerEl.textContent = 'nope';
    return;
  }

  citySearchReq.textContent = citySearch;

  for (var i = 0; i < 5; i++) {
    var forecast = {
      Day: weather[i].dt_txt,
      Temp: weather[i].main.temp,
      Wind: weather[i].wind.speed,
      Humidity: weather[i].main.humidity + "%",
    }
      console.log(forecast.temp[0])
  }

  //   var repoEl = document.createElement('div');
  //   repoEl.classList = 'list-item flex-row justify-space-between align-center';

  //   var titleEl = document.createElement('span');
  //   titleEl.textContent = repoName;

  //   repoEl.appendChild(titleEl);

  //   var statusEl = document.createElement('span');
  //   statusEl.classList = 'flex-row align-center';

  //   if (repos[i].open_issues_count > 0) {
  //     statusEl.innerHTML =
  //       "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
  //   } else {
  //     statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  //   }

  //   repoEl.appendChild(statusEl);

  //   repoContainerEl.appendChild(repoEl);
  // }
}

$("#search-btn").on("click", citySubmitHandler);
