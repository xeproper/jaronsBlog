var express          = require("express");
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
var app              = express();
var moment           = require("moment");
var methodOverride   = require("method-override");


// APP 
mongoose.connect("mongodb://localhost/jaronblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Pass stuff to all apps
app.locals.moment = require("moment");

// MONGOOSE/MODEL CONFIG

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "http://blog.travelworldpassport.com/wp-content/uploads/2013/07/2962489964_568c35b705_b.jpg",
//     body: "Hello, just testing this out"
// })

//ROUTES
// INDEX ROUTE
app.get("/", function (req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error")
        } else {
            res.render("index", {blogs: blogs})
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// CREATE ROUTE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
          res.render("show", {blog: foundBlog});  
        } 
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running!")
});
