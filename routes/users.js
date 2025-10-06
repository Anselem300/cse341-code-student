const express = require('express');
const { body } = require('express-validator');
const {
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:id', auth, getUser);
router.put(
  '/:id',
  auth,
  [
    body('username')
      .optional()
      .isLength({ min: 2 })
      .withMessage('username too short'),
    body('email').optional().isEmail().withMessage('invalid email'),
  ],
  updateUser
);
router.delete('/:id', auth, deleteUser);

module.exports = router;
