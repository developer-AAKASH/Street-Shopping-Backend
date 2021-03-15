const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
require('dotenv').config();

// Creating our App.
const app = express();

// This section is also import some files but this files are mainly written by us
// for e.g. below file is routes file for employee routes which we have write...
const authenticationRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");

// Basic route which listen the application on "/" 
app.get("/", ( req, res )=>{
    res.send("Hello ");
});

// This is basically we are attaching middlewares to our applications....
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( fileUpload() );
app.use( cookieParser() );

app.get("/", (req, res)=>{
    res.send("Welcome to Street-Shopping...");
});

app.use( "/api", authenticationRoutes);
app.use( "/api", userRoutes );


app.listen( process.env.PORT || 3000, ()=>{
    console.log("App is running...");
});