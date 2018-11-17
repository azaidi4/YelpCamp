var router = require("express").Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");


router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, queryResult) {
        if (err){
            console.log(err);
        }
        else {
            res.render("comments/new", {campground : queryResult});
        }
    })
});

router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if (err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }   
            });
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