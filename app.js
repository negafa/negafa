var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyparser = require("body-parser"),
    tkchita    = require("./models/tkchita");


app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");






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
    var desc = req.body.description;
    var image = req.body.image;
    var price = req.body.price;
    
    var obj={desc:desc , image: image, price:price}
    
    tkchita.create(obj, function(err,tkchita){
        if(err){
            console.log(err);
        }else{
            res.redirect("/nagafa");
        }
    });
    
});

app.listen(3001,"localhost");


