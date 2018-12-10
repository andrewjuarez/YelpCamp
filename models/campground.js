var mongoose = require("mongoose");

// Campground schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
},{
    versionKey: false
});

// campground model
module.exports = mongoose.model("campground", campgroundSchema);