const { validationResult } = require('express-validator');
const Note = require('../models/note');
const Category = require('../models/category');
const Tag = require('../models/tags');

const createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { title, content, category, tags } = req.body;

    // 🔎 1. Find category by name (case-insensitive)
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findOne({
        name: new RegExp(`^${category}$`, 'i'),
      });
      if (!categoryDoc) {
        return res
          .status(400)
          .json({ message: `Category "${category}" not found` });
      }
    }

    // 🔎 2. Find tags by name (case-insensitive)
    let tagDocs = [];
    if (tags && Array.isArray(tags)) {
      tagDocs = await Tag.find({
        name: { $in: tags.map((t) => new RegExp(`^${t}$`, 'i')) },
      });

      if (tagDocs.length !== tags.length) {
        const foundNames = tagDocs.map((t) => t.name.toLowerCase());
        const missing = tags.filter(
          (t) => !foundNames.includes(t.toLowerCase())
        );
        return res
          .status(400)
          .json({ message: `Tags not found: ${missing.join(', ')}` });
      }
    }

    // 📝 3. Create note with IDs
    const note = new Note({
      title,
      content,
      userId: req.user.id,
      categoryId: categoryDoc ? categoryDoc._id : null,
      tags: tagDocs.map((t) => t._id),
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .populate('categoryId', 'name') // only include the 'name' field
      .populate('tags', 'name') // only include the 'name' field
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id)
      .populate('categoryId', 'name')
      .populate('tags', 'name');

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const updates = (({ title, content, categoryId, tags }) => ({
      title,
      content,
      categoryId,
      tags,
    }))(req.body);
    Object.keys(updates).forEach(
      (k) => updates[k] === undefined && delete updates[k]
    );

    const updated = await Note.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };
