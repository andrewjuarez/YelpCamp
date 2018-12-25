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
    
    // Add to DB
    Campground.create({name:name, image:imageURL, desc:desc, author: author, rate: rate}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            req.flash("error", "Unable to add campground.");
            console.log(err);
            res.redirect("back");
        } else {
            // Successful, wait then re-direct
            req.flash("success", "Successfully added new campground " + name + "!");
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

    Campground.findById(campgroundID).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No such campground found by id: " + req.params.id);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/found", {campground: foundCampground});
        }
    });
});

// Edit an existing campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground does not exist.");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit",  {campground: foundCampground});    
            }
    });
});

// Update an existing campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            req.flash("error", "Unable to update campground.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Succesfully updated campground.");
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
            req.flash("error", "Unable to delete campground!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Succesfully deleted campground!");
            res.redirect("/campgrounds");
        }
    });
});

// Show confirmation page before deleting a campground.
router.get("/:id/delete", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("flash", "Campground does not exist!");
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