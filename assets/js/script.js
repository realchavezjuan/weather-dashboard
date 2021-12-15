var submitBtnEl = document.querySelector(".submit-city-btn");
var formContentEl = document.querySelector("#form-content");
var cityTitleEl = document.querySelector("#city");
var todaysTemperatureEl = document.querySelector("#temperature");
var todaysWindEl = document.querySelector("#wind");
var todaysHumidityEl = document.querySelector("#humidity");
var todaysUvEl = document.querySelector("#uv");

//with city name, fetch coordinates
var formSubmitHandler = function(event){
    event.preventDefault();
    //takes the value of the user input(city name)
    var city = formContentEl.value;

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ab35a0a94cc8d81e7aa6c727ef9bb2e0";

    //fetch city coordinates
    fetch(apiURL)
        .then(function(response) {
            if (response.ok){
                response.json().then(function(data){
                    applyCoordinates(data,city)
                })
            }
            else {
                alert("Error: GitHub user not found.");
            }
        }).catch(function(error) {
            alert("Unable to connect to GitHub");
        });
    
}

//with city coordinates, now fetch weather data
var applyCoordinates = function(data,city){
    // get city coordinates
    var lon = JSON.stringify(data.coord.lon);
    var lat = JSON.stringify(data.coord.lat);

    // fetch weather with coordinates
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid=ab35a0a94cc8d81e7aa6c727ef9bb2e0";

    fetch(weatherApi)
        .then(function(response) {
            if (response.ok){
                response.json().then(function(data){
                   todaysWeatherHandler(data,city)
                   forecastHandler(data)
                })
            }
            else {
                alert("Error: GitHub user not found.");
            }
        }).catch(function(error) {
            alert("Unable to connect to GitHub");
        });
   
}

//paste weather data on HTML file
var todaysWeatherHandler = function(data, city){

    //puts the name of the city in the H2 elements
    cityTitleEl.innerHTML = city;
    //puts the current temperature into the p element
    todaysTemperatureEl.innerHTML = "Temp: " + data.current.temp + "°F";
    //puts the current wind speed into the p element
    todaysWindEl.innerHTML = "Wind: " + data.current.wind_speed + "MPH";
    //puts the current humidity level into the p element
    todaysHumidityEl.innerHTML = "Humidity: " + data.current.humidity + "%";
    //puts the current UV Index into the p element
    todaysUvEl.innerHTML = "UV Index: " + data.current.uvi;

}

var forecastHandler = function(data){

    //for loop to print every data info into the html elements
    for (let i = 1; i < 6; i++) {
        //loops through the Daily Data for 5 days
        var dailyData = data.daily[i];
        // get forcast container element with cards in it
        var forcastContainer = document.getElementsByClassName("forcast-container");
        //gets the entire card element
        var forcastCardEl = forcastContainer[0].children[i-1];
        //gets the individual p elements
        var forcastTempEl = forcastCardEl.children[0];
        var forcastWindEl = forcastCardEl.children[1];
        var forcastHumidityEl = forcastCardEl.children[2];
        //gets the temperature data of that day
        var temperature = dailyData.temp.day;
        // gets the wind data of that day
        var wind = dailyData.wind_speed;
        // gets the humidity data of that day
        var humidity = dailyData.humidity;
        // adds  the inner HTML to the temperature p element 
        forcastTempEl.innerHTML = "Temp: " + temperature + "°F";
        // adds  the inner HTML to the wind p element 
        forcastWindEl.innerHTML = "Wind: " + wind + "MPH";
        // adds  the inner HTML to the humidity p element 
        forcastHumidityEl.innerHTML = "Humidity: " + humidity + "%";
    }
}

submitBtnEl.addEventListener("click", formSubmitHandler);

