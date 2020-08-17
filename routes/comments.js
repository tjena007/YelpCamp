var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//================================================
//Comment ROUTES
//show
router.get("/campGrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("comments/new.ejs", { camp: campground });
        }
    })
})

router.post("/campGrounds/:id/comments", isLoggedIn, function (req, res) {
    //look for campground using ID
    Campground.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //create comment
            Comment.create(req.body.comment,
                function (err, comment) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        //add Username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //connect comment to campground
                        comment.save();
                        camp.comments.push(comment);
                        camp.save();
                        //redirect to that campground show page
                        res.redirect("/campgrounds/" + camp._id);
                        // console.log("redirected");
                    }
                })
        }
    });
});

function isLoggedIn(req, res, next) {
    // req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo)
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.url;
    res.redirect("/login");
}

//==========================================================

module.exports = router;