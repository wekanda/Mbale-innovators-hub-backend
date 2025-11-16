const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  register,
  login,
  getMe,
} = require('../controllers/auth.js');

const { protect } = require('../middleware/auth.js');

// @route   POST /api/auth/register
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;