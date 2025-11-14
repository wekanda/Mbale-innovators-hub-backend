const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// This route gets all users and is protected for admins
router.route('/').get(protect, authorize('admin'), getUsers);

// These routes update or delete a specific user and are protected for admins
router.route('/:id').put(protect, authorize('admin'), updateUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;