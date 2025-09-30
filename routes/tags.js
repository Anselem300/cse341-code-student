const express = require('express');
const {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
} = require('../controllers/tagsController');
const router = express.Router();
const auth = require('../middleware/auth');

// CRUD routes
router.post('/', auth, createTag);
router.get('/', auth, getTags);
router.get('/:id', auth, getTag);
router.put('/:id', auth, updateTag);
router.delete('/:id', auth, deleteTag);

module.exports = router;
