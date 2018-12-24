// Imports needed for middleware
var  Campground = require("../models/campground");
var  Comment    = require("../models/comment");

// Define middleware object
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                // Does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) { // Use .equals() b/c comparing a string to an object
                    // True, send them through.
                    next();
                } else {
                    // They do not own it, re-direct user to previous page.
                    res.redirect("back");
                }
                
            }
        });
    } else {
        // False, send the user back to the previous page.
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // Does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) { // Use .equals() b/c comparing a string to an object
                    // True, send them through.
                    next();
                } else {
                    // They do not own it, re-direct user to previous page.
                    res.redirect("back");
                }
                
            }
        });
    } else {
        // False, send the user back to the previous page.
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = middlewareObj;