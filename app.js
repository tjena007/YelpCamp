var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));


//schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
  {
    name: "Camp Exotica, Kullu",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "lorem  "
  },
  function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(campground)
    }
  }
)

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
      res.render("index.ejs", { camps: allcampGrounds });
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
  res.render("new.ejs");
});

//show route -- shouold be declared at the end
app.get("/campGrounds/:id", function (req, res) {

  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err)
    }
    else {
      res.render("show.ejs", { camp: foundCampground });
    }
  })
})

app.get("*", function (req, res) {
  //res.render("https://wallpapercave.com/wp/wp2414722.jpg");
  //   res.send("Sorry,page not found.");
  res.redirect("https://wallpapercave.com/wp/wp2414734.png");
});

app.listen("3000", function () {
  console.log("YelpCamp server listening at 3000");
});
