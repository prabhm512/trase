const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const engsSchema = new Schema({
  engName: { type: String },
  teamName: { type: String }
});

const Engagements = mongoose.model("Engagements", engsSchema);

module.exports = Engagements;
