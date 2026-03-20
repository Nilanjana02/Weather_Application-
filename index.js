
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer  = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-search-form]");
const loadingScreen = document.querySelector(".loading-container");
const userInfocontainer = document.querySelector(".user-info-container");
const error_found = document.querySelector(".error_found");
const forcast = document.querySelector(".forcast-button");
//for the for cast button 
// const forecastB = document.querySelector("[day-forcast]");


let currentTab = userTab;


const API_KEY = "6d8ffb2ba7197625887adfc3e4f31869";
                 //6d8ffb2ba7197625887adfc3e4f31869
//curent tab have some css propaty thats why below line is writing 
currentTab.classList.add("current-tab");
getfromSessionStorage();

//for switching between your weather
//  and search weather 
function switchTab(clickedTab)
{
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        error_found.classList.remove("active");
        document.querySelector(".forecast-table-container").classList.remove("active");
        currentTab.classList.add("current-tab");
    
        if(!searchForm.classList.contains("active"))
        {
        userInfocontainer.classList.remove("active");
        grantAccess.classList.remove("active");
        forcast.classList.remove("active");
        error_found.classList.remove("active");
        document.querySelector(".forecast-table-container").classList.remove("active");
        searchForm.classList.add("active");
        }
    else{
        searchForm.classList.remove("active");
        userInfocontainer.classList.remove("active");
        error_found.classList.remove("active");
        forcast.classList.remove("active");
        document.querySelector(".forecast-table-container").classList.remove("active");
        getfromSessionStorage();
    
         
    }
}
}
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) 
    {
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;
    grantAccess.classList.remove("active");
//loading screen visible
error_found.classList.remove("active"); 
document.querySelector(".forecast-table-container").classList.remove("active");

forcast.classList.remove("active");
    loadingScreen.classList.add("active");
    //call the API
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod !== 200) {
            loadingScreen.classList.remove("active");
            error_found.classList.add("active");
            userInfocontainer.classList.remove("active");
            return;
        }

        loadingScreen.classList.remove("active");
        userInfocontainer.classList.add("active");
        forcast.classList.add("active");
        document.querySelector(".forecast-table-container").classList.remove("active");

        renderWeatherInfo(data);
    }
        
    catch(err){
      loadingScreen.classList.remove("active");
      searchForm.classList.remove("active");
      userInfocontainer.classList.remove("active");
      forcast.classList.remove("active");
      document.querySelector(".forecast-table-container").classList.remove("active");

      //active the error UI
      error_found.classList.add("active");
    }

}


function renderWeatherInfo(weatherInfo){
    if (!weatherInfo || !weatherInfo.sys || !weatherInfo.weather || !weatherInfo.main) {
        error_found.classList.add("active");
        forcast.classList.remove("active");
        userInfocontainer.classList.remove("active");
        return;
    }
//first we have to fetch element
const cityName = document.querySelector("[data-cityName]");
const cityIcon = document.querySelector("[data-countryIcon]");
const description = document.querySelector("[data-wratherDesc]");
const weatherIcon = document.querySelector("[data-Weather-icon]");
const temparature = document.querySelector("[data-temp]");
const Windspeed = document.querySelector("[data-windSpeed]");
const Humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");
const weatherMain = weatherInfo.weather[0].main.toLowerCase(); 
const body = document.body;



//now fetch the data from the weatherInfo object and put it in the UI
cityName.innerText = weatherInfo?.name;
cityIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
description.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temparature.innerText = `${weatherInfo?.main?.temp} °C`;
Windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
Humidity.innerText = `${weatherInfo?.main?.humidity} %`;
cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


//add a event lisner for the grantAccess button


}
function getLocation()
{

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)

    }
    else{

    }
}
function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

 

}
const grantAcc = document.querySelector("[data-grantAccess]");
grantAcc.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName ==="")
        return;
    else

        {
            fetchsearchWeatherInfo(cityName);
            fetchFiveDayForecast(cityName);
  
        }

});

