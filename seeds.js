var mongoose   = require("mongoose"),
    Location = require("./models/location"),
    Comment    = require("./models/comment");
var data=[
    {
        name:"Cloud's Mist",
        price:"3200",
        image:"https://images.unsplash.com/photo-1524011788551-dfe58ed93f58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description:"The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."    
    },
    {
        name:"Beach Paradise",
        price:"3200",
        image:"https://images.unsplash.com/photo-1500808611928-71725d628cc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
        description:"The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."    
    },
    {
        name:"Dark Snow",
        price:"3200",
        image:"https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80",
        description:"The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."    
    }
    ];
function seedDB(){
    //Removed all Locations
    Location.remove({},function(err){
        if(err){
            console.log(err);
        }
        //     console.log("removed Locations!");
               //Add Locations
        //     data.forEach(function(seed){
        //     Location.create(seed,function(err,location){
        //     if(err){
        //         console.log(err);
        //     } else {
        //         console.log("Added a Location!");
        //         //Create a comment
        //         Comment.create(
        //             {
        //                 text:"This is a great place to stay:D",
        //                 author:"Homer"
        //             },
        //             function(err,comment){
        //                 if(err){
        //                     console.log(err)
        //                 } else {
        //                     location.comments.push(comment);
        //                     location.save();
        //                     console.log("Created a comment");
        //                 }
        //             });
        //     }
        // });  
    // });
        });
}

module.exports= seedDB;