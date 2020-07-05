var express = require("express");
var app = express();

//app.get set and post

app.get("/", function (req, res) {
  res.render("landing.ejs");
});

app.get("/campGrounds", function (req, res) {
  var campGrounds = [
    {
      name: "kite",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "runner",
      image:
        "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "lol",
      image:
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "yo",
      image:
        "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "kitab",
      image:
        "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "dawg",
      image:
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
  ];

  res.render("campground.ejs", { camps: campGrounds });
});

app.get("*", function (req, res) {
  //res.render("https://wallpapercave.com/wp/wp2414722.jpg");
  //   res.send("Sorry,page not found.");
  res.redirect("https://wallpapercave.com/wp/wp2414722.jpg");
});

app.listen("3000", function () {
  console.log("YelpCamp server listening at 3000");
});
