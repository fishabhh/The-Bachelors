var mongoose=require("mongoose");
var Comment = require("./comment");
var Review = require("./review");
//Setting Up Schema
var locationSchema=new mongoose.Schema({
    category:String,
    type:String,
    bathroom:String,
    dimension: String,
    locality:String,
    address:String,
    city:String,
    pinCode:String,
    title:String,
    price:String,
    image:String,
    imageId:String,
    description:String,
    createdAt: { type: Date, default: Date.now },
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username:String
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

//Compiling into an model
module.exports=mongoose.model("Location",locationSchema);