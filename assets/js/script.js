var submitBtnEl = document.querySelector(".submit-city-btn");
var formContentEl = document.querySelector("#form-content");


var formSubmitHandler = function(event){
    event.preventDefault();

    var city = formContentEl.value;
    console.log(city);

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ab35a0a94cc8d81e7aa6c727ef9bb2e0";

    fetch(apiURL)
        .then(function(response) {
            if (response.ok){
                console.log(response)
                response.json().then(function(data){
                    console.log(data)
                })
            }
        });
      
}


submitBtnEl.addEventListener("click", formSubmitHandler);

