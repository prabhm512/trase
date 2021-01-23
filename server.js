require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const app = express();

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Use apiRoutes
require("./routes/apiRoutes")(app);

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

// Connect to the Mongo DB
const PWD = process.env.MONGO_PWD;

const databaseURL = `mongodb+srv://prabhm512:${encodeURIComponent(PWD)}@cluster0.ltepl.mongodb.net/project3?retryWrites=true&w=majority`;

mongoose.connect( process.env.MONGODB_URI || databaseURL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
