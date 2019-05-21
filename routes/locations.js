var express= require("express");
var router = express.Router();
var Location= require("../models/location");
var Comment = require("../models/comment");
var Review = require("../models/review");
var middleware= require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'fishabhh', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//Index
router.get("/",function(req,res){
    var noMatch = null;
    var perPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    if(req.query.locality || req.query.category || req.query.type) {
        
        const searchLocality = new RegExp(escapeRegex(req.query.locality), 'gi');
        const searchCategory = new RegExp(escapeRegex(req.query.category), 'gi');
        const searchType = new RegExp(escapeRegex(req.query.type), 'gi');
        
        if(req.query.locality!== null){
            
            if(req.query.category!=='All' && req.query.type!=='All'){
                // Get all campgrounds from DB
                Location.find({ locality: searchLocality, type: searchType, category: searchCategory}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                    Location.count({locality: searchLocality, type: searchType, category: searchCategory}).exec(function (err, count) {
                            if(err){
                                console.log(err);
                                    } else {
                            if(allLocations.length < 1) {
                                noMatch = "No Properties match that query, please try again.";
                          }
                          res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
                       }
                    });
            });
            }
            // eval(require("locus"));
            if(req.query.category=='All' && req.query.type!=='All'){
                // Get all campgrounds from DB
                Location.find({ locality: searchLocality, type: searchType}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                    Location.count({locality: searchLocality, type: searchType}).exec(function (err, count) {
                        if(err){
                            console.log(err);
                                } else {
                        if(allLocations.length < 1) {
                            noMatch = "No Properties match that query, please try again.";
                        }
                        res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
                    }
                    });    
            });
            }
            if(req.query.category!=='All' && req.query.type=='All'){
                // Get all campgrounds from DB
                Location.find({ locality: searchLocality, category: searchCategory}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                     Location.count({locality: searchLocality, category: searchCategory}).exec(function (err, count) {    
                        if(err){
                            console.log(err);
                                } else {
                        if(allLocations.length < 1) {
                            noMatch = "No Properties match that query, please try again.";
                      }
                      res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
                   }
                });   
            });
            }
            if(req.query.category=='All' && req.query.type=='All'){
                // Get all campgrounds from DB
                Location.find({ locality: searchLocality}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                     Location.count({locality: searchLocality}).exec(function (err, count) {
                            if(err){
                                console.log(err);
                                } else {
                                if(allLocations.length < 1) {
                                noMatch = "No Properties match that query, please try again.";
                                    }
                                res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
                                }
                     });                
            });
            }
        } else {
            if(req.query.category!=='All' && req.query.type!=='All'){
            // Get all campgrounds from DB
            Location.find({type: searchType, category: searchCategory}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                 Location.count({type: searchType, category: searchCategory}).exec(function (err, count) {    
                    if(err){
                        console.log(err);
                            } else {
                    if(allLocations.length < 1) {
                        noMatch = "No Properties match that query, please try again.";
                  }
                  res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
               }
            });   
        });
        }
        // eval(require("locus"));
        if(req.query.category=='All' && req.query.type!=='All'){
            // Get all campgrounds from DB
            Location.find({type: searchType}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                Location.count({type: searchType}).exec(function (err, count) {    
                    if(err){
                        console.log(err);
                            } else {
                    if(allLocations.length < 1) {
                        noMatch = "No Properties match that query, please try again.";
                  }
                  res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
               }
            });   
        });
        }
        if(req.query.category!=='All' && req.query.type=='All'){
            // Get all campgrounds from DB
            Location.find({category: searchCategory}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allLocations){
                Location.count({category: searchCategory}).exec(function (err, count) {
                    if(err){
                        console.log(err);
                            } else {
                    if(allLocations.length < 1) {
                        noMatch = "No Properties match that query, please try again.";
                  }
                  res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
               }
            });   
        });
        }
    }
    } else {
    //Get all locations from DB
    Location.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allLocations){
         Location.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } else {
                 //Rendering locations Template
                res.render("locations/INDEX",{locations:allLocations, noMatch: noMatch ,current: pageNumber,pages: Math.ceil(count / perPage)});
            }
         });    
    });
    }
});

//New
router.get("/new",middleware.isLoggedIn,function(req, res) {
    //Rendering new template
    res.render("locations/New");
});

//CREATE - add new location to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
        // add cloudinary url for the image to the campground object under image property
        req.body.location.image = result.secure_url;
        // add image's public_id to campground object
        req.body.location.imageId = result.public_id;   
 
      // add author to campground
      req.body.location.author = {
        id: req.user._id,
        username: req.user.username
      }
      Location.create(req.body.location, function(err, location) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/locations/' + location.id);
      });
    });
});
//Show
// SHOW - shows more info about one location
router.get("/:id", function (req, res) {
    //find the location with provided ID
    Location.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundLocation) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that location
            res.render("locations/SHOW", {location: foundLocation});
        }
    });
});

//Edit
router.get("/:id/edit",middleware.checkLocationOwnerShip,function(req,res){
        Location.findById(req.params.id,function(err,foundLocation){
        res.render("locations/Edit",{location:foundLocation});      
});
});

//update
router.put("/:id",middleware.checkLocationOwnerShip, upload.array('image',4), function(req, res){
    // delete req.body.location.rating;
    Location.findById(req.params.id, async function(err, location){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(location.imageId);
                  var result =await cloudinary.v2.uploader.upload(req.file.path);
                //   eval(require("locus"));
                    location.imageId = result.public_id;
                    location.image = result.secure_url;   
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            location.type=req.body.updatedlocation.type;
            location.category=req.body.updatedlocation.category;
            location.bathroom=req.body.updatedlocation.bathroom;
            location.dimension=req.body.updatedlocation.dimension;
            location.locality=req.body.updatedlocation.locality;
            location.address=req.body.updatedlocation.address;
            location.city=req.body.updatedlocation.city;
            location.pinCode=req.body.updatedlocation.pinCode;
            location.title=req.body.updatedlocation.title;
            location.price=req.body.updatedlocation.price;
            location.description=req.body.updatedlocation.description;
            location.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/locations/" + location._id);
        }
    });
});
//Delete or Destroy
router.delete('/:id',middleware.checkLocationOwnerShip, function(req, res) {
  Location.findById(req.params.id, async function(err, location) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        
        await cloudinary.v2.uploader.destroy(location.imageId);
        Comment.remove({"_id": {$in: location.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/locations");
                }
                // deletes all reviews associated with the location
                Review.remove({"_id": {$in: location.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/locations");
                    }
                });
        });
        location.remove();
        req.flash('success', 'Location deleted successfully!');
        res.redirect('/locations');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;
