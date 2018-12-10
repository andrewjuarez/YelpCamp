//Server variables
const port = 5455,
      host = "0.0.0.0";

// Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// mongoose client
const mongoUN = "ycuser",
      mongoPW = "DKYr0eWs92Np",
      mongoCluster = "@yelpcamp-nl3st.mongodb.net/test",
      mongoose = require('mongoose'),
      mongoURL = "mongodb+srv://" + mongoUN + ":" + mongoPW + mongoCluster;

// connect mongoose client to DB
mongoose.connect(mongoURL, {useNewUrlParser: true});

// Campground schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
},{
    versionKey: false
});

// campground model
var Campground = mongoose.model("campground", campgroundSchema);

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Error: Unable to retrive 'campgrounds':");
            console.log(err);
        } else {
            
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    })
});

app.post("/campgrounds", function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    
    // Add to DB
    Campground.create({name:name, image:imageURL}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            console.log(err);
        }
    });
      
    
    // Re-direct
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
});

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(port, host, function(){
    console.log("YelpCamp server started on " + host +":" + port);
});