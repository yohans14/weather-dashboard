var cityHistory = [];

var citySearchEl = document.getElementById("cityName");
var cityFormEl = document.getElementById("city-form");
var searchBtn = document.getElementById("searchbtn");
var cityHistoryContiner = document.getElementById("cityHistoryContiner");
var currentWeather = document.getElementById("currentWeather");
var futureForecast = document.getElementById("futureForecast");

const apiKey = "0ac1781e4e58355720795bec8018d18e";
const url = "https://api.openweathermap.org";

// get city name
let historySection = function () {
	cityHistoryContiner.innerHTML = "";
	for (let i = cityHistory.length - 1; i >= 0; i--) {
		let addcity = document.createElement("button");
		addcity.setAttribute("class", "historyBtn col s12");
		addcity.setAttribute("type", "button");
		addcity.setAttribute("aria-control", "today forecast");
		searchBtn.setAttribute("data-search", cityHistory[i]);
		addcity.textContent = cityHistory[i];
		cityHistoryContiner.append(addcity);
	}
};

// add cityHistory to localStorag

function setData(city) {
	if (cityHistory.indexOf(city) !== -1) {
		return;
	}
	cityHistory.push(city);
	localStorage.setItem("search-history", JSON.stringify(cityHistory));
	historySection();
}

// getting city from localStorage

let getData = function () {
	let stordHistroy = localStorage.getItem("search-history");
	if (stordHistroy) {
		cityHistory = JSON.parse(stordHistroy);
	}
	historySection();
};

var getCurrentWeather = function (city, weather) {
	var unixTs = weather.dt;
	let temp = weather.temp;
	let humidity = weather.humidity;
	let wind = weather.wind_speed;
	let uvi = weather.uvi;
	let icon = weather.weather[0].icon;
	let description = weather.weather[0].description;

	// creating Element and append
	var cityNameEl = document.createElement("h2");
	cityNameEl.setAttribute("class", "card-title");
	cityNameEl.innerText =
		city + " Today" + " " + dayjs.unix(unixTs).format("MMM DD, YYYY");

	var iconEl = document.createElement("img");
	iconEl.setAttribute("src", "");
	iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

	var tempEl = document.createElement("p");
	tempEl.innerText = "Temp: " + temp + "°F";

	var humidityEl = document.createElement("p");
	humidityEl.innerText = "Humidity: " + humidity + "%";

	var windEl = document.createElement("p");
	windEl.innerText = "Wind: " + wind + " MPH";

	var descriptionEl = document.createElement("p");
	descriptionEl.innerText = description;

	var uvEl = document.createElement("p");
	var uvColor = document.createElement("button");
	uvEl.innerText = " UV Index: ";
	uvColor.classList.add("btn", "btn");
	if (uvi < 3) {
		uvColor.classList.add("btn-green");
	} else if (uvi < 7) {
		uvColor.classList.add("btn-orange");
	} else {
		uvColor.classList.add("btn-red");
	}
	uvColor.textContent = uvi;
	uvEl.append(uvColor);

	let container = document.createElement("div");
	container.setAttribute("class", "col s12");
	let card = document.createElement("div");
	card.setAttribute("class", "card blue-grey darken-1 z-depth-5");
	currentWeather.appendChild(container);
	container.append(card);
	card.append(
		cityNameEl,
		iconEl,
		tempEl,
		humidityEl,
		windEl,
		descriptionEl,
		uvEl
	);
};

let fiveDayForecast = function (weather) {
	var unixTs = weather.dt;
	let tempMax = weather.temp.max;
	let tempMin = weather.temp.min;
	let humidity = weather.humidity;
	let icon = weather.weather[0].icon;
	let description = weather.weather[0].description;

	// create and return the text content of an element
	var ThisDateEl = document.createElement("h2");
	ThisDateEl.setAttribute("class", "card-title");

	ThisDateEl.innerText = dayjs.unix(unixTs).format("ddd, MMM D, YYYY");

	var iconEl = document.createElement("img");
	iconEl.setAttribute("src", "");
	iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

	var tempsEl = document.createElement("p");
	tempsEl.innerText = "Temp: " + tempMax + "°F" + " - " + tempMin + "°F";

	var humidityEl = document.createElement("p");
	humidityEl.innerText = "Humidity: " + humidity + "%";

	var descriptionEl = document.createElement("p");
	descriptionEl.innerText = description;

	//create a container and append elements inside a card
	let container = document.createElement("div");
	container.setAttribute("class", "col s12 m6");
	let card = document.createElement("div");
	card.setAttribute("class", "card blue-grey darken-1 z-depth-5");
	futureForecast.appendChild(container);
	container.append(card);
	card.append(ThisDateEl, iconEl, tempsEl, humidityEl, descriptionEl);
};

let thisDateWeater = function (weather) {
	var firstDay = dayjs().add(1, "day").startOf("day").unix();
	var lastDay = dayjs().add(6, "days").startOf("day").unix();

	for (let i = 0; i < weather.length; i++) {
		if (weather[i].dt >= firstDay && weather[i].dt < lastDay) {
			fiveDayForecast(weather[i]);
		}
	}
};

function renderItems(city, data) {
	getCurrentWeather(city, data.current);
	thisDateWeater(data.daily);
}

// fetch weather
var featchWeather = function (location) {
	var { lat } = location;
	var { lon } = location;
	var city = location.name;

	var apiUrl = `${url}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				response.json().then(function (data) {
					// console.log(data);
					renderItems(city, data);
				});
			} else {
				alert(err);
			}
		})
		.catch(function (error) {
			alert("can not connect to the server at this time");
		});
};

function cityCoords(city) {
	var apiUrl =
		"https://api.openweathermap.org/geo/1.0/direct?q=" +
		city +
		"&limit=5&appid=" +
		apiKey;

	fetch(apiUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			if (!data[0]) {
				alert("city is not found");
			} else {
				setData(city);
				featchWeather(data[0]);
				console.log(data);
			}
		})
		.catch(function (error) {
			alert("can not connect to the server at this time!");
		});
}
var getCity = function (e) {
	e.preventDefault();

	var city = citySearchEl.value.trim();

	if (city) {
		cityCoords(city);
		citySearchEl.value = "";
	} else {
		alert("please enter a city");
	}
};

let searchedCity = function (e) {
	if (!e.target.matches(".historyBtn")) {
		return;
	}
	var btn = e.target;
	var city = btn.getAttribute("data-search");
	cityCoords(city);
};

getData();
searchBtn.addEventListener("click", getCity);
cityHistoryContiner.addEventListener("click", searchedCity);
