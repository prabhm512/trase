const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamsSchema = new Schema({
    // companyName: { 
    //     type: String 
    // },
    teamName: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const teams = mongoose.model("Teams", teamsSchema);

module.exports = teams;
