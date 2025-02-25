// Select DOM elements
const $ = (id) => document.querySelector(id);
const cityNameEl = $("#cityName"),
  cityCodeEl = $("#cityCode"),
  localDateEl = $("#localDate"),
  localTimeEl = $("#localTime"),
  weatherImgEl = $("#weather_img"),
  mainTempEl = $("#mainTemperature"),
  tempDescEl = $("#tempDescription"),
  celsiusEl = $("#celsius"),
  fahrenheitEl = $("#fahrenheit"),
  humidityEl = $("#humidity"),
  windEl = $("#wind"),
  pressureEl = $("#pressure"),
  feelLikeEl = $("#feelLike"),
  queryEl = $("#query"),
  searchEl = $("#search");

const apiKey = "126688fe7925400d81763c4bb6265bba";
let cityName = "Dhaka",
  dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Fetch weather data
const fetchWeather = async (lat = "", lon = "", city = cityName) => {
  let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&q=${city}&units=imperial&appid=${apiKey}`);
  return res.json();
};

// Display weather data
const displayWeather = async (lat, lon, city) => {
  let data = await fetchWeather(lat, lon, city);
  cityCodeEl.innerText = data.sys.country;
  cityNameEl.innerText = data.name === "Sāmāir" ? "Dhaka" : data.name;
  humidityEl.innerText = data.main.humidity;
  windEl.innerText = data.wind.speed;
  pressureEl.innerText = data.main.pressure;
  tempDescEl.innerText = data.weather[0].description;
  weatherImgEl.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

  const updateTemp = (isCelsius) => {
    feelLikeEl.innerText = Math.round(isCelsius ? (data.main.feels_like - 32) * 0.5556 : data.main.feels_like);
    mainTempEl.innerText = Math.round(isCelsius ? (data.main.temp - 32) * 0.5556 : data.main.temp);
    celsiusEl.classList.toggle("active", isCelsius);
    fahrenheitEl.classList.toggle("active", !isCelsius);
  };

  fahrenheitEl.onclick = () => updateTemp(false);
  celsiusEl.onclick = () => updateTemp(true);
  updateTemp(true);
};

// Get location and fetch weather
window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => displayWeather(coords.latitude, coords.longitude, ""),
    () => displayWeather("", "", cityName)
  );
};

// Search weather
searchEl.onclick = (e) => {
  e.preventDefault();
  if (queryEl.value) {
    cityName = queryEl.value;
    queryEl.value = "";
    displayWeather("", "", cityName).catch(() => {
      queryEl.placeholder = "Not a valid city name";
      queryEl.classList.add("error");
      setTimeout(() => {
        queryEl.placeholder = "Search by city name";
        queryEl.classList.remove("error");
      }, 2000);
    });
  } else {
    queryEl.placeholder = "Enter a valid city name";
    queryEl.classList.add("error");
    setTimeout(() => {
      queryEl.placeholder = "Search by city name";
      queryEl.classList.remove("error");
    }, 2000);
  }
};

// Set time and date
setInterval(() => {
  let d = new Date();
  localDateEl.innerHTML = `${dayList[d.getDay()]} ${monthList[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
  localTimeEl.innerHTML = `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
}, 1000);
