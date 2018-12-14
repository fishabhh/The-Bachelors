var express= require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");
//Root Route
router.get("/",function(req,res){
    //Rendering landing template
    res.render("landing");
});
//===============Auth routes==================
//Show Signup Form
router.get("/register",function(req, res) {
    res.render("register", {page: 'register'});
});
//Handling User Signup
router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
                passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to The Bachelors "+user.username);    
                res.redirect("/locations");
            });
        }
    });
});
//Login routes
router.get("/login",function(req, res) {
    res.render("login", {page: 'login'});
});

//Login Logic
router.post("/login",passport.authenticate("local",{
    successRedirect :"/locations",
    failureRedirect :"/login"
}),function(req,res){
});

//Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Logged you out!")
    res.redirect("/locations");
});

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  } else {
      res.redirect("/login");
  }
}

module.exports=router;
