require('dotenv').config();
//Require all the packages to be used
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    FacebookStrategy = require("passport-facebook").Strategy,
    methodOverride   = require("method-override"),
    Location         = require("./models/location"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds"),
    configAuth       = require("./config/auth");
    
    
var locationRoutes = require("./routes/locations"),
    commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    indexRoutes       = require("./routes/index");

//Connect to Data Base  
mongoose.connect("mongodb://localhost/the_bachelors");

//use/set specific packages
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport config
app.use(require("express-session")({
    secret:"mangoes are super sweet",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require('moment');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
},	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    				newUser.facebook.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }
	));


app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/locations",locationRoutes);
app.use("/locations/:id/comments",commentRoutes);
app.use("/locations/:id/reviews", reviewRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Bachelors has started!");
});