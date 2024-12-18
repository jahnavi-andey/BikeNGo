const express = require("express");
const {BikeDetails} = require('./createDB');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

app.use("/HTML_files",express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/giveRent', (req, res) => {
    // window.addEventListener('DOMContentLoaded', () => {
    // fetch('/api/bikes')
    //   .then(response => response.json())
    //   .then(bikes => {
    //     const bikeList = document.getElementById('bike-list');
    //     bikes.forEach(bike => {
    //       const bikeItem = document.createElement('div');
    //       bikeItem.className = 'bike-item';
    //       bikeItem.innerHTML = `
    //         <img src="${bike.bike_image}" alt="${bike.bike_type}">
    //         <h3>${bike.bike_type}</h3>
    //         <p>Company: ${bike.bike_company}</p>
    //         <p>Owner: ${bike.owner_name}</p>
    //         <p>Price: $${bike.bike_price}</p>
    //       `;
    //       bikeList.appendChild(bikeItem);
    //     });
    //   })
    //   .catch(error => console.error('Error fetching bikes:', error));

    res.sendFile(path.join(__dirname, 'HTML_files', "give_rent.html"));
    }
  );



module.exports = app;