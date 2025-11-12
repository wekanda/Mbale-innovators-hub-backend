// src/routes/projects.js

const express = require('express');
const router = express.Router();

// Import all the required controller functions
const {
  createProject,
  getProjects,
  getPendingProjects,
  updateProjectStatus
} = require('../controllers/projects');

const { protect, authorize } = require('../middleware/auth');

// This handles GET /api/projects and POST /api/projects
router
  .route('/')
  .get(getProjects)
  .post(protect, authorize('student'), createProject);

// This handles GET /api/projects/pending
router
  .route('/pending')
  .get(protect, authorize('supervisor', 'admin'), getPendingProjects);

// This handles PUT /api/projects/:id/status
router
  .route('/:id/status')
  .put(protect, authorize('supervisor', 'admin'), updateProjectStatus);


module.exports = router;
