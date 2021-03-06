var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyparser = require("body-parser"),
    tkchita    = require("./models/tkchita"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    proUser    = require("./models/proUser"),
    user       =  require("./models/user");


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
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// you forgot the "/" route that's why it didn't work!
app.get("/",function(req, res){
    //res.send("it works now");
    res.redirect("/nagafa");
});


app.get("/nagafa",function(req,res){

    tkchita.find({},function(err,tkchita){
        if(err){
            console.log("there is a problem of finding ");
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
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var obj={description:desc , image: image, price:price,author:author};
    //var obj = {req.body.tkchita, author:author}; //the association with proUser


    proUser.findById(req.user._id,function(err,proUser){
        if(err){
            console.log(err)
        }
        else{
            tkchita.create(obj, function(err,tkchita){
                if(err){
                    console.log("there is an error");
                    console.log(err);
                }else{
                        
                    tkchita.author.id = req.user._id;
                    tkchita.author.username = req.user.username;
                    tkchita.save();
                    proUser.tkchita.push(tkchita);
                    proUser.save();
                    
                    res.redirect("/nagafa");
                    console.log("all is good ");
                   // console.log(obj); see here that the object has the info from the body
                }
            });
        }

    });
    
   
    
});

//profile rout for the proUser
app.get("/profil/:id", function(req, res){
    proUser.findById(req.user._id).populate("tkchita").exec(function(err, tkchita){
        if(err){
            console.log(err);
        }
        else{
            res.render("profilePage",{tkchita:tkchita});
        }}
       
)});

////////////////////////
// AUTHENTICATION ROUTES
////////////////////////
app.get("/register/pro", function(req, res){

    res.render("register");
});

app.post("/register/pro", function(req, res){
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


app.get("/register",function(req,res){
 res.render("registerUser");
});

app.post("/register",function(req,res){
    var newUser = new user({
        username: req.body.username
       
    });
     
    user.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("registerUser");
        }

        passport.authenticate("local")(req,res, function(){
               res.send("u sign up");
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


