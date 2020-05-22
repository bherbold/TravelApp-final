import {travelTime} from './TimeChecker'

/* Global Variables */

// Personal API Key for OpenWeatherMap API
const WeatherKey = '&key=4f2f2c2281cd49559f9b5cb5f8e19e43'
const WeatherBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?city='

const ImgKey = '16651159-a57b869c8ec119da485898484' 
const ImgBaseURL = 'https://pixabay.com/api/?key=16651159-a57b869c8ec119da485898484&q='

const wikiBaseURL = 'http://api.geonames.org/findNearbyWikipediaJSON?'

// Event listener to add function to existing HTML DOM element

/* Function called by event listener */

function action(event){
    event.preventDefault()
    
    const date1 = document.getElementById('date').value;
    const docDate = new Date(`${date1}`);
    console.log(docDate);
    const city = document.getElementById('city').value;
    let lat = 0;
    let lon = 0;

    if(travelTime(docDate)){
        //get zip and feelings Input

        console.log (city)
        console.log(date1)

        getWeatherFC(WeatherBaseURL,city, WeatherKey)

        .then(function(data){

            console.log(data)
            lat = data[0].lat;
            lon = data[0].lon;

            console.log('post weather from client to server');
            postEntry('http://localhost:8081/addWeather', {
                weather: data});
        })
        .then(
            WeatherFCupdateUI
            );

    }else{

        console.log('NOT 7 DAYS')
        console.log (city)
        console.log(date1)

        //get the Weather from API, then Post it to the server, then Update UI 
        getWeatherONE(WeatherBaseURL,city, WeatherKey)

        .then(function(data){
            console.log(data)
            lat = data[0].lat;
            lon = data[0].lon;

            console.log('post weather from client to server');
            postEntry('http://localhost:8081/addWeather', {
                weather: data});

        })

        .then(
            WeatherONEupdateUI
            );
    }

    //get the IMG from API, then Post it to the server, then Update UI 
    getImg(ImgBaseURL,city)

    .then(function(data){

        console.log('post Img URL from client to server');
        postEntry('http://localhost:8081/addImg', data);
    })

    .then(
        IMGupdateUI
    );

    //set Timeout to avoid overlapping servercalls 
    //get coordinates from weather API, then get Time from API, then Post it to the server, then Update UI 
    setTimeout(() => {

        getTime(TimezoneBaseURL,lat,lon)
    
        .then(function(data){
    
            console.log('post Time - client to server');
            postEntry('http://localhost:8081/addTime', data);
        })
    
        .then(
            TimeUpdateUI
        )
    
    },1000);

    setTimeout(()=>{

      getWiki(wikiBaseURL,lat,lon)
    
      .then(function(data){
  
          console.log('post Wiki - client to server');
          postEntry('http://localhost:8081/addWiki', data);
      })
  
      .then(
          WikiUpdateUI
      )
  
  },1000);
    

}

