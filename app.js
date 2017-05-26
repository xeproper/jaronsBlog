var express      = require("express");
var bodyParser   = require("body-parser");
var mongoose     = require("mongoose")
var app          = express()
var moment       = require("moment")


// APP 
mongoose.connect("mongodb://localhost/jaronblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running!")
});
