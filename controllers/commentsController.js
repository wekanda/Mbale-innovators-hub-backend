const Comment = require('../models/Comment'); // Corrected: Capital 'C' in Comment
const Project = require('../models/project'); // This should be correct now

// @desc    Get comments for a project
// @route   GET /api/projects/:projectId/comments
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ project: req.params.projectId }).populate({
      path: 'user',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a comment to a project
// @route   POST /api/projects/:projectId/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    req.body.project = req.params.projectId;
    req.body.user = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `No project with the id of ${req.params.projectId}`,
      });
    }

    const comment = await Comment.create(req.body);

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
