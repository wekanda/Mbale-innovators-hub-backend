const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController.js');
const { protect, authorize } = require('../middleware/auth.js');

// All routes in this file are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);

router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
