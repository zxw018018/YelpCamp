var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//index route - show all campgrounds
router.get("/", function(req, res){

	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	})
	// res.render("campgrounds", {campgrounds: campgrounds});
});


//create route - create campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form 
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	// create a new campground and save to database
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if (err){
			console.log(err);
		} else {
			//redirect back to campground page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	})
});


//new route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//show info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(
		function(err, foundCampground){
			if(err){
				console.log(err);
			} else {
				console.log(foundCampground);
				//render the show page of this id
				res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});


// update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect somewhere
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

//destory campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;
