var express= require("express");
var router = express.Router();
var Location= require("../models/location");
var middleware= require("../middleware");

//Index
router.get("/",function(req,res){
    //Get all locations from DB
    Location.find({},function(err,allLocations){
        if(err){
            console.log(err);
        } else {
             //Rendering locations Template
            res.render("locations/Index",{locations:allLocations, page: 'locations'});
        }
    });
});

//New
router.get("/new",middleware.isLoggedIn,function(req, res) {
    //Rendering new template
    res.render("locations/New");
});

//Create
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to locations array
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newLocations={name:name,price:price,image:image,description:desc, author:author};
    //Create and Save to DB
    Location.create(newLocations,function(err,newlocs){
        if(err){
            console.log(err);
        } else {
            //redirect to locations page to show updated locations
            res.redirect("/locations");
        }
    });
});

//Show
router.get("/:id",function(req, res) {
    //find the location with that id
    Location.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err || !found){
            req.flash("error","Location Not Found!");
            res.redirect("back");
        }
        else{
            console.log(found);
            res.render("locations/Show",{location:found});
        }
    });
});

//Edit
router.get("/:id/edit",middleware.checkLocationOwnerShip,function(req,res){
        Location.findById(req.params.id,function(err,foundLocation){
        res.render("locations/Edit",{location:foundLocation});      
});
});
//Update
router.put("/:id",middleware.checkLocationOwnerShip,function(req,res){
    Location.findByIdAndUpdate(req.params.id,req.body.updatedlocation, function(err,updatedLocations){
        if(err) {
            res.redirect("/locations");
        } else {
            res.redirect("/locations/"+req.params.id);
        }
    });
});
//Delete or Destroy
router.delete("/:id",middleware.checkLocationOwnerShip,function(req,res){
    Location.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
        }
    });
});

module.exports=router;
