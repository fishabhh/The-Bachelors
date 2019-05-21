var mongoose= require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    // local:{
        username:{type: String, unique: true, required: true},
        password:String,
        firstName:String,
        lastName:String,
        email:{type: String, unique: true, required: true},
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        phone:Number,
        isAdmin:{type :Boolean , default:false }
//     },
//     facebook: {
// 		id: String,
// 		token: String,
// 		email: String,
// 		name: String
//     },
//     google: {
// 		id: String,
// 		token: String,
// 		email: String,
// 		name: String
// 	}
    });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);