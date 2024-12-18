const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');

const port = 3030;
const {BikeDetails} = require("./createDB");
const signUproute = require("./signUp");
const signInroute = require("./signInPage");
const forgotPasswordPage = require("./forgotPasswordPage");
const addBikeroute = require("./addBike");
const giveRentroute = require("./giveRent");
const rentBikeroute = require("./rentBike");
const profileRouter = require("./profilePage");

app.use("/HTML_files", express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));
app.use("/Images", express.static(path.join(__dirname, "Images")));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "HTML_files", "index.html");
  res.sendFile(filePath);
});

app.get("/signIn", (req, res) => {
  console.log("inside signIn page but not in fpwd");
  const signInFilePath = path.join(__dirname, "HTML_files", "signIn.html");
  res.sendFile(signInFilePath);
});

app.get('/api/bikes', async (req, res) => {
  try {
      const bikes = await BikeDetails.find();
      
      res.json(bikes);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
  });



app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true in production
}));

app.use("/", signUproute);
app.use("/", signInroute);
app.use("/", forgotPasswordPage);
app.use("/", addBikeroute);
app.use("/", giveRentroute);
app.use("/", rentBikeroute);
app.use("/", profileRouter)

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
