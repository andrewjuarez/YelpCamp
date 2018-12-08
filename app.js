//Server variables
var port = 5455;
var host = "localhost";

var express = require("express");
var app = express();
app.set("view engine", "ejs");

app.get("/campgrounds", function(req, res){
    var campsites = [
        {name: "Utah", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f4c378a2e4b1b8_340.jpg"},
        {name: "Idaho", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144591f2c07caee9b5_340.jpg"},
        {name: "Montana", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f4c378a2e4b1b8_340.jpg"}
    ];
    
    res.render("campgrounds", {campgrounds: campsites});
});

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(port, host, function(){
    console.log("YelpCamp server started..");
});