var express= require("express");
var router = express.Router({mergeParams:true});
var Location= require("../models/location");
var Comment = require("../models/comment");
var middleware= require("../middleware");
//==========================Comments=========================//
//Comments new
router.get("/new",middleware.isLoggedIn,function(req, res) {
    Location.findById(req.params.id,function(err, location) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/New",{location:location});
        }
    });
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req,res){
    Location.findById(req.params.id,function(err, location) {
        if(err) {
            req.flash("error","Something went wrong!");
            console.log(err);
        } else {
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    //Add username and ID to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //Save comment
                    comment.save();
                    location.comments.push(comment);
                    location.save();
                    req.flash("success","Sucessfully added comment");
                    res.redirect("/locations/"+location._id);
                }
            })
        }
    });
});

//Comments edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Location.findById(req.params.id, function(err, foundLocation) {
        if(err || !foundLocation){
            req.flash("error","No Location Found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function(err, foundLocation) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/Edit",{location_id:req.params.id, comment:foundLocation});
        }
    });
    });
});
//comment update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/locations/"+req.params.id);
        }
    });
});

//Comment delete route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comments deleted");
            res.redirect("/locations/"+req.params.id);
        }
    });
});

module.exports=router;