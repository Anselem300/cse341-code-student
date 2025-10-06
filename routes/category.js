const express = require('express');
const { body } = require('express-validator');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/',
  auth,
  [body('name').isLength({ min: 1 }).withMessage('name required')],
  createCategory
);
router.get('/', auth, getCategories);
router.get('/:id', auth, getCategory);
router.put(
  '/:id',
  auth,
  [body('name').optional().isLength({ min: 1 }).withMessage('name required')],
  updateCategory
);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
