// src/routes/auth.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// This line imports the functions from the controller file
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    // This validation is more robust as it checks that the password is not an empty string.
    check('password', 'Password is required').not().isEmpty(),
  ],
  login
);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);


module.exports = router;
