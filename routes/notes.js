const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// get all notes for user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort('-updatedAt');
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title required' });
    const note = await Note.create({ user: req.userId, title, content });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
