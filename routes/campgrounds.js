var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

var geocoder = NodeGeocoder(options);

//index route
router.get('/campGrounds', function(req, res) {
	//using array
	// res.render("campground.ejs", { camps: campGrounds });

	//using database
	Campground.find({}, function(err, allcampGrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index.ejs', { camps: allcampGrounds });
		}
	});
});

//CREATE - add new campground to DB
router.post('/campGrounds', middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {
			name: name,
			image: image,
			description: desc,
			author: author,
			location: location,
			lat: lat,
			lng: lng
		};
		// Create a new campground and save to DB
		Campground.create(newCampground, function(err, newlyCreated) {
			if (err) {
				console.log(err);
			} else {
				//redirect back to campgrounds page
				console.log(newlyCreated);
				res.redirect('/campgrounds');
			}
		});
	});
});

//new rouute
router.get('/campGrounds/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new.ejs');
});

//EDIT ROUTE
router.get('/campGrounds/:id/edit', middleware.checkUserAuthentication, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCamp) {
		res.render('campgrounds/edit.ejs', { camp: foundCamp });
	});
});

// UPDATE CAMPGROUND ROUTE
router.put('/campGrounds/:id', middleware.checkUserAuthentication, function(req, res) {
	//console.log('body--->' + req.body.campground);
	geocoder.geocode(req.body.campground.location, function(err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		//console.log(req.body.campground);
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				req.flash('success', 'Successfully Updated!');
				res.redirect('/campgrounds/' + campground._id);
			}
		});
	});
});

//show route -- shouold be declared at the end
router.get('/campGrounds/:id', function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			req.flash('error', 'Some error happened.Please try again later.');
			console.log(err);
		} else {
			res.render('campgrounds/show.ejs', { camp: foundCampground });
		}
	});
});

//DELETE ROUTE
router.delete('/campGrounds/:id', middleware.checkUserAuthentication, function(req, res) {
	Campground.findByIdAndDelete(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Some error happened.Please try again later.');
			res.redirect('/campGrounds/' + req.params.id);
		} else {
			req.flash('success', 'Campground deleted');
			res.redirect('/campGrounds');
		}
	});
});

module.exports = router;