/* Function to GET Web API Data Weather*/
const getWeatherFC = async (baseURL,city, key)=>{

    const res = await fetch(baseURL+city+key);
    let newData = [];
    try {
      const data = await res.json();

      for (let i= 7; i<14; i++){

        const WeatherData = {
            date: data.data[i].valid_date,
            temp:  data.data[i].temp,
            Wind: data.data[i].wind_spd,
            lat: data.lat,
            lon: data.lon
        };

        //Convert the weather forecast to array
        newData.push(WeatherData);
        console.log(newData)
      }

      return newData;
  
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

/* Function to GET Web API Data IMG*/
const getImg = async (baseURL,city)=>{

    const res = await fetch(baseURL + city);
  
    try {
      const data = await res.json();
      console.log(data.hits[0].webformatURL)
      const newData = { url: data.hits[0].webformatURL }
      
      return newData;
  
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

//function to update the UI with the current Weather report
const WeatherFCupdateUI = async() => {
    const request = await fetch('http://localhost:8081/Wdata');
    try{
        
        const allData = await request.json();
        //console.log('UPDATING UI')
        console.log(allData.weather[0]);
        let fraction = document.createDocumentFragment('div');
        for(const index in allData.weather){

            //document.getElementById('weather').innerHTML
            const newEl = document.createElement('div')
            //newEl.innerHTML = `<div class="weatherItem" >${allData.weather[index].date}<br>${allData.weather[index].temp}  °C<br>${allData.weather[index].Wind} km/h<br></div>`;
            newEl.innerHTML = `<div class="weatherItem" ><div>${allData.weather[index].date}</div><div>${allData.weather[index].temp}  °C</div><div>Wind: ${allData.weather[index].Wind} km/h</div></div>`;
            
            newEl.classList.add('weatherIteamOUTER')
            fraction.appendChild(newEl);
        }
        document.getElementById('weather').innerHTML = "";
        document.getElementById('weather').appendChild(fraction);
    }catch(error){
        console.log("error", error);
      }
}

//function to update the UI with the current Weather report
const IMGupdateUI = async() => {
    const request = await fetch('http://localhost:8081/IMGdata');
    try{
        
        const allData = await request.json();
        console.log('UPDATING UI IMG')
        console.log(allData.url);
        let fraction = document.createDocumentFragment('div');

        //document.getElementById('weather').innerHTML
        const newEl = document.createElement('div')
        newEl.innerHTML = `<div id="newImg" ><img src="${allData.url}" alt="city"></div> `
        newEl.classList.add("ImgOUTER")
        fraction.appendChild(newEl);
        document.getElementById('image').innerHTML = "";
        document.getElementById('image').appendChild(fraction);
    }catch(error){
        console.log("error", error);
      }
}

  /* Function to POST data */
  const postEntry = async ( url = '', data = {})=>{
      console.log(data);
  
      const response = await fetch(url, {
          method: 'POST', //Posts the information (a post function has to be placed on the server side)
          credentials: 'same-origin',
          headers: {
              'Content-Type': 'application/json',
          },
          // Body data type must match "Content-Type" header        
          body: JSON.stringify(data), //makes sure we are dealing with JSON Files and converts the into a string
      });
  
      try {
          const newData = await response.json();
          console.log(newData);
          return newData;        
      }catch(error) {
          console.log("error", error);
      }
  }

/* Function to GET Web API Data Weather for less than a week*/
const getWeatherONE = async (baseURL,city, key)=>{

    const res = await fetch(baseURL+city+key);
    let newData = [];
    try {
      const data = await res.json();

        const WeatherData = {
            date: data.data[0].valid_date,
            temp:  data.data[0].temp,
            Wind: data.data[0].wind_spd,
            lat: data.lat,
            lon: data.lon
        };

        //Convert the weather forecast to array
        newData.push(WeatherData);
        console.log(newData)

      return newData;
  
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}
//function to update the UI with the current Weather report TODAY
const WeatherONEupdateUI = async() => {
    const request = await fetch('http://localhost:8081/Wdata');
    try{
        
        const allData = await request.json();
        //console.log('UPDATING UI') 
        console.log(allData.weather[0]);
        let fraction = document.createDocumentFragment('div');

        //document.getElementById('weather').innerHTML
        const newEl = document.createElement('div')
        newEl.classList.add("weatherONE");
        newEl.innerHTML = `<div class="weatherItemONE" ><div>${allData.weather[0].date}</div><div>${allData.weather[0].temp}  °C</div><div>Wind: ${allData.weather[0].Wind} km/h</div></div>`;
        fraction.appendChild(newEl);
        document.getElementById('weather').innerHTML = "";
        document.getElementById('weather').appendChild(fraction);
    }catch(error){
        console.log("error", error);
      }
    }

    const TimezoneKey = '2d22d6d7428c4ed8b4aa191ac3c1bed3' 
    const TimezoneBaseURL = `https://api.ipgeolocation.io/timezone?apiKey=${TimezoneKey}&`

    /* Function to GET Web API Data Time*/  
    const getTime = async (baseURL, lat, lon)=>{
        
        console.log(baseURL + 'lat=' + lat + '&long=' + lon)
        const res = await fetch(baseURL + 'lat=' + lat + '&long=' + lon);
      
        try {
          const data = await res.json();
          console.log(data.time_12)
          const newData = { time: data.time_12 }

          return newData;
      
        }  catch(error) {
          console.log("error", error);
          // appropriately handle the error
        }
      }
    
    //function to update the UI with the current Weather report
    const TimeUpdateUI = async() => {
        const request = await fetch('http://localhost:8081/TimeData');
        try{
            
            const allData = await request.json();
            console.log('UPDATING UI TIME')
            console.log(allData.time);
            let fraction = document.createDocumentFragment('div');
    
            const newEl = document.createElement('div')
            newEl.innerHTML = `<div id="time_12" >Current Time:<br>${allData.time}</div> `
            newEl.classList.add("time_INNER");
            fraction.appendChild(newEl);
            document.getElementById('time_OUTER').innerHTML = "";
            document.getElementById('time_OUTER').appendChild(fraction);
            
    
        }catch(error){
            console.log("error", error);
          }
    }

/* Function to GET Web API Data Geonames*/
const getWiki = async (baseURL,lat, lng)=>{

  const res = await fetch(baseURL + 'lat=' + lat + '&lng=' + lng + '&username=b1234');

  try {
    const data = await res.json();
    console.log(data)
    const newData = { wiki: data }
    
    return newData;

  }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}

//function to update the UI with a wikipedia article about the city
const WikiUpdateUI = async() => {
  const request = await fetch('http://localhost:8081/wikiData');
  try{
      
      const allData = await request.json();
      console.log('UPDATING UI WIKI')
      console.log(allData.wiki);
      let fraction = document.createDocumentFragment('div');

      //document.getElementById('weather').innerHTML
      const newEl = document.createElement('div')
      newEl.innerHTML = `<div id="newWiki" >${allData.wiki.geonames[0].summary}</div> `
      newEl.classList.add("WikiOUTER")
      fraction.appendChild(newEl);
      document.getElementById('wiki').innerHTML = "";
      document.getElementById('wiki').appendChild(fraction);
  }catch(error){
      console.log("error", error);
    }
}

export { action }
