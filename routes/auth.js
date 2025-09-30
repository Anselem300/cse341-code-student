const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('username').isLength({ min: 2 }).withMessage('username too short'),
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({ min: 6 }).withMessage('password too short'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').exists().withMessage('password required'),
  ],
  login
);

module.exports = router;
