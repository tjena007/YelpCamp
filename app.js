var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");

seedDB();
app.use(express.static(__dirname + "/public"));

//schema setup
var Campground = require("./models/campground");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

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
app.get("/", function (req, res) {
  res.render("landing.ejs");
});


//index route
app.get("/campGrounds", function (req, res) {
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
app.post("/campGrounds", function (req, res) {
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
app.get("/campGrounds/new", function (req, res) {
  res.render("campgrounds/new.ejs");
});

//show route -- shouold be declared at the end
app.get("/campGrounds/:id", function (req, res) {

  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    }
    else {
      res.render("campgrounds/show.ejs", { camp: foundCampground });
    }
  })
})

//================================================
//Comment ROUTES
//show
app.get("/campGrounds/:id/comments/new", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    }
    else {
      res.render("comments/new.ejs", { camp: campground });
    }
  })
})

app.post("/campGrounds/:id/comments", function (req, res) {
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
            //connect comment to campground
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

//=================auth routes
app.get("/signup", function (req, res) {
  res.render("signup.ejs")
})

app.post("/signup", function (req, res) {
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
//================================================

app.get("*", function (req, res) {
  //res.render("https://wallpapercave.com/wp/wp2414722.jpg");
  //   res.send("Sorry,page not found.");
  //res.redirect("https://wallpapercave.com/wp/wp2414734.png");
  res.redirect("/")
});

app.listen("3000", function () {
  console.log("YelpCamp server listening at 3000");
});