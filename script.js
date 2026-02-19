const weatherMap = {
  0: { 
    description: "Clear sky",
    dayIcon: "assets/icons/clear-day.svg",
    nightIcon: "assets/icons/clear-night.svg"
  },
  1: {
    description: "Mainly clear",
    dayIcon: "assets/icons/partly-cloudy-day.svg",
    nightIcon: "assets/icons/partly-cloudy-night.svg"
  },
  2: {
    description: "Partly cloudy",
    dayIcon: "assets/icons/partly-cloudy-day.svg",
    nightIcon: "assets/icons/partly-cloudy-night.svg"
  },
  3: {
    description: "Overcast",
    icon: "assets/icons/overcast.svg"
  },
  45: {
    description: "Fog",
    icon: "assets/icons/mist.svg"
  },
  48: {
    description: "Depositing rime fog",
    icon: "assets/icons/mist.svg"
  },
  51: { description: "Light drizzle", icon: "assets/icons/drizzle.svg" },
  53: { description: "Moderate drizzle", icon: "assets/icons/drizzle.svg" },
  55: { description: "Dense drizzle", icon: "assets/icons/drizzle.svg" },
  56: { description: "Light freezing drizzle", icon: "assets/icons/drizzle.svg" },
  57: { description: "Dense freezing drizzle", icon: "assets/icons/drizzle.svg" },
  61: { description: "Slight rain", icon: "assets/icons/rain.svg" },
  63: { description: "Moderate rain", icon: "assets/icons/rain.svg" },
  65: { description: "Heavy rain", icon: "assets/icons/rain.svg" },
  66: { description: "Light freezing rain", icon: "assets/icons/rain.svg" },
  67: { description: "Heavy freezing rain", icon: "assets/icons/rain.svg" },
  71: { description: "Slight snow fall", icon: "assets/icons/snow.svg" },
  73: { description: "Moderate snow fall", icon: "assets/icons/snow.svg" },
  75: { description: "Heavy snow fall", icon: "assets/icons/snow.svg" },
  77: { description: "Snow grains", icon: "assets/icons/snow.svg" },
  80: { description: "Slight rain showers", icon: "assets/icons/rain.svg" },
  81: { description: "Moderate rain showers", icon: "assets/icons/rain.svg" },
  82: { description: "Violent rain showers", icon: "assets/icons/rain.svg" },
  85: { description: "Slight snow showers", icon: "assets/icons/snow.svg" },
  86: { description: "Heavy snow showers", icon: "assets/icons/snow.svg" },
  95: { description: "Thunderstorm (moderate or heavy)", icon: "assets/icons/thunderstorms.svg" },
  96: { description: "Thunderstorm with slight hail", icon: "assets/icons/thunderstorms-rain.svg" },
  99: { description: "Thunderstorm with heavy hail", icon: "assets/icons/thunderstorms-rain.svg" }
};

async function showWeather() {
  let city = document.getElementById("city-field").value;
  const country = document.getElementById("country-field").value;

  if (city === "") return;
  city = city.charAt(0).toUpperCase() + city.slice(1);
  if (country !== "") city += ", " + country.charAt(0).toUpperCase() + country.slice(1);

  const weather = await getWeather(city);
  if (!weather) {
    alert("Weather data could not be found for the entered location");
    return;
  }

  parsedWeather = parseWeather(weather);
  parsedWeather.city = city;
  fillResultsContainer(parsedWeather);
}

async function getWeather(city) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geo = await geoRes.json();
    if (!geo.results || geo.results.length === 0) {
      throw new Error("City not found");
    }

    const lat = geo.results[0].latitude;
    const lon = geo.results[0].longitude;
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,wind_gusts_10m`
    );
    const weather = await weatherRes.json();

    return weather;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getWeatherDescription(code, isDay) {
  const entry = weatherMap[code];
  if (!entry) return { description: "Unknown weather", icon: "assets/icons/cloudy.svg" };
  const icon = entry.icon || (isDay ? entry.dayIcon : entry.nightIcon);
  return { description: entry.description, icon };
}

function parseWeather(weather) {
  const currentTime = weather.current_weather.time;
  const times = weather.hourly.time;
  const humidityValues = weather.hourly.relative_humidity_2m;
  const apparentTempValues = weather.hourly.apparent_temperature;
  const gustsValues = weather.hourly.wind_gusts_10m;

  let closestIndex = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i] === currentTime) {
      closestIndex = i;
      console.log(currentTime);
      console.log(times);
      break;
    }
  }

  const humidity = humidityValues[closestIndex];
  const apparentTemp = apparentTempValues[closestIndex];
  const gusts  = gustsValues[closestIndex];
  const {description, icon} = getWeatherDescription(weather.current_weather.weathercode, weather.current_weather.is_day);

  return {
    temperature: weather.current_weather.temperature,
    windSpeed: weather.current_weather.windspeed,
    windDirection: weather.current_weather.winddirection,
    description: description,
    icon: icon,
    humidity: humidity,
    apparentTemp: apparentTemp,
    gusts: gusts
  }
}

function fillResultsContainer(weather) {
  const resultsContainer = document.getElementById("results-container");
  const elements = resultsContainer.querySelectorAll("*");

  for (let element of elements) {
    switch (element.id) {
      case "location":
        element.textContent = weather.city;
        element.style.display = "block";
        break;
      case "weather-icon":
        element.src = weather.icon;
        element.alt = `An icon showing the described weather`;
        element.style.display = "inline-block";
        break;
      case "weather-main":
        element.textContent = weather.description;
        element.style.display = "inline-block";
        break;
      case "main-temperature":
        element.textContent = weather.temperature;
        element.style.display = "inline-block";
        break;
      case "feels-like":
        element.textContent = weather.apparentTemp;
        element.style.display = "inline-block";
        break;
      case "humidity":
        element.textContent = weather.humidity;
        element.style.display = "inline-block";
        break;
      case "wind":
        element.textContent = weather.windSpeed;
        element.style.display = "inline-block";
        break;
      case "wind-gust":
        element.textContent = weather.gusts;
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