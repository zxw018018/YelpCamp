var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground  = require("./models/campground"),
	Comment 	= require("./models/comment"),
	seedDB 		= require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


app.get("/", function(req, res){
	res.render("landing");
});

//index route - show all campgrounds
app.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
	// res.render("campgrounds", {campgrounds: campgrounds});
});


//create route - create campground to database
app.post("/campgrounds", function(req, res){
	//get data from form 
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	// create a new campground and save to database
	var newCampground = {name: name, image: image, description: description};
	Campground.create(newCampground, function(err, newlyCreated){
		if (err){
			console.log(err);
		} else {
			//redirect back to campground page
			res.redirect("/campgrounds");
		}
	})
});


//new route - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//show info about one campground
app.get("/campgrounds/:id", function(req, res){
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

// =====================================
// comments routes
// =====================================
app.get("/campgrounds/:id/comments/new", function(req, res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
	
})

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//connect new comment to campground
					campground.comments.push(comment._id);
					campground.save();
					
					//redirect to campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
})



app.listen(3000, function(){
	console.log("Yelp Server has started!");
});





