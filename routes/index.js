var router = require("express").Router(),
    User = require("../models/user"),
    passport = require("passport");

router.get("/", function (req, res) {
    res.render("campgrounds/landingPage");
});

router.get("/login", function(req, res) {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("users/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/logout", function(req, res) {
    req.logout();
    console.log("successfully logged out");
    res.redirect("/campgrounds");
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