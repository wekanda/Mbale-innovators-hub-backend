const express = require('express');
const router = express.Router();
const multer = require('multer');
const commentRouter = require('./commentsRoutes'); // Import the comment router

// Import all the required controller functions
const {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  getPendingProjects,
  updateProjectStatus,
  approveProject,
  rejectProject,
  getProjectStats
} = require('../../controllers/projects.js');
const { protect, authorize, optionalProtect } = require('../../middleware/auth.js');

// Configure multer for file storage. This will create an 'uploads' folder at the root of your project.
const upload = multer({ dest: 'uploads/' });

// Re-route into other resource routers
router.use('/:projectId/comments', commentRouter);

// This handles GET /api/projects and POST /api/projects
router
  .route('/')
  .get(getProjects)
  .post(protect, authorize('student'), upload.single('projectDocument'), createProject);
// This handles GET /api/projects/my-projects
router
  .route('/my-projects')
  .get(protect, authorize('student'), getMyProjects);

// This handles GET /api/projects/pending
router
  .route('/pending')
  .get(protect, authorize('supervisor', 'admin'), getPendingProjects);

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private/Admin
router.route('/stats').get(protect, authorize('admin'), getProjectStats);

// This handles GET and PUT for a single project
router
  .route('/:id')
  .get(optionalProtect, getProjectById) // Use optional protect to make req.user available if logged in
  .put(protect, authorize('student'), updateProject);

// This handles PUT /api/projects/:id/status
router
  .route('/:id/status')
  .put(protect, authorize('supervisor', 'admin'), updateProjectStatus);

// @desc    Approve a project
// @route   PUT /api/projects/:id/approve
// @access  Private/Supervisor/Admin
router.route('/:id/approve').put(protect, authorize('supervisor', 'admin'), approveProject);

// @desc    Reject a project
// @route   PUT /api/projects/:id/reject
// @access  Private/Supervisor/Admin
router.route('/:id/reject').put(protect, authorize('supervisor', 'admin'), rejectProject);


module.exports = router;
