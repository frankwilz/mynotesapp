const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

function isValidNoteId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

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
    const title = req.body.title?.trim();
    if (!title) return res.status(400).json({ msg: 'Title required' });

    if (req.body.content !== undefined && typeof req.body.content !== 'string') {
      return res.status(400).json({ msg: 'Content must be text' });
    }
    const content = req.body.content?.trim() || '';

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
    if (!isValidNoteId(req.params.id)) return res.status(400).json({ msg: 'Invalid note id' });

    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ msg: 'Note not found' });

    if (req.body.title !== undefined) {
      const nextTitle = req.body.title?.trim();
      if (!nextTitle) return res.status(400).json({ msg: 'Title required' });
      note.title = nextTitle;
    }

    if (req.body.content !== undefined) {
      if (typeof req.body.content !== 'string') {
        return res.status(400).json({ msg: 'Content must be text' });
      }
      note.content = req.body.content.trim();
    }

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
    if (!isValidNoteId(req.params.id)) return res.status(400).json({ msg: 'Invalid note id' });
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
