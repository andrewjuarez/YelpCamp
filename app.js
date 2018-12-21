//Server variables
const port = 5455,
      host = "0.0.0.0";

// Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Import models
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

// mongoose client
const mongoUN = "",
      mongoPW = "",
      mongoCluster = "",
      mongoose = require('mongoose'),
      mongoURL = "mongodb+srv://" + mongoUN + ":" + mongoPW + mongoCluster;

// connect mongoose client to DB
mongoose.connect(mongoURL, {useNewUrlParser: true});

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Error: Unable to retrieve 'campgrounds':");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
        }
    })
});


app.post("/campgrounds", function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    const desc = req.body.desc;
    
    // Add to DB
    Campground.create({name:name, image:imageURL, desc:desc}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            console.log(err);
        }
    });
      
    
    // Re-direct
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    var campgroundID = req.params.id;
    // console.log("Searching for " + campgroundID);

    Campground.findById(campgroundID).populate("comments").exec(function(err, campground){
        if(err){
            console.log("Campground not found!");
            console.log(err);
            res.render("campgrounds/notfound");
        } else {
            // console.log("Campground found: \n");
            // console.log(campground);
            res.render("campgrounds/found", {campground: campground});
        }
    });

    
});

// ========================
// COMMENTS ROUTES
// ========================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.render("campgrounds/campgrounds")
        } else {
            res.render("comments/new", {campground : campground});
        }
    });

});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.get("/", function(req, res){
    res.render("landing");
});

app.get("*", function(req, res) {
    res.send("404 not found!");
 });

app.listen(port, host, function(){
    console.log("YelpCamp server started on " + host +":" + port);
});