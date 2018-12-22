var express = require("express");
var router = express.Router();
var  Campground = require("../models/campground")
var  Comment    = require("../models/comment")

// ========================
// CAMPGROUNDS ROUTES
// ========================

router.get("/", function(req, res){
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


router.post("/", function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    const desc = req.body.desc;
    
    // Add to DB
    Campground.create({name:name, image:imageURL, desc:desc}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            console.log(err);
        } else {
            // Successful, wait then re-direct
            res.redirect("/campgrounds");
        }
    });
});


router.get("/new", function(req, res){
    res.render("campgrounds/new");
});


router.get("/:id", function(req, res){
    var campgroundID = req.params.id;

    Campground.findById(campgroundID).populate("comments").exec(function(err, campground){
        if(err){
            console.log("Campground not found!");
            console.log(err);
            res.render("campgrounds/notfound");
        } else {
            res.render("campgrounds/found", {campground: campground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;