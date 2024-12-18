const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/BikeNGo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./createDB');

app.use(express.static(path.join(__dirname, "Images")));
app.use(express.static(path.join(__dirname, "HTML_files")));
app.use(express.static(path.join(__dirname, "CSS_files")));

app.get('/profile', async (req, res) => {
    const email = req.session.userEmail;
    console.log(email);
    if (email) {
      try {
          const user = await User.findOne({ email: email });
          console.log(user);
        if (user) {
          res.sendFile(path.join(__dirname, "HTML_files", "profile.html"));
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        res.status(500).send("Server error");
      }
    } else {
      res.status(400).send("No email provided");
    }
});

app.get("/profile/data", async (req, res) => {
  const email = req.session.userEmail;
  if (email) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(500).send("Server error");
    }
  } else {
    res.status(400).send("No email provided");
  }
});

app.get('/changeDetails', (req, res) => {
    res.sendFile(path.join(__dirname, "HTML_files", 'changeDetails.html'));
})

app.post('/upload', (req, res) => {
    
})
module.exports = app;