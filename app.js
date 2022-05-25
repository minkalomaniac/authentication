require('dotenv').config();
const express = require("express");
const ejs = require ("ejs");
const app = express();
const mongoose= require("mongoose");
const encrypt = require("mongoose-encryption");


console.log(process.env.API_KEY);

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

///create new user schema--create from mongoose schema class

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

///add the plugin before defing mongoose model below
//the plugin above will get our  password encrypted as soon as we save(); into database and will get decrypted as soon as we find(); in database below
const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
})


app.get("/login",function(req,res){
  res.render("login");
})


app.get("/register",function(req,res){
  res.render("register");
})



// app.get("/secrets",function(req,res){
//   res.render("secrets");
// })

app.post("/register", function(req,res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
})


app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email: username}, function (err, foundUser){
  if(err){
    console.log(err);
  } else {
    if (foundUser){
    if(foundUser.password=== password){
      res.render("secrets");
    }
  }
}
});
});










app.listen (3000, function(){
  console.log("Server is running on port 3000");
});
