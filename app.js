require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

// Initialize the app
const app = express();
const server = require("http").createServer(app);

// Start socket and setup
exports.io = require("socket.io")(server);
require("./config/socket")();

// Initialize the middlewares
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("connect-flash")());


// Setup the database
const setDatabase = require("./config/database/database");
setDatabase();

// Passport configuration
require("./config/middlewares/passport")(passport);


app.get("/", (req, res)=>{
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.render("login", {error: req.flash("error")[0]});
    }
});

// Include the routes
const users = require("./routes/users");
const home = require('./routes/home');
app.use("/users", users);
app.use("/home", home);

// Start the server

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
server.listen(port);
