var express = require("express");
var router = express.Router();
var  Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

// ========================
// CAMPGROUNDS ROUTES
// ========================

// SHow all campgrounds in DB
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

// Add a campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    const desc = req.body.desc;
    const author =  {
        id: req.user._id,
        username: req.user.username
    }
    const rate = req.body.rate;
    console.log(rate);
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

// Show the new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Display a campground
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

// Edit an existing campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/edit",  {campground: foundCampground});    
            }
    });
});

// Update an existing campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and destroy the campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Show confirmation page before deleting a campground.
router.get("/:id/delete", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/delete", {campground: campground});
        }
    });    
});

// ========================
//  MIDDLEWARE 
// ========================

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}



module.exports = router;