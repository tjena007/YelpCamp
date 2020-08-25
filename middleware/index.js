var Campground = require("../models/campground")
var Comment = require("../models/comment")

// all middleware goes here

var middlewareObj = {};

middlewareObj.checkUserAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            if (err) {
                req.flash("error", "Something went wrong.Please try again later.");
                res.redirect("back");
            }
            else {
                //does user own campground?
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        })
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Something went wrong.Please try again later.");
                res.redirect("back");
            }
            else {
                //does user own campground?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        })
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    // req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo)
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    req.session.returnTo = req.url;
    res.redirect("/login");
}

module.exports = middlewareObj