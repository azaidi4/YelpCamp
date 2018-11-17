var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"Tilted Towers", 
        image:"https://fortniteintel.com/wp-content/uploads/2018/10/hY9ZEI0-1021x580.jpg", 
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation "
        
    },
    {
        name:"Lucky Landing", 
        image:"https://cdn.images.express.co.uk/img/dynamic/143/590x/Fortnite-Lucky-Landing-925960.jpg", 
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation "
        
    },
    {
        name:"Paradise Palms", 
        image:"https://images2.minutemediacdn.com/image/upload/c_scale,w_912,h_516,c_fill,g_auto/shape/cover/sport/5b6756bf71db48f6c1000001.jpeg", 
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation "
        
    }
]
function seedDB(){
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds");
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campgrounds) {
                if (err) {
                    console.log(err);
                } else {
                  Comment.create({
                      text: "Y youuu no wifi?!",
                      author: "Anon-132"
                  }, function(err, comment) {
                      if (err){
                          console.log(err)
                      } else {
                          campgrounds.comments.push(comment);
                          campgrounds.save();
                          console.log("created new comment")
                      }
                  })
                }
            });
        });
    });
}
module.exports = seedDB;