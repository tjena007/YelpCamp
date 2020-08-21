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
//edit route
router.get("/campGrounds/:id/comments/:comment_id/edit", checkCommentAuthentication, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("/campGrounds/:id");
        }
        else {
            res.render("comments/edit.ejs", { comment: foundComment, campid: req.params.id });
        }

    });
})
router.put("/campGrounds/:id/comments/:comment_id", checkCommentAuthentication, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campGrounds/" + req.params.id);
        }
    })
})

//delete comment route
router.delete("/campGrounds/:id/comments/:comment_id", checkCommentAuthentication, function (req, res) {
    //res.send("delete route");
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/campGrounds/" + req.params.id);
        }
        else {
            res.redirect("/campGrounds/" + req.params.id);
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

function checkCommentAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                //does user own campground?
                if (foundComment.author.id.equals(req.user._id)) {
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

//==========================================================

module.exports = router;