var express= require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");
var Location=require("../models/location");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");
//Index
router.get("/",function(req,res){
    //Get all locations from DB
    Location.find({},function(err,allLocations){
        if(err){
            console.log(err);
        } else {
             //Rendering locations Template
            res.render("LANDING",{locations:allLocations, page: 'LANDING'});
        }
    }).sort({createdAt:-1}).limit(6);
});

//===============Auth routes==================
//Show Signup Form
router.get("/register",function(req, res) {
    res.render("REGISTER", {page: 'REGISTER'});
});
//Handling User Signup
router.post("/register",function(req, res) {
    var newUser = new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phone:req.body.phone
        });
     if(req.body.adminCode === 'secretcode123') {
      newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("REGISTER", {error: err.message});
        } else {
                passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to The Bachelors "+user.username);    
                res.redirect("/");
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

//Facebook Routes
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

//Google routes
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/',
	                                      failureRedirect: '/' }));

// forgot password
router.get('/forgot', function(req, res) {
  res.render('FORGOT');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'rishabhurvi@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'rishabhurvi@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('RESET', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'rishabhurvi@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'rishabhurvi@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/locations');
  });
});
//Users Profile
router.get("/users/:id",function(req, res) {
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("/");
        } else {
            Location.find().where("author.id").equals(foundUser._id).exec(function(err,locations){
                if(err){
                    req.flash("error","Something went wrong!");
                    res.redirect("/");
                } else {         
                    res.render("users/show",{user:foundUser,locations:locations});
                }
            });
        }
    });
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
