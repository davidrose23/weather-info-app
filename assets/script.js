var apiKey = "9a2a38b0566e5f576f37c0fbebfa80d4";
var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-input");
var history = document.getElementById("history");

var searches = 0;


var btnsCreated = 0;


// search function

function search() {
    if (searches == 0) localStorage.clear();
    var city = document.getElementById("city-input").value;
    console.log(city);


    if (city != "") {
        getWeatherApi(city);
        addToStorage(city);
    }
    if (btnsCreated < 5 && city != "") {
        createHistory();
        searches++;

    }

}

// get weather data

function getWeatherApi(cityName) {


    let firstUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(firstUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // display city name

            document.getElementById("results-col").style.display = "block";

            document.getElementById("display-city").innerHTML = data.name;
            // display current temp
            document.getElementById("display-temp").innerHTML = "Current temp: " + data.main.temp + "&#8457";

            // display daily high
            document.getElementById("display-high").innerHTML = "High for today: " + data.main.temp_max + "&#8457";

            // dislpay the daily low
            document.getElementById("display-low").innerHTML = "Low for today: " + data.main.temp_min + "&#8457";


            //make second call for 5-day forecast data
            let lon = data.coord.lon;
            let lat = data.coord.lat;

            let secondUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

            fetch(secondUrl)
                .then(function (repsonse) {
                    return repsonse.json();
                })
                .then(function (data) {
                    console.log(data);


                    let dayMaxs = [];
                    let dayMins = [];
                    for (i = 0; i < 5; i++) {

                        dayMins[i] = data.daily[i].temp.min;
                        dayMaxs[i] = data.daily[i].temp.max;
                    }


                    let day = 1;
                    for (i = 0; i <= dayMins.length; i++) {
                        document.getElementById("day-" + day + "-min").innerHTML = "Low: " + dayMins[i] + "&#8457";

                        document.getElementById("day-" + day + "-max").innerHTML = "High: " + dayMaxs[i] + "&#8457";


                        day++;
                    }



                })


        })


    document.getElementById("city-input").value = "";
}



// create and display search history


function createHistory() {


    newBtn = document.createElement("input");
    var existingEntries = JSON.parse(localStorage.getItem("searchedCities"));
    var currentCity = existingEntries[searches];


    newBtn.value = currentCity;
    newBtn.type = "button";
    newBtn.id = currentCity;
    newBtn.className = "btn btn-secondary m-1 form-control";
    newBtn.addEventListener("click", function () {


        getWeatherApi(currentCity);
    })
    document.getElementById("history").appendChild(newBtn);
    btnsCreated++;
}

//add city to history

function addToStorage(currentCity) {
    var existingEntries = JSON.parse(localStorage.getItem("searchedCities"));
    if (existingEntries == null) existingEntries = [];
    existingEntries.push(currentCity);
    localStorage.setItem("searchedCities", JSON.stringify(existingEntries));
    console.log(existingEntries);

}





// add event listeners for butotn and enter key

searchBtn.addEventListener('click', search);
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
});
