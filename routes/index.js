var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

router.get('/', function(req, res) {
	res.render('landing.ejs');
});

//=================auth routes
router.get('/signup', function(req, res) {
	res.render('signup.ejs');
});

router.post('/signup', function(req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			//console.log(err);
			return res.render('signup.ejs', { error: err.message });
		}
		//return url as well
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Account created successfully!');
			res.redirect('/campgrounds');
		});
	});
});

//login routes
router.get('/login', function(req, res) {
	//console.log(req.flash("error"))
	res.render('login.ejs');
});
router.post(
	'/login',
	passport.authenticate('local', { successReturnToOrRedirect: '/campgrounds', failureRedirect: '/login' }),
	function(req, res) {
		req.flash('success', 'Login Successful');
	}
);

//logout routes
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged you out');
	res.redirect('/');
});

//================================================

module.exports = router;
