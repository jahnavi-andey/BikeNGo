const express = require("express");
const path = require("path");
const {User} = require("./createDB");
const signUproute = require("./signUp");

const app = express();

app.use("/", signUproute);

app.use(express.static(path.join(__dirname, "HTML_files")));
app.use(express.static(path.join(__dirname, "CSS_files")));

app.get("/logIn", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML_files", "signIn.html"));
});

app.post("/logIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingEmail = await User.findOne({ email: email });
    
    if (!existingEmail) {
      res.send(`<script>alert('Email Id does not exists. Please Register!!!');
                window.location.href = "/createUser";</script>`);
    } else if (existingEmail.pwd === password) {
      req.session.user = { email };
      res.send(`<script>
              localStorage.setItem('userEmail', '${email}');
              alert('Login Successful !!!');
              window.location.href = "/dashboard";
            </script>`);
    } else {
      res.send(`<script>alert('Wrong Credentials!!!');
                window.location.href = './logIn';</script>`);
    }
  } catch (err) {
    res.status(500).send("wrong password, try again.");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.sendFile(path.join(__dirname, "HTML_files", "dashboard.html"));
  }
  else{
    res.send(`<script>alert('User not logged in!!!');
      window.location.href = './logIn';</script>`);
  }
});



module.exports = app;
