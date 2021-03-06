var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{ 
		name: "Cloud's Rest", 
		image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Desert Mesa",
		image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Canyon Floor",
		image: "https://farm7.staticflickr.com/6085/6037590541_19248d41f0.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
]
	
function seedDB(){
		//remove all campgrounds
		Campground.remove({}, function(err){
			if(err){
				console.log("err");
			}
			console.log("removed campground");
			//add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					} else {
						console.log("Added a campground");
						//create a comment
						Comment.create(
							{
								text: "This place is great",
								author: "Homer"
							}, function(err, comment){
								if (err){
									console.log(err);
								} else {
									campground.comments.push(comment._id);
									campground.save();
									console.log("created a new comment");
								}
							});
					}
				})
			})
		})
}

module.exports = seedDB;
