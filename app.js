var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    campgroundDB = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("campgrounds/landingPage");
});

app.get("/campgrounds", function(req, res){
    campgroundDB.find({}, function(err, allCampgrounds){
        if(!err) {
             res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
        else {
            console.log(err);
        }
    });
   
});

app.post("/campgrounds", function (req, res) {
    console.log(req.body);
    campgroundDB.create(req.body, function (err, newCampground) {
        if (!err) {
            res.redirect("/campgrounds"); 
        }
        else{
            console.log(err);
        }
    });
   
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
    campgroundDB.findById(req.params.id).populate("comments").exec(function (err, queryResult) {
        if (!err) {
            res.render("campgrounds/show", {campground : queryResult});
        } else {
            console.log(err);
        }
    });
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
    campgroundDB.findById(req.params.id, function (err, queryResult) {
        if (err){
            console.log(err);
        }
        else {
            res.render("comments/new", {campground : queryResult});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    campgroundDB.findById(req.params.id, function(err, campground) {
        if (err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err){
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

app.listen(process.env.PORT, process.env.IP, function (){
    console.log("YelpCamp server has started");
});