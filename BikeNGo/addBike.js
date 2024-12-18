const express = require("express");
const {User,BikeDetails} = require('./createDB');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require("path");
const fs = require('fs');

const app = express();

app.use("/HTML_files",express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));



app.use(bodyParser.urlencoded({ extended: true }));


app.get('/addBike', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML_files', "add_bike.html"));
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/addBike', upload.single('bike_image'), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.user.email });

        const { bike_type, bike_company, owner_name, bike_price } = req.body;
        
        let bike_image = null;
        if (req.file) {
            bike_image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        owner_email = await req.session.user.email
        owner_number =  user.phone
      if (bike_image && bike_type && bike_company && owner_name && bike_price && req.session.user) {
        const newBike = new BikeDetails({ bike_image, bike_type, bike_company, owner_name, bike_price, owner_email, owner_number });
        await newBike.save();
        console.log("Bike registered successfully:", newBike);
        return res.send(`
          <script>
            alert("Bike Added Successfully.");
            window.location.href = "/giveRent";
          </script>
        `);
          }
      }
     catch (error) {
      console.error("Error registering user:", error);
      res.status(500).send("Error registering user");
    }
  })




module.exports = app