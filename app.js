//Server variables
const port = 5455,
      host = "0.0.0.0";

// Dependencies
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    passport   = require("passport"),
    LocalStrategy = require("passport-local");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Import models
var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");

// mongoose client
const mongoUN = "",
      mongoPW = "",
      mongoCluster = "",
      mongoURL = "mongodb+srv://" + mongoUN + ":" + mongoPW + mongoCluster;

// Passport config
app.use(require("express-session")({
    secret: "Once upon a time there was a princess named Whiskers",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser =  req.user;
    next();
});

// connect mongoose client to DB
mongoose.connect(mongoURL, {useNewUrlParser: true});

// ========================
// CAMPGROUNDS ROUTES
// ========================

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Error: Unable to retrieve 'campgrounds':");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
        }
    })
});


app.post("/campgrounds", function(req, res){
    const name = req.body.name;
    const imageURL = req.body.image;
    const desc = req.body.desc;
    
    // Add to DB
    Campground.create({name:name, image:imageURL, desc:desc}, function(err, campground) {
        if(err){
            console.log("ERROR: Adding campground to DB:");
            console.log(err);
        } else {
            // Successful, wait then re-direct
            res.redirect("/campgrounds");
        }
    });
      
    
    
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    var campgroundID = req.params.id;

    Campground.findById(campgroundID).populate("comments").exec(function(err, campground){
        if(err){
            console.log("Campground not found!");
            console.log(err);
            res.render("campgrounds/notfound");
        } else {
            res.render("campgrounds/found", {campground: campground});
        }
    });

    
});

// ========================
// AUTHENTICATION ROUTES
// ========================

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login",  function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {   
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    res.send("Login please!");
});

// Logout Route

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

// ========================
// COMMENTS ROUTES
// ========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.render("campgrounds/campgrounds")
        } else {
            res.render("comments/new", {campground : campground});
        }
    });

});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// ========================
// STANDARD ROUTES
// ========================

app.get("/", function(req, res){
    res.render("landing");
});

app.get("*", function(req, res) {
    res.send("404 not found!");
 });

// ========================
// Server Listen
// ========================

app.listen(port, host, function(){
    console.log("YelpCamp server started on " + host +":" + port);
});