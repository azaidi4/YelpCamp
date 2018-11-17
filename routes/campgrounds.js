var router = require("express").Router(),
    Campground  = require("../models/campground");
    
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(!err) {
             res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
        else {
            console.log(err);
        }
    });
   
});

router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var owner = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, owner: owner};
    Campground.create(newCampground, function (err, newCampground) {
        if (!err) {
            res.redirect("/campgrounds"); 
        }
        else{
            console.log(err);
        }
    });
   
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, queryResult) {
        if (!err) {
            res.render("campgrounds/show", {campground : queryResult});
        } else {
            console.log(err);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        next();
    }
    else {
        res.redirect("/login");
        console.log("You need to log in!");
    }
}

module.exports = router;