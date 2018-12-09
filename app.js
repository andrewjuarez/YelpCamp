//Server variables
var port = 5455;
var host = "0.0.0.0";

// Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// MongoDB Client
const mongoUN = "";
const mongoPW = "";
const mongoCluster = "";
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb+srv://" + mongoUN + ":" + mongoPW + mongoCluster;


app.get("/campgrounds", function(req, res){   
    const dbclient = new MongoClient(mongoURL, { useNewUrlParser: true });

    dbclient.connect(err => {
        const collection = dbclient.db("test").collection("campgrounds");
       // perform actions on the collection object
      
          console.log("Connected to campgrounds collection.");
      
          collection.find({}).toArray(function(err, result){
              if(err){
                  console.log("Error retrieving campgrounds..");
              }
              else if(result.length) {
                  campgrounds = result;
                //   console.log(result);
                //   console.log(campgrounds);

                  // Send the user off to the campgrounds page
                  console.log("Re-directing to campgrounds page.");
                  res.render("campgrounds", {campgrounds: result});
              }
          });
        dbclient.close();
        console.log("Conection closed..");
      });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var imageURL = req.body.image;
    var newCampground = {name:name, image:imageURL};
    campgrounds.push(newCampground);

    const dbclient = new MongoClient(mongoURL, { useNewUrlParser: true });

    dbclient.connect(err => {
        const collection = dbclient.db("test").collection("campgrounds");
      
          console.log("Connected to campgrounds collection.");
      
        // Insert campground into DB
        collection.insertOne(newCampground);
        dbclient.close();
        console.log("Conection closed..");
      });

    // Re-direct
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
});

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(port, host, function(){
    console.log("YelpCamp server started on " + host +":" + port);
});