const path = require("path");
const express = require("express");
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");  //<--access the HTML page
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

 //Then setup handlebars engine and views location   
 app.set("view engine", "hbs")  //having a template like header&footer for pages
 app.set('views', viewsPath) 
 hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));


// This is how to create html tags/serve JSON, etc
// app.get("/about", (req, res) => {
//   res.send("<h1>About page</h1>");
// });


app.get("", (req, res) => {
  res.render("index", {
    title: 'Welcome',
    name: 'Pius King'
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Emuraye Oghenerukevwe Pius",
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    name: 'Pius Henry'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address"
    });
  }
  geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      });
    })
  });
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }
  console.log(req.query.search);
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {  //setting what will happen when a wrong page address is used in the help directory
  res.render("404", {
    title: "Error!",
    name: 'Henry Pio',
    errorMessage: "Help page not found",
  });
})

app.get('*', (req, res) => {
  res.render("404", {
    title: "Error!",
    name: "Henry Pio",
    errorMessage: "Page not found",
  });
})

app.listen(port, () => {
  console.log("Server is up on port " + port + ".");
});
