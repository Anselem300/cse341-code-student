/* eslint-disable prettier/prettier */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Start GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] })
);

// GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    // Create JWT after successful login
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Return token as JSON (no redirect)
    res.json({
      message: 'GitHub login successful',
      token,
      user: req.user,
    });
  }
);

// Failure route
router.get('/failure', (req, res) =>
  res.status(401).json({ message: 'OAuth failed' })
);

module.exports = router;
