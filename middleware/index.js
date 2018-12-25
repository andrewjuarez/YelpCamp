// Imports needed for middleware
var  Campground = require("../models/campground");
var  Comment    = require("../models/comment");

// Define middleware object
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // Does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) { // Use .equals() b/c comparing a string to an object
                    // True, send them through.
                    next();
                } else {
                    // They do not own it, re-direct user to previous page.
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        // False, the user is not logged in send the user back to the previous page.
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                // Does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) { // Use .equals() b/c comparing a string to an object
                    // True, send them through.
                    next();
                } else {
                    // They do not own it, re-direct user to previous page.
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        // False, send the user back to the previous page.
        req.flash("error", "Please log in first.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please log in first!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;