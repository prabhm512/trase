const db = require("../models");

module.exports = function(app) {
    // Get all boards
    app.get("/api/boards", (req, res) => {
        db.Tasks.find()
        .then(dbModel => { 
            res.json(dbModel) 
        })
        .catch(err => res.status(422).json(err));
    })

    app.get("/api/team/boards/:teamName", (req, res) => {
        db.Tasks.find({ teamName: req.params.teamName })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    })

    // Get board for the logged in user
    app.get("/api/boards/:id", (req, res) => {
        db.Tasks.findOne({ _id: req.params.id })
        .then(dbModel => { 
            res.json(dbModel) 
        })
        .catch(err => res.status(422).json(err));
    })

    // Update task list 
    app.put("/api/boards/:id", (req, res) => {
        db.Tasks.findOne({ _id: req.params.id})
        .update(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    })

    // Create new task board
    app.post("/api/boards", (req, res) => {
        db.Tasks.create(req.body)
        .then(dbModel => {
            res.json(dbModel);
        })
        .catch(err => res.status(422).json(err));
    })

    // Delete task board
    app.delete("/api/boards/:id", (req, res) => {

        db.Tasks.findOneAndDelete({ _id: req.params.id }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Deleted KanBan for ' + req.params.email);
            }
        })
    })
}