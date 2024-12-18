const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const {User} = require('./createDB');

const app = express();

app.use("/HTML_files",express.static(path.join(__dirname, "HTML_files")));
app.use("/CSS_files", express.static(path.join(__dirname, "CSS_files")));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/signUp', (req,res)=> {
  const filePath = path.join(__dirname, 'HTML_files', "register.html");
  res.sendFile(filePath);
})

//const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

app.get("/createUser", (req, res) => {
  res.sendFile(path.join(__dirname, 'HTML_files', "register.html"));
});
  

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML_files", "register.html"));
});

app.post('/register', async (req, res) => {
  
  try {
    const { name, email, phone, pwd, con_pwd } = req.body;
    console.log(name +' '+email +" "+pwd + " " + con_pwd);
    if (pwd === con_pwd) {
      console.log('pwd == con_pwd');
      const existingPhone = await User.findOne({ phone: phone });
      const existingEmail = await User.findOne({ email: email });
      
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const phoneNumberFormat = /[0-9]{10}/;
      console.log(strongPassword.test(pwd));
      if (existingEmail ) {
        return res.send(`
        <script>
          alert("Already existing email. Please enter a different email.");
          window.location.href = "/register"; // Redirect back to the registration page
        </script>
      `);
      } else if (existingPhone) {
        return res.send(`
        <script>
          alert("Already existing Phone Number. Please enter a different Phone Number.");
          window.location.href = "/register"; 
        </script>
      `);
      } else {
        if (name && email && phone && pwd) {
          if (strongPassword.test(pwd) && phoneNumberFormat.test(phone)) {
            const newUser = new User({ name, email, phone, pwd });
            await newUser.save();
            console.log("User registered successfully:", newUser);
            return res.send(`
        <script>
          alert("Registerd Successfully. Sign In to Website.");
          window.location.href = "/";
        </script>
      `);
          }
        }
        else if (!name || !phone || !email || !pwd) {
          return res.send(`
        <script>
          alert("Enter valid credentials and then register.");
          window.location.href = "/register";
        </script>
      `);
        }
        else 
          return res.send(`
        <script>
          alert("Enter a strong Password.");
          window.location.href = "/register";
        </script>
      `);
      }
    }
    else {
      res.sendFile(path.join(__dirname, "HTML_files", 'register.html'));
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
})
module.exports = app;

// 4027F666251DFC2FF62A53B1318B4F3AFA8B
// 79ae3f9e-2838-41fc-a3c6-aa7127b2032b