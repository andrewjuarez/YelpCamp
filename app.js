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

// Import models
var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");


// Import routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



// mongoose client
const mongoURL = require("./private/connectionStr"); // Keep the URL,
// credentials, cluster private from Github

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


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // This is available to
// refactor the campground routes. Compare with comments to see difference
app.use(commentRoutes);

// ========================
// Server Listen
// ========================

app.listen(port, host, function(){
    console.log("YelpCamp server started on " + host +":" + port);
});