const db = require("../models");

module.exports = function(app) {
    // Get all tasks
    app.get("/api/tasks", (req, res) => {
        db.Tasks.find()
        .then(dbModel => { 
            res.json(dbModel) 
        })
        .catch(err => res.status(422).json(err));
    })

    // Update task list 
    app.post("/api/tasks", (req, res) => {
        db.Tasks.updateOne(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    })
}