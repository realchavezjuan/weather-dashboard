var submitBtnEl = document.querySelector(".submit-city-btn");
var formContentEl = document.querySelector("#form-content");
var cityTitleEl = document.querySelector("#city");
var todaysDate = document.querySelector("#current-day")
var todaysTemperatureEl = document.querySelector("#temperature");
var todaysWindEl = document.querySelector("#wind");
var todaysHumidityEl = document.querySelector("#humidity");
var todaysUvEl = document.querySelector("#uv");
var historyBtnDiv = document.querySelector(".history-button-div");
var idCounter = 0;
var cityHistoryArray = [];

var main = function(){
    getSearchedCities();
}

//with city name, fetch coordinates
var formSubmitHandler = function(event){
    event.preventDefault();
    //takes the value of the user input(city name)
    var city = formContentEl.value;

    formContentEl.value = "";
    createHistoryBtn(city);
    putCityInStorage(city);

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
                   console.log(data);
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
    cityTitleEl.innerHTML = city.toUpperCase();
    setCurrentWeatherIcon(data);
    // puts the current day and date of the weather
    todaysDate.innerHTML = getCurrentDay(data)
    //puts the current temperature into the p element
    todaysTemperatureEl.innerHTML = "Temp: " + data.current.temp + "°F";
    //puts the current wind speed into the p element
    todaysWindEl.innerHTML = "Wind: " + data.current.wind_speed + "MPH";
    //puts the current humidity level into the p element
    todaysHumidityEl.innerHTML = "Humidity: " + data.current.humidity + "%";
    //puts the current UV Index into the p element
    todaysUvEl.innerHTML = "UV Index: " + data.current.uvi;
    //sets color of uv 
    uvIndexLevel(data);
    
}

var forecastHandler = function(data){

    //for loop to print every data info into the html elements
    for (let i = 1; i < 6; i++) {
        //loops through the Daily Data for 5 days
        var dailyData = data.daily[i];
        // gets forcast container element (as a js object)
        var forcastContainer = document.getElementsByClassName("forcast-container");
        //gets the entire card element
        var forcastCardEl = forcastContainer[0].children[i-1];
        //gets the individual p elements
        
        var forcastDayEl = forcastCardEl.children[0];
        var forcastIconEl = forcastCardEl.children[1];
        var forcastTempEl = forcastCardEl.children[2];
        var forcastWindEl = forcastCardEl.children[3];
        var forcastHumidityEl = forcastCardEl.children[4];
        // gets the day data of that day from function
        var day = getWeekDay(data, i);
        //gets the temperature data of that day
        var temperature = dailyData.temp.day;
        // gets the wind data of that day
        var wind = dailyData.wind_speed;
        // gets the humidity data of that day
        var humidity = dailyData.humidity;
        // adds the inner HTML to the day element in the card
        forcastDayEl.innerHTML = day;
        // sets the icon on the html element
        setWeekDayWeatherIcon(data, forcastIconEl, i);
        // adds  the inner HTML to the temperature p element 
        forcastTempEl.innerHTML = "Temp: " + temperature + "°F";
        // adds  the inner HTML to the wind p element 
        forcastWindEl.innerHTML = "Wind: " + wind + "MPH";
        // adds  the inner HTML to the humidity p element 
        forcastHumidityEl.innerHTML = "Humidity: " + humidity + "%";
    }
}

var createHistoryBtn = function(city){
    //creating button
    var historyBtnEl = document.createElement("div");
    historyBtnEl.className = "history-button";
    //create a p element to go inside div for history button
    var cityNameEl = document.createElement("p");
    //give element a unique id to add click listener
    cityNameEl.setAttribute("unique-id", idCounter);
    cityNameEl.innerHTML = city.toUpperCase();
    
    // appending p element inside div to put the city name in the button
    historyBtnEl.appendChild(cityNameEl);
    //append button to the left side of page
    historyBtnDiv.appendChild(historyBtnEl);
    
    // increment id for next history button element
    idCounter++;
}

var putCityInStorage = function(city){
    //push in array
    cityHistoryArray.push(city);
    //put in storage
    localStorage["searched-city"] = JSON.stringify(cityHistoryArray);
    
}

var getSearchedCities = function(){
    //if searched-city key exist in local storage, then create buttons and push cities into the history array
    if (localStorage["searched-city"]){
        //parses the cities to avoid having many "one character strings" ex: "salem" vs "s""a""l""e""m"
        var searchedCityStorageArray = JSON.parse(localStorage["searched-city"]);

        for (let i = 0; i < searchedCityStorageArray.length; i++) {
            // create a button for every existing citie in the search history
            createHistoryBtn(searchedCityStorageArray[i]);
            // pushes city names from local storage--> into the search history array--> so the array isnt empty after refreshing page. Otherwise, with an empty array, when a user submits a new city, the local storage will replace the "old, history-search-array"(salem, portland) with a "new, history-searched-array"(woodburn). This way, search history is persistent after infinite, page refreshes
            cityHistoryArray.push(searchedCityStorageArray[i]); 
        }
    }
}

var historyBtnHandler = function(city) {
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

var clickHistoryBtn = function(event) {
    
    var clickedHistoryEl = event.target
    
    cityName = clickedHistoryEl.innerHTML;
    
    historyBtnHandler(cityName);
}

var getCurrentDay = function(data) { 
    var unixTimeStamp = data.current.dt
    //js works with milliseconds
    unixTimeStamp = unixTimeStamp * 1000;
    // turn it into an obj
    unixTimeStampObj = new Date(unixTimeStamp);
    // .getDay returns a number 0-6
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = days[unixTimeStampObj.getDay()];
    // .getMonth returns a number 0-11
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[unixTimeStampObj.getMonth()];
    // get dayof the month
    var date = unixTimeStampObj.getDate();
    
    var todayIs = day + ", " + month + ", " + date;
    return todayIs;
}

var getWeekDay = function(data, i) { 
    var unixTimeStamp = data.daily[i].dt
    //js works with milliseconds
    unixTimeStamp = unixTimeStamp * 1000;
    // turn it into an obj
    unixTimeStampObj = new Date(unixTimeStamp);
    // .getDay returns a number 0-6
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = days[unixTimeStampObj.getDay()];
    // .getMonth returns a number 0-11
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[unixTimeStampObj.getMonth()];
    // get dayof the month
    var date = unixTimeStampObj.getDate();
    
    var todayIs = day + ", " + month + ", " + date;
    return todayIs;
}

// this function sets the background color of the UV Index display
var uvIndexLevel = function(data){
    uvIndex = data.current.uvi;
    if (uvIndex<3){
        todaysUvEl.className="uv-low";
    }
    if(uvIndex>=3 && uvIndex<7){
        todaysUvEl.className="uv-moderate";
    }
    if(uvIndex>=7 && uvIndex<10){
        todaysUvEl.className="uv-high";
    }
    if(uvIndex>=10) {
        todaysUvEl.className="uv-very-high";
    }
}

var setCurrentWeatherIcon = function(data){
    var icon = data.current.weather[0].icon;
    // gives the current img element a src attribute
    var currentWeatherIconEl = document.getElementById("current-weather-icon");
    currentWeatherIconEl.src = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
}

var setWeekDayWeatherIcon = function(data, forcastIconEl, i){
    var icon = data.daily[i].weather[0].icon;
    //gives the forcast img element a src attribute
    forcastIconEl.src = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
}

main();
submitBtnEl.addEventListener("click", formSubmitHandler);
historyBtnDiv.addEventListener("click", clickHistoryBtn);


