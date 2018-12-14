var mongoose=require("mongoose");
//Setting Up Schema
var locationSchema=new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
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
    }]
});

//Compiling into an model
module.exports=mongoose.model("location",locationSchema);