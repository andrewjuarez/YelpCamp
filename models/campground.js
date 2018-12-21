var mongoose = require("mongoose");

// Campground schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
},{
    versionKey: false
});

// campground model
module.exports = mongoose.model("campground", campgroundSchema);