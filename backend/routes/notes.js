const express = require('express')
const router = express.Router()
let Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator')


//ROUTE 1: Get all the notes using: GET: "/api/notes/fetchallnotes". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.send(notes)

    } catch (error) {
        console.error(error.messagae);
        res.status(500).send("Internal server error")
    }
})

//ROUTE 2: Add a note using: POST: "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    //validate fields
    body('title', 'title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //Create a new note

    let { title, description, tag } = req.body;

    let note = new Notes({
        title, description, tag, user: req.user.id
    })
    // let newNote = new Notes({
    //     user: req.user.id,
    //     title: req.body.title,
    //     description: req.body.description,
    //     tag: req.body.tag
    // })
    try {
        let savednote = await note.save();
        res.json(savednote)

    } catch (error) {
        console.error(error.messagae);
        res.status(500).send("Internal server error")
    }
})

//ROUTE 3: Update an existing note using: PUT: "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create a newNote object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Unauthorized')
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.error(error.messagae);
        res.status(500).send("Internal server error")
    }
})

//ROUTE 4: Deleting an existing note using: DELETE: "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed')
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })

    } catch (error) {
        console.error(error.messagae);
        res.status(500).send("Internal server error")
    }
})

module.exports = router