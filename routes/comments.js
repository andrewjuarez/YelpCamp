var express = require("express");
var router = express.Router();
var  Campground = require("../models/campground");
var  Comment    = require("../models/comment");
var middleware  = require("../middleware/index.js");

// ========================
// COMMENTS ROUTES
// ========================

// Create comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", "Unable to find campground.");
            res.render("campgrounds/campgrounds")
        } else {
            res.render("comments/new", {campground : campground});
        }
    });

});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", "Unable to locate campground.")
            res.redirect("/campgrounds");
        } else {
            
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Database error adding comment.")
                    console.log(err);
                } else {
                    // Populate comment with current authenticated user
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment to DB
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();

                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit comments
router.get("/campgrounds/:campground_id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.campground_id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground does not exist by specified id: " + req.params.campground_id);
            res.redirect("/campgrounds");
        }
    });
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Unable to locate comment.");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.campground_id, comment: foundComment});   
        }
    });
});

// Update comment
router.put("/campgrounds/:campground_id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            req.flash("error", "Error updating comment");
            res.redirect("back");
        } else {
            req.flash("success", "Succesully updated comment.");
            res.redirect("/campgrounds/" + req.params.campground_id);
        }
    });
});

// Delete Comment
router.delete("/campgrounds/:campground_id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Error retrieving comment.")
            res.redirect("back");
        } else {
            req.flash("error", "Successfully deleted comment.");
            res.redirect("/campgrounds/" + req.params.campground_id);
        }
    });
});

module.exports = router;