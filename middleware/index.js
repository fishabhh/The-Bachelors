var Location= require("../models/location");
var Comment= require("../models/comment");
var Review = require("../models/review");
var middlewareObj={};

middlewareObj.checkLocationOwnerShip= function(req, res, next){
    if(req.isAuthenticated()){
        Location.findById(req.params.id,function(err,foundLocation){
            if(err || !foundLocation){
                req.flash("error","Location not found!");
                res.redirect("back");
            } else {
                //does owner own the location
                if(foundLocation.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();      
                } else {
                    req.flash("error","You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    } 
}
middlewareObj.checkCommentOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment Not Found!");
                res.redirect("back");
            } else {
                //does owner own the comment
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();      
                } else {
                    req.flash("error","You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("You need to be logged in to do that!");
        res.redirect("back");
    } 
}
middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Location.findById(req.params.id).populate("reviews").exec(function (err, foundLocation) {
            if (err || !foundLocation) {
                req.flash("error", "Location not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundLocation.reviews
                var foundUserReview = foundLocation.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/locations/" + foundLocation._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn= function(req,res,next){
  if(req.isAuthenticated()){
      return next();
  } else {
      req.flash("error","You need to be logged in to do that!");
      res.redirect("/login");
  }
}

module.exports=middlewareObj;