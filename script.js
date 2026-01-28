async function getWeather(city) {
  try {
    const response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/city/${city}`)
    const result = await response.json();
    return result;
  } catch(error) {
    console.log(error);
  }
}

async function showWeather() {
  const selector = document.getElementById("weather-selector");
  const city = selector.value;
  if (city === "") return;
  const weather = await getWeather(city);
  if (!weather) {
    alert("Something went wrong, please try again later");
    return;
  }
  fillResultsContainer(weather);
}

function fillResultsContainer(weather) {
  const resultsContainer = document.getElementById("results-container");
  const elements = resultsContainer.querySelectorAll("*");
  for (let element of elements) {
    switch (element.id) {
      case "location":
        element.textContent = weather.name ? weather.name : "N/A";
        element.style.display = "block";
        break;
      case "weather-icon":
        element.src = weather.weather[0].icon;
        element.alt = weather.weather[0].description ? weather.weather.description : "N/A";
        element.style.display = "inline-block";
        break;
      case "weather-main":
        element.textContent = weather.weather[0].main ? weather.weather[0].main : "N/A";
        element.style.display = "inline-block";
        break;
      case "main-temperature":
        element.textContent = weather.main.temp ? weather.main.temp : "N/A";
        element.style.display = "inline-block";
        break;
      case "feels-like":
        element.textContent = weather.main.feels_like ? weather.main.feels_like : "N/A";
        element.style.display = "inline-block";
        break;
      case "humidity":
        element.textContent = weather.main.humidity ? weather.main.humidity: "N/A";
        element.style.display = "inline-block";
        break;
      case "wind":
        element.textContent = weather.wind.speed ? weather.wind.speed: "N/A";
        element.style.display = "inline-block";
        break;
      case "wind-gust":
        element.textContent = weather.wind.gust ? weather.wind.gust: "N/A";
        element.style.display = "inline-block";
        break;
      default:
        if (!element.style.display) {
          element.style.display = "block";
          }
        break;
    }
  }
}

function start() {
  const getWeatherBtn = document.getElementById("get-weather-btn");
  getWeatherBtn.addEventListener("click", showWeather);
}

start();