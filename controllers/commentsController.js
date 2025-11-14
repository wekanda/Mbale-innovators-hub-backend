const Comment = require('../models/comment');
const Project = require('../models/project');

// @desc    Get comments for a project
// @route   GET /api/projects/:projectId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ project: req.params.projectId })
      .populate({
        path: 'user',
        select: 'name',
      })
      .sort({ createdAt: -1 }); // Show newest comments first

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a comment to a project
// @route   POST /api/projects/:projectId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    req.body.project = req.params.projectId;
    req.body.user = req.user.id; // From protect middleware

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const comment = await Comment.create(req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};