async function fetchsearchWeatherInfo(city)
{
  loadingScreen.classList.add("active");
  userInfocontainer.classList.remove("active");
  error_found.classList.remove("active");  
  grantAccess.classList.remove("active");
  try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();
    if (data.cod !== 200) {
        loadingScreen.classList.remove("active");
        error_found.classList.add("active");
        document.querySelector(".forecast-table-container").classList.remove("active");
        forcast.classList.remove("active");
        userInfocontainer.classList.remove("active");
        return;
    }
    loadingScreen.classList.remove("active");
    userInfocontainer.classList.add("active");
    forcast.classList.add("active");
    document.querySelector(".forecast-table-container").classList.remove("active");
    renderWeatherInfo(data);
}
catch(err) {
    loadingScreen.classList.remove("active");
    userInfocontainer.classList.remove("active");
    grantAccess.classList.remove("active");
    forcast.classList.remove("active");
    document.querySelector(".forecast-table-container").classList.remove("active");
    error_found.classList.add("active");
}
}
//for 
// document.querySelector('[day-forcast]').addEventListener('click', async () => {
//     userInfocontainer.classList.remove("active");  // Hide user info
//     error_found.classList.remove("active"); 
//     const city = document.querySelector('[data-cityName]').textContent.trim();
//     if (!city) return alert("No city found!");

//     try {
//         // const apiKey = '6d8ffb2ba7197625887adfc3e4f31869';  // <- Replace this
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();

//         if (data.cod !== "200") {
//             alert('Forecast data not available.');
//             return;
//         }

//         const tbody = document.querySelector("#forecastTable tbody");
//         tbody.innerHTML = ""; // Clear old rows

//         const dailyData = {};

//         data.list.forEach(entry => {
//             const date = entry.dt_txt.split(" ")[0];
//             if (!dailyData[date] || entry.dt_txt.includes("12:00:00")) {
//                 dailyData[date] = entry;
//             }
//         });

//         Object.values(dailyData).forEach(entry => {
//             const dayName = new Date(entry.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${dayName}</td>
//                 <td>${entry.weather[0].description}</td>
//                 <td>${entry.main.temp} °C</td>
//                 <td>${entry.wind.speed} m/s</td>
//                 <td>${entry.main.humidity} %</td>
//             `;
//             tbody.appendChild(row);
//         });

//         document.querySelector(".forecast-table-container").classList.add("active");

//     } catch (error) {
       
//         document.querySelector(".forecast-table-container").classList.add("active");

//         error_found.classList.add("active");
//     }
// });
let forecastVisible = false; 

document.querySelector('[day-forcast]').addEventListener('click', async () => {
    const forecastContainer = document.querySelector(".forecast-table-container");

    // If forecast is already visible, hide it and show user weather info
    if (forecastVisible) {
        forecastContainer.classList.remove("active");
        userInfocontainer.classList.add("active");
        forecastVisible = false;
        return;
    }

    userInfocontainer.classList.remove("active");
    error_found.classList.remove("active"); 

    const city = document.querySelector('[data-cityName]').textContent.trim();
    if (!city) return alert("No city found!");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod !== "200") {
            alert('Forecast data not available.');
            return;
        }

        const tbody = document.querySelector("#forecastTable tbody");
        tbody.innerHTML = ""; // Clear old rows

        const dailyData = {};
        data.list.forEach(entry => {
            const date = entry.dt_txt.split(" ")[0];
            if (!dailyData[date] || entry.dt_txt.includes("12:00:00")) {
                dailyData[date] = entry;
            }
        });

        Object.values(dailyData).forEach(entry => {
            const dayName = new Date(entry.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${dayName}</td>
                <td>${entry.weather[0].description}</td>
                <td>${entry.main.temp} °C</td>
                <td>${entry.wind.speed} m/s</td>
                <td>${entry.main.humidity} %</td>
            `;
            tbody.appendChild(row);
        });

        forecastContainer.classList.add("active");
        forecastVisible = true;

    } catch (error) {
        error_found.classList.add("active");
    }
});






