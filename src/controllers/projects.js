// src/controllers/projects.js

const Project = require('../models/Project');

// @desc    Get all approved projects for the public gallery (with filtering)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    // Base query always filters for approved projects
    const query = { status: 'approved' };

    // Add filters from the query string if they exist
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.technology) {
      // Use the $in operator to find projects where the 'technologies' array contains the specified technology.
      // This makes the filter case-insensitive using a regular expression.
      query.technologies = { $in: [new RegExp(`^${req.query.technology}$`, 'i')] };
    }

    // We can add more filters here later for faculty, department, etc.

    const projects = await Project.find(query).populate(
      'user',
      'name faculty department'
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Students only)
exports.createProject = async (req, res) => {
  try {
    req.body.user = req.user.id;

    if (req.body.projectDocument) {
      req.body.projectDocument = 'path/to/simulated/document.pdf';
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all pending projects (for supervisors/admins)
// @route   GET /api/projects/pending
// @access  Private (Supervisor, Admin)
exports.getPendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'pending' }).populate(
      'user',
      'name email'
    );
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a project's status (e.g., approve/reject)
// @route   PUT /api/projects/:id/status
// @access  Private (Supervisor, Admin)
exports.updateProjectStatus = async (req, res) => {
  try {
    // Expecting { "status": "approved", "comment": "Optional feedback" }
    const { status, comment } = req.body;

    // Validate the new status
    if (!['approved', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value.' });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    // Prepare the fields to update
    const updateFields = {
      status: status,
      supervisorComment: comment || '', // Save the comment, or an empty string if none is provided
    };

    // Update the status and comment
    project = await Project.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
