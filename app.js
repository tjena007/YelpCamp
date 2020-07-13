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
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Camp Exotica, Kullu",
//     image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
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

//app.get set and post

// var campGrounds = [
//   {
//     name: "Tso Moriri Lake,Ladakh",
//     image:
//       "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
//   {
//     name: "Camp Exotica, Kullu",
//     image:
//       "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
//   {
//     name: "Rishikesh Valley camp, Rishikesh",
//     image:
//       "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
//   {
//     name: "Kipling Camp, Madhya Pradesh",
//     image:
//       "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
//   {
//     name: "West Ladakh Camp, Ladakh",
//     image:
//       "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
//   {
//     name: "Nameri Eco Camp, Assam",
//     image:
//       "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   },
// ];

app.get("/", function (req, res) {
  res.render("landing.ejs");
});

app.get("/campGrounds", function (req, res) {
  //using array
  // res.render("campground.ejs", { camps: campGrounds });

  //using database
  Campground.find({}, function (err, allcampGrounds) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("campground.ejs", { camps: allcampGrounds });
    }
  })
});

app.post("/campGrounds", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
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

app.get("/campGrounds/new", function (req, res) {
  res.render("new.ejs");
});

app.get("*", function (req, res) {
  //res.render("https://wallpapercave.com/wp/wp2414722.jpg");
  //   res.send("Sorry,page not found.");
  res.redirect("https://wallpapercave.com/wp/wp2414734.png");
});

app.listen("3000", function () {
  console.log("YelpCamp server listening at 3000");
});
