var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyparser = require("body-parser"),
    tkchita    = require("./models/tkchita"),
    passport   = require("passport"),
    localStrategy = require("passport-local")
    proUser    = require("./models/proUser");


app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

//connect to the database!
mongoose.connect('mongodb://localhost:27017/negafaProject', {useNewUrlParser: true, useUnifiedTopology: true });

//passport configuration
app.use(require("express-session")({
    secret: "we will be rich someday braDaH!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(proUser.authenticate()));
passport.serializeUser(proUser.serializeUser());
passport.deserializeUser(proUser.deserializeUser());

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
           // console.log(obj); see here that the object has the info from the body
        }
    });
    
});

////////////////////////
// AUTHENTICATION ROUTES
////////////////////////
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new proUser({
        username: req.body.username
        // we gonna add the other data of the proUser later, but know let's just focus on the username ande the password
    });
    proUser.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req,res, function(){
               res.redirect("/nagafa");
        });
    });
});
//Login stuff
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/nagafa",
    failureRedirect: "/login"
})/*this is a middleWare */, function(req, res){
});

//Logout stuff
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/nagafa");
})
////////////////////////
app.listen(3001,function(){
    console.log("server is running successfully!");
});


