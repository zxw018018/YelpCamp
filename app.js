var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	Campground  	= require("./models/campground"),
	passport		= require("passport"),
	methodOverride	= require("method-override"),
	LocalStrategy 	= require("passport-local"),
	Comment 		= require("./models/comment"),
	seedDB 			= require("./seeds"),
	User 			= require("./models/user"),
	flash			= require("connect-flash");


//requiring routes 
var	commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");




// set up databaseurl
// export DATABASEURL=
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp_v6");
// mongoose.connect("mongodb://xinwei:xinwei@ds115758.mlab.com:15758/xinwei-yelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();  //seed the database


//passport configuration
app.use(require("express-session")({
	secret: "Once agian Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT||3000, process.env.IP, function(){

	console.log("Yelp Server has started!");
});





