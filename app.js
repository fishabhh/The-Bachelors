//Require all the packages to be used
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    Location       = require("./models/location"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds");
    
    
var locationRoutes = require("./routes/locations"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

//Connect to Data Base  
mongoose.connect("mongodb://localhost/tb_final");

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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});
app.use(indexRoutes);
app.use("/locations",locationRoutes);
app.use("/locations/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Bachelors has started!");
});