const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  teamName: {
    type: String,
    required: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;

// module.exports = User = mongoose.model("users", UserSchema);
