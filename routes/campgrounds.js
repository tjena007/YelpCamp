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
router.post("/campGrounds", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author };
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


//EDIT ROUTE
router.get("/campGrounds/:id/edit", checkUserAuthentication, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        res.render("campgrounds/edit.ejs", { camp: foundCamp });
    });
})
//Update Route
router.put("/campGrounds/:id", checkUserAuthentication, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campGrounds/" + req.params.id);
        }
    })
})

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

//DELETE ROUTE
router.delete("/campGrounds/:id", checkUserAuthentication, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/campGrounds/" + req.params.id);
        }
        else {
            res.redirect("/campGrounds");
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
function checkUserAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            if (err) {
                res.redirect("back");
            }
            else {
                //does user own campground?
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        })
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;