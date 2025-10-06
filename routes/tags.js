const express = require('express');
const { body } = require('express-validator');
const {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
} = require('../controllers/tagsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/',
  auth,
  [body('name').isLength({ min: 1 }).withMessage('name required')],
  createTag
);
router.get('/', auth, getTags);
router.get('/:id', auth, getTag);
router.put(
  '/:id',
  auth,
  [body('name').optional().isLength({ min: 1 }).withMessage('name required')],
  updateTag
);
router.delete('/:id', auth, deleteTag);

module.exports = router;
