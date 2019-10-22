var mongoose = require("mongoose");

var tkchitaSchema = new mongoose.Schema({

 description : String,
image: String,
price: String ,//it's better tobe a string cause we won't do any math stuff
author:{
   id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"proUser"
    },
    username:String
}


});
   

module.exports = mongoose.model("tkchita",tkchitaSchema);