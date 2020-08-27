var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");
var methodOverride = require("method-override");
var Comment = require("./models/comment");
var User = require("./models/user");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");

//seedDb
//seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//schema setup
var Campground = require("./models/campground");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);
app.use(flash());

//PASPORT CONFIG
app.use(require("express-session")({
  secret: "I am the best",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})
app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

// Campground.create(
//   {
//     name: "Camp Exotica, Kullu",
//     image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "lorem  "
//   },
//   function (err, campground) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log(campground)
//     }
//   }
// )

// Campground.deleteMany({ name: "Camp Exotica, Kullu" }, function (err) {
//   if (err) return handleError(err);
//   // deleted at most one tank document
//   console.log("deleted")
// });

//app.get set and post

app.get("*", function (req, res) {
  //res.render("https://wallpapercave.com/wp/wp2414722.jpg");
  //   res.send("Sorry,page not found.");
  //res.redirect("https://wallpapercave.com/wp/wp2414734.png");
  res.redirect("/")
});

app.listen(process.env.PORT || "3000", function () {
  console.log("YelpCamp server listening at 3000");
});