var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post("/campGrounds", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, price: price, image: image, description: description, author: author };
    // campGrounds.push(newCampground);

    //create campground and save to db
    Campground.create(newCampground, function (err, newcreated) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Campground successfully created!");
            res.redirect("/campGrounds");
        }
    });
});

//new rouute
router.get("/campGrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});


//EDIT ROUTE
router.get("/campGrounds/:id/edit", middleware.checkUserAuthentication, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        res.render("campgrounds/edit.ejs", { camp: foundCamp });
    });
})
//Update Route
router.put("/campGrounds/:id", middleware.checkUserAuthentication, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            req.flash("error", "Some error happened.Please try again later.");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Successfully updated!");
            res.redirect("/campGrounds/" + req.params.id);
        }
    })
})

//show route -- shouold be declared at the end
router.get("/campGrounds/:id", function (req, res) {

    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            req.flash("error", "Some error happened.Please try again later.");
            console.log(err)
        }
        else {
            res.render("campgrounds/show.ejs", { camp: foundCampground });
        }
    })
})

//DELETE ROUTE
router.delete("/campGrounds/:id", middleware.checkUserAuthentication, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Some error happened.Please try again later.");
            res.redirect("/campGrounds/" + req.params.id);
        }
        else {
            req.flash("success", "Campground deleted");
            res.redirect("/campGrounds");
        }
    })
})

module.exports = router;