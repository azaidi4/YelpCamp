var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    campgroundDB = require("./models/campground");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// campgroundDB.create({
//     name: "Granite Hill",
//     image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7656",
//     description: "Lorem ipsum dolor sit amet, sed mutat tritani cu, eam ea utamur definitionem. Ea incorrupte omittantur pri, cu vis admodum expetenda torquatos, quidam labitur."
// }, 
// function(err, campground){
//     if (!err) {
//         console.log(campground);
//     } else {
//         console.log(err);
//     }
// });

app.get("/", function (req, res) {
    res.render("landingPage");
});

app.get("/campgrounds", function(req, res){
    campgroundDB.find({}, function(err, allCampgrounds){
        if(!err) {
             res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    campgroundDB.findById(req.params.id, function (err, queryResult) {
        if (!err) {
            res.render("show", {campground: queryResult});
        } else {
            console.log(err);
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function (){
    console.log("YelpCamp server has started");
});