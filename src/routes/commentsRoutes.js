const express = require('express');
const { getComments, addComment } = require('../controllers/commentsController');
const { protect } = require('../middleware/auth');

// The { mergeParams: true } option is crucial for accessing :projectId from the parent router
const router = express.Router({ mergeParams: true });

router.route('/').get(getComments).post(protect, addComment);

module.exports = router;