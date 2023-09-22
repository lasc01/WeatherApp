const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // Import the 'https' module
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
 
  let cityName = req.body.cityName;
  let cityUpper = cityName.slice(0,1).toUpperCase()
  let cityLower = cityName.slice(1, cityName.length).toLowerCase()
  cityName = cityUpper + cityLower;
  const apiKey = "a6f054d979f364e4079b1ad144da3bfa";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

  // Make an HTTP GET request to the OpenWeather API
  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const des = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      // Create an HTML template with the weather information
      const htmlResponse = `
        <html>
          <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="css/styles.css">
            <script src="https://kit.fontawesome.com/e077ff1add.js" crossorigin="anonymous"></script>
            <title>Weather App</title>
            <style>
              /* Center the content both horizontally and vertically */
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh; /* Use the full viewport height */
                background-color: lightblue;
              }

              /* Style for the weather information */
              h1, h2 {
                text-align: center;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <h1>The weather description in ${cityName} is ${des}.</h1>
            <h2>The temperature in ${cityName} is ${temp}°C.</h2>
            <img src="${imgURL}" alt="Weather Icon">
            <a href="/weatherApp.html">
          <button type="button" class="btn btn-outline-primary weather-btn">Go back to App</button>
        </a>
          </body>
        </html>
      `;

      res.send(htmlResponse); // Send the HTML response to the client
    });
  });
});

app.listen(port, function () {
  console.log("Server is running on port " + port);
});

