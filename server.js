require('dotenv').config();

const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();
const passport = require("passport");

// Define middleware here
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Bodyparser middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static("public"));

// Connect to the Mongo DB
const PWD = process.env.MONGO_PWD;

const databaseURL = `mongodb+srv://prabhm512:${encodeURIComponent(PWD)}@cluster0.ltepl.mongodb.net/project3?retryWrites=true&w=majority`;

mongoose.connect( process.env.MONGODB_URI || databaseURL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Use apiRoutes
require("./routes/apiRoutes")(app);
require("./routes/userRoutes")(app);

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
