API_KEY = "6d8ffb2ba7197625887adfc3e4f31869"
try{


const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
  const data = await response.json();
      console.log(data);
      // Loop through the forecast list:
      data.list.forEach(item => {
          console.log("Time:", item.dt_txt);
          console.log("Temp:", item.main.temp);
          console.log("Weather:", item.weather[0].description);
      });
  }
  catch(error)
  {

   console.log("Error fetching forecast:", error);
  }
