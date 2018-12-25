//Server variables
const port = 5455,
      host = "0.0.0.0"; // Listen to all hosts

// Dependencies
var express        = require("express"),
    flash          = require("connect-flash"),
    bodyParser     = require("body-parser"),
    mongoose       = require('mongoose'),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override");

// Import User model
var User = require("./models/user");

// Import routes
var indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds");
    

// Define app and set associations
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());



// mongoose client
const mongoURL = require("./private/connectionStr"); // Keep the connection URL hidden from GitHub.

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
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); // Pre-defined to prevent errors when loading pages
    res.locals.success = req.flash("success"); // Pre-defined to prevent errors when loading pages
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