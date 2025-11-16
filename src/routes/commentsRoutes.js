const express = require('express');
const {
  getComments,
  addComment,
} = require('../controllers/commentsController.js');

const { protect } = require('../middleware/auth.js');

// By enabling mergeParams, this router can access parameters from its parent router (e.g., :projectId)
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;