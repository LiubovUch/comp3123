const noteModel = require('../models/Notes.js');
//TODO - Create a new Note
//http://mongoosejs.com/docs/api.html#document_Document-save
// Create a new Note
app.post('/notes', (req, res) => {
    // Validate request
    if (!req.body.noteTitle) {
        return res.status(400).send({
            message: "Note title can not be empty"
        });
    }

    // Create a Note
    const note = new noteModel({
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    });

    // Save Note in the database
    note.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
});

// Retrieve all Notes
app.get('/notes', (req, res) => {
    noteModel.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
});

// Retrieve a single Note with noteId
app.get('/notes/:noteId', (req, res) => {
    noteModel.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving note with id " + req.params.noteId
            });
        });
});

// Update a Note with noteId
app.put('/notes/:noteId', (req, res) => {
    if (!req.body.noteTitle) {
        return res.status(400).send({
            message: "Note title can not be empty"
        });
    }

    // Find note and update it with the request body
    noteModel.findByIdAndUpdate(req.params.noteId, {
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority,
        dateUpdated: Date.now()
    }, { new: true })  // Return the updated document
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error updating note with id " + req.params.noteId
            });
        });
});

// Delete a Note with noteId
app.delete('/notes/:noteId', (req, res) => {
    noteModel.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete note with id " + req.params.noteId
            });
        });
});

module.exports = app;  // Export the router