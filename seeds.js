var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")
var data = [
    {
        name: "My camp one",
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis tempor sapien, ac ultrices augue. Praesent faucibus sem arcu, nec venenatis tortor bibendum quis. Phasellus rhoncus, eros eu semper iaculis, massa lorem placerat elit, vitae sagittis magna nisl non arcu. Sed volutpat et leo sed posuere. Etiam vel tellus eu felis rutrum eleifend dignissim suscipit erat. Praesent tempus vel dolor a lacinia. Fusce at hendrerit urna, id vestibulum risus. Nunc congue nulla sem, nec rutrum nibh fermentum vel. Vivamus metus diam, lacinia ut egestas id, finibus sed nulla. In convallis sit amet enim sit amet faucibus. Curabitur nec sem lectus."
    },
    {
        name: "My camp two",
        image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis tempor sapien, ac ultrices augue. Praesent faucibus sem arcu, nec venenatis tortor bibendum quis. Phasellus rhoncus, eros eu semper iaculis, massa lorem placerat elit, vitae sagittis magna nisl non arcu. Sed volutpat et leo sed posuere. Etiam vel tellus eu felis rutrum eleifend dignissim suscipit erat. Praesent tempus vel dolor a lacinia. Fusce at hendrerit urna, id vestibulum risus. Nunc congue nulla sem, nec rutrum nibh fermentum vel. Vivamus metus diam, lacinia ut egestas id, finibus sed nulla. In convallis sit amet enim sit amet faucibus. Curabitur nec sem lectus."
    },
    {
        name: "My camp three",
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis tempor sapien, ac ultrices augue. Praesent faucibus sem arcu, nec venenatis tortor bibendum quis. Phasellus rhoncus, eros eu semper iaculis, massa lorem placerat elit, vitae sagittis magna nisl non arcu. Sed volutpat et leo sed posuere. Etiam vel tellus eu felis rutrum eleifend dignissim suscipit erat. Praesent tempus vel dolor a lacinia. Fusce at hendrerit urna, id vestibulum risus. Nunc congue nulla sem, nec rutrum nibh fermentum vel. Vivamus metus diam, lacinia ut egestas id, finibus sed nulla. In convallis sit amet enim sit amet faucibus. Curabitur nec sem lectus."
    }
]
function seedDB() {
    //Remove all Campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds");
        //add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campGround) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("added to DB");
                    Comment.create(
                        {
                            text: "Good place",
                            author: "Me"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                campGround.comments.push(comment);
                                campGround.save();
                                console.log("added comment")
                            }
                        }
                    )
                }
            })
        })
    });


    //add few comments
}

module.exports = seedDB;

