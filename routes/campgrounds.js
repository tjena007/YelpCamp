var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

//index route
router.get("/campGrounds", function (req, res) {
    //using array
    // res.render("campground.ejs", { camps: campGrounds });

    //using database
    Campground.find({}, function (err, allcampGrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index.ejs", { camps: allcampGrounds });
        }
    })
});

//create route
router.post("/campGrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    // campGrounds.push(newCampground);

    //create campground and save to db
    Campground.create(newCampground, function (err, newcreated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campGrounds");
        }
    });
});

//new rouute
router.get("/campGrounds/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

//show route -- shouold be declared at the end
router.get("/campGrounds/:id", function (req, res) {

    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("campgrounds/show.ejs", { camp: foundCampground });
        }
    })
})

function isLoggedIn(req, res, next) {
    // req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo)
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.url;
    res.redirect("/login");
}

module.exports = router;