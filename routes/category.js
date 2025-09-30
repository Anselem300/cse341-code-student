const express = require('express');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const router = express.Router();
const auth = require('../middleware/auth');

// CRUD routes
router.post('/', auth, createCategory);
router.get('/', auth, getCategories);
router.get('/:id', auth, getCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
