const express = require("express");
const {BikeDetails} = require('./createDB');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

app.use("/HTML_files",express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/rentBike', (req, res) => {

    res.sendFile(path.join(__dirname, 'HTML_files', "rent_bike.html"));
    }
  );



module.exports = app;