var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rand secret phrase of your choice",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ROUTES

app.get("/", function (req, res) {
    res.render("campgrounds/landingPage");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
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
    Campground.create(req.body, function (err, newCampground) {
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
    Campground.findById(req.params.id).populate("comments").exec(function (err, queryResult) {
        if (!err) {
            res.render("campgrounds/show", {campground : queryResult});
        } else {
            console.log(err);
        }
    });
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function (err, queryResult) {
        if (err){
            console.log(err);
        }
        else {
            res.render("comments/new", {campground : queryResult});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
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

app.get("/login", isLoggedIn, function(req, res) {
    res.render("users/login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {});

app.get("/register", function(req, res) {
    res.render("users/register");
});

app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render("users/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/logout", function(req, res) {
    req.logout();
    console.log("successfully logged out");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
        next();
    }
    else {
        
        res.redirect("/campgrounds");
        console.log("You're already logged in!");
    }
}
app.listen(process.env.PORT, process.env.IP, function (){
    console.log("YelpCamp server has started");
});