var express = require("express");
var router = express.Router();
var  Campground = require("../models/campground")
var  Comment    = require("../models/comment")

// ========================
// COMMENTS ROUTES
// ========================

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.render("campgrounds/campgrounds")
        } else {
            res.render("comments/new", {campground : campground});
        }
    });

});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            
            Comment.create(req.body.comment, function(err, comment){
                if(err){
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
router.get("/campgrounds/:campground_id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.campground_id, comment: foundComment});   
        }
    });
});

// Update comment
router.put("/campgrounds/:campground_id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.campground_id);
        }
    });
});

// Delete Comment
router.delete("/campgrounds/:campground_id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.campground_id);
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

function checkCommentOwnership(req, res, next){
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

module.exports = router;