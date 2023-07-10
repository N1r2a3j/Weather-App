  // Begin 

  const userTab=document.querySelector("[data-userWeather]");
  const searchTab=document.querySelector("[data-searchWeather]");
  const userContainer=document.querySelector(".weather-container");
  const grantAccessContainer=document.querySelector(".grant-location-container");

 const searchForm = document.querySelector("[data-searchForm ]");
 const loadingScreen=document.querySelector(".loading-container");
 const apiErrorContainer = document.querySelector(".api-error-container");

 const userInfoContainer=document.querySelector(".user-info-container");
 const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");


 let currentTab=userTab; // current means old tab

 const API_key="38c969c8b3865d69ea69a7f62ab4cc95";

 currentTab.classList.add("current-tab");
 getformSessionStorage();// if initiallly longitude and latitude present
 // clicked means new tab
 function switchTab(clickedTab){
    apiErrorContainer.classList.remove("active");
    if(clickedTab!=currentTab)
    {
     currentTab.classList.remove("current-tab");
     currentTab=clickedTab;
     currentTab.classList.add("current-tab");
     
         if(!searchForm.classList.contains("active")){
            // if searchform container is invisible then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
         }
         else
         {
           // mai phle search wale tab me tha ab your weather wala tab visible krna he 
           searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now we are in your weather tab so we have to display weather also ,,so check local storage first for coordinate if we have saved them there
            getformSessionStorage();

         }
    }
 }

 userTab.addEventListener('click',()=>{
     // pass clicked tab as input parameter
     switchTab(userTab);
 });


 searchTab.addEventListener('click',()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
})
//check if coordinate are already present in session storage
function getformSessionStorage(){
    const localCoordinate=sessionStorage.getItem("user-coordinates");
    if(!localCoordinate){
    // if local coordinate are not stored ...means there is not given access by user so ...
    grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinates=JSON.parse(localCoordinate);
        // fetching data of user if coordinate present
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
       const {lat,lon}=coordinates;
       // make    grant container invisible
       grantAccessContainer.classList.remove("active");
       // make loader visible;
       //loadingScreen.classList.add("active");
       loadingScreen.classList.add("active");
       apiErrorContainer.classList.remove("active");
       // call API
       try{
       const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
       const data=await response.json();
       if (!data.sys) {
        throw data;
      }
       loadingScreen.classList.remove('active');//invisible
       userInfoContainer.classList.add("active");//visible

       renderWeatherInfo(data);

     
       }
       catch(err)
       
       {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${err?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);

       }

}


function renderWeatherInfo(weatherInfo){
    // firstly, we have to fatch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weathericon");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fwtch values from weatherInfo object and put it UI elements


    //IMP//
   console.log(weatherInfo);

    cityName.innerText=weatherInfo?.name;

    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;  //IMP
    
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    
    temp.innerText=` ${weatherInfo?.main?.temp} °C`;


    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;

    humidity.innerText=`${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}

 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        // show an elert for no geolocation support available
    }
 }


 function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
 }
const grantAccessButton=document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);

let searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
      return;
     else
     {
        fetchSearchWeatherInfo(cityName);
     } 
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
            const data=await response.json();
            if (!data.sys) {
                throw data;
              }
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);

                  
    }


    catch(err){
        loadingScreen.classList.remove("active");
       
     apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = `${err?.message}`;
    apiErrorBtn.style.display = "none";
    }
}