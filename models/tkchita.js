var mongoose = require("mongoose");

var tkchitaSchema = new mongoose.Schema({

 description : String,
image: String,
price: Number
});
   

module.exports = mongoose.model("tkchita",tkchitaSchema);