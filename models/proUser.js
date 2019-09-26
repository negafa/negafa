var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var proUserSchema = new mongoose.Schema({
    userName : String,
    name : String,
    email: String,
    phoneNumber: String,
    adress: String,
    profilePicture: String,
    Description : String,
    city: String,
    profession: String,
    date:  { type: Date, default: Date.now }
})

proUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('proUser',proUserSchema);