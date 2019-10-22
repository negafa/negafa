var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var proUserSchema = new mongoose.Schema({
    
    userName : String,
    password:String,
    name : String,
    email: String,
    phoneNumber: String,
    adress: String,
    profilePicture: String,
    Description : String,
    city: String,
    profession: String,
    date:  { type: Date, default: Date.now },
    tkchita:
            [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tkchita"
           }]
       
     

   
    
});

proUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("proUser", proUserSchema );