var express = require("express");
var router = express.Router();
var  Campground = require("../models/campground");

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


router.post("/", isLoggedIn, function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    const desc = req.body.desc;
    const author =  {
        id: req.user._id,
        username: req.user.username
    }
    const rate = req.body.rate;
    // Add to DB
    Campground.create({name:name, image:imageURL, desc:desc, author: author, rate: rate}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            console.log(err);
        } else {
            // Successful, wait then re-direct
            res.redirect("/campgrounds");
        }
    });
});


router.get("/new", isLoggedIn, function(req, res){
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