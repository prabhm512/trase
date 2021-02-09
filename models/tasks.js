const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  tasks: { type: Object },
  columns: { type: Object },
  columnOrder: { type: Array },
  teamName: { type: String }
});

const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
