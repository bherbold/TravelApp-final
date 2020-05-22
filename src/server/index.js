//for envirment , API private key should not be on github
const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

// setting up the API
var aylien = require("aylien_textapi")
var textapi = new aylien({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
  })

const app = express()
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
app.use(bodyParser.urlencoded({
  extended: true
}))

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log('app listening on port 8081!')
})

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})


//TEST
const appTEST = require("../client/js/app");
appTEST.get('/test', function (req, res) {
  res.json(mockAPIResponse);
})

//stores WeatherData
var weatherData={};
//stores Image URL
var ImgURL = {};
//stores Time Data
var timeData = {};
//stores Wiki Data
var wikiData = {};

app.post('/api', async (req, res) => {
  const { formText } = req.body;
  console.log(formText);

  const response = await fetch('https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=4f2f2c2281cd49559f9b5cb5f8e19e43');

  try {
    const data = await response.json();
    console.log(data);
    res.send(data);

  }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }


})

app.post('/addWeather',(req,res) =>{
  console.log("Weather reached server")
  console.log(req.body);
  weatherData = req.body;
  console.log('WEATHER POST');
  res.end('END')
});

//GET ROUTE WEATHER
app.get('/Wdata', (req,res)=>{
  res.send(weatherData)
  console.log('GET REQUEST WEATHER')

});

//GET ROUTE IMG
app.get('/IMGdata', (req,res)=>{
  res.send(ImgURL)
  console.log('GET REQUEST IMG')

});

app.post('/addImg',(req,res) =>{
  console.log("Img reached server")
  console.log(req.body);
  ImgURL = req.body;
  console.log('IMG POST WEATHER');
  res.end('END')
});

//POST Time
app.post('/addTime',(req,res) =>{
  console.log("Time reached server")
  console.log(req.body);
  timeData = req.body;
  console.log('TIME POST');
  res.end('END')
});

//GET ROUTE WEATHER
app.get('/TimeData', (req,res)=>{
  res.send(timeData)
  console.log('GET REQUEST TIME')

});

//POST Time
app.post('/addWiki',(req,res) =>{
  console.log("Wiki reached server")
  console.log(req.body);
  wikiData = req.body;
  console.log('WIKI POST');
  res.end('END')
});

//GET ROUTE WEATHER
app.get('/wikiData', (req,res)=>{
  res.send(wikiData)
  console.log('GET REQUEST WIKI')

});


