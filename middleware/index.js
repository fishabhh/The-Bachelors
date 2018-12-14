var Location= require("../models/location");
var Comment= require("../models/comment");
var middlewareObj={};

middlewareObj.checkLocationOwnerShip= function(req, res, next){
    if(req.isAuthenticated()){
        Location.findById(req.params.id,function(err,foundLocation){
            if(err || !foundLocation){
                req.flash("error","Location not found!");
                res.redirect("back");
            } else {
                //does owner own the location
                if(foundLocation.author.id.equals(req.user._id)){
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
                if(foundComment.author.id.equals(req.user._id)){
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
middlewareObj.isLoggedIn= function(req,res,next){
  if(req.isAuthenticated()){
      return next();
  } else {
      req.flash("error","You need to be logged in to do that!");
      res.redirect("/login");
  }
}

module.exports=middlewareObj;