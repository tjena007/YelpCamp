var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing.ejs");
});


//=================auth routes
router.get("/signup", function (req, res) {
    res.render("signup.ejs")
})

router.post("/signup", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            // alert("please signup");
            res.render("signup.ejs")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect('/campgrounds')
        })
    })
})
//login routes
router.get("/login", function (req, res) {
    res.render("login.ejs")
})
router.post("/login", passport.authenticate("local", { successReturnToOrRedirect: '/campgrounds', failureRedirect: '/login' }), function (req, res) {
})

//logout routes
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
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
//================================================

module.exports = router