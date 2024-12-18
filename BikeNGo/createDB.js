const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/BikeNGo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pwd: String
});
const BikeDetailsSchema = new mongoose.Schema({
  bike_image: String,
  bike_type: String,
  bike_company: String,
  owner_name: String,
  bike_price: Number,
  owner_email: String,
  owner_number:Number
});
const User = mongoose.model("Info", userSchema);

const BikeDetails = mongoose.model("BikeInfo", BikeDetailsSchema);


module.exports = {
  User,
  BikeDetails,
};
