const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

router.post(
  '/',
  auth,
  [
    body('title').isLength({ min: 1 }).withMessage('title required'),
    body('content').isLength({ min: 1 }).withMessage('content required'),
  ],
  createNote
);

router.get('/', auth, getNotes);
router.get('/:id', auth, getNote);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);

module.exports = router;
