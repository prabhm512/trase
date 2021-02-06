const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardsSchema = new Schema({
  tasks: { 
    type: Object
  },
  columns: { type: Object },
  columnOrder: { type: Array },
  teamName: { type: String }
});

const Boards = mongoose.model("Boards", boardsSchema);

module.exports = Boards;
