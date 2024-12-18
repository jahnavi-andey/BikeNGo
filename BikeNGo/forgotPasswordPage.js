const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const path = require('path');

const signInRoute = require('./signInPage');
const DB = require("./createDB");

const app = express();

app.use("/HTML_files", express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));
app.use("/Images", express.static(path.join(__dirname, "Images")));

app.use('/', signInRoute);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/forgotPasswordPage", (req, res) => {
  console.log('inside forgot_pwd_page');
    res.sendFile(path.join(__dirname, "HTML_files", 'forgotPassword.html'));
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "yahnaviarja@gmail.com", // Your email address
    pass: "sfsj gyyv ocui dwkv", // Your email password
  },
});

const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

app.get('/forgot_pwd', (req, res) => {
  console.log('get /forgot pwd');
  res.sendFile(path.join(__dirname, "HTML_files", 'forgotPassword.html'));
});

app.post("/forgot_pwd", (req, res) => {
  console.log("inside create user");
  const { email } = req.body;
  transporter.sendMail(
    {
      from: "yahnaviarja@gmail.com",
      to: email,
      subject: "BikeNGo Email for OTP",
      html: `<h2>Your OTP is : ${otp}</h2>`,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        res.send(`<script>window.location.href = '/otp-verify'</script>`);
      }
    }
  );
});

app.get('/newPassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'HTML_files', 'newPassword.html'));
})
app.post("/newPassword", (req, res) => {
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const { email, password, con_pwd } = req.body;
  if (!email || !password || !con_pwd) {
    res.send(`<script>alert('Enter all the credentials');
      window.location.href = '/newPassword'</>`);
  }
  DB.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.send(`<script>alert("User not found, create an account.")
        window.location.href='./'</script>`);
      }
      else if (password === con_pwd && strongPassword.test(password) ) {
        const old_pwd = user.pwd;
        if (!(old_pwd === password)) {
          user.pwd = password;
          user.save();
          res.send(`<script>alert("password updated successfully.")
        window.location.href='./signIn'</script>`);
        }
        else {
          res.send(`<script>alert("enter a new password different from old password.")
        window.location.href='/newPassword'</script>`);
        }
      }
      else if (!strongPassword.test(password) ) {
         res.send(`<script>alert("Use strong password.")
        window.location.href='/newPassword'</script>`);
      }
    })
    .then(() => {
      console.log('done successfully');
    })
    .catch((err) => {
      console.error("Error changing pwd:", err);
    });
  });

app.get('/otp-verify', (req, res) => {
  res.sendFile(path.join(__dirname, "HTML_files", 'otp_verification.html'));
})
app.post("/otp-verify", (req, res) => {
  const input_otp = req.body;
  const opt_value = input_otp["otp-value"];
  if (!opt_value) {
    res.send(`<script>alert('enter a valid otp');
      window.location.href = '/otp-verify'</script>`);
  }
  console.log(otp);
  console.log(opt_value);
  if (otp === opt_value) {
    console.log("otp === opt_value");
    res.sendFile(path.join(__dirname, "HTML_files", "newPassword.html"));
  } else res.send("wrong otp");
});

module.exports = app;