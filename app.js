var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyparser = require("body-parser"),
    tkchita    = require("./models/tkchita");


app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

//connect to the database!
mongoose.connect('mongodb://localhost:27017/negafaProject', {useNewUrlParser: true, useUnifiedTopology: true });


// you forgot the "/" route that's why it didn't work!
app.get("/",function(req, res){
    //res.send("it works now");
    res.redirect("/nagafa");
})


app.get("/nagafa",function(req,res){

    tkchita.find({},function(err,tkchita){
        if(err){
            console.log(err);
            
        }else{
            res.render("nagafa",{tkchita:tkchita});
        }
    });

});


app.get("/nagafa/new",function(req,res){
    res.render("new_tkchita");
});

app.post("/nagafa",function(req,res){
    // var desc = req.body.description;
    // var image = req.body.image;
    // var price = req.body.price;
    
    // var obj={desc:desc , image: image, price:price}
    var obj = req.body.tkchita; //you already did it into an array named tkchita, see the "new_tkchita.ejs"
    
    tkchita.create(obj, function(err,tkchita){
        if(err){
            console.log(err);
        }else{
            res.redirect("/nagafa");
            console.log(obj);
        }
    });
    
});

app.listen(3001,function(){
    console.log("server is running successfully!");
});


