const Project = require('../models/Project'); // Correct the import
const User = require('../models/User'); // Import User model for faculty filtering

// @desc    Get all approved projects for the public gallery (with filtering & pagination)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9; // e.g., 9 projects per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = { status: 'approved' };

    // Handle Faculty filter (requires a separate query to the User model)
    if (req.query.faculty) {
      // Step 1: Find users that match the faculty
      const users = await User.find({ faculty: req.query.faculty }).select('_id');
      const userIds = users.map(user => user._id);

      // Step 2: Add the user IDs to the main project query
      query.user = { $in: userIds };
    }

    // Handle Year filter
    if (req.query.year) {
      const year = parseInt(req.query.year, 10);
      const startDate = new Date(year, 0, 1); // Jan 1st of the year
      const endDate = new Date(year, 11, 31, 23, 59, 59); // Dec 31st of the year
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.technology) {
      // Correctly search for a case-insensitive match within the technologies array
      query.technologies = { $regex: req.query.technology, $options: 'i' };
    }

    // Add search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate('user', 'name faculty department')
      .sort({ createdAt: -1 }) // Show newest projects first
      .skip(startIndex)
      .limit(limit);

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      pagination,
      data: projects,
    });
  } catch (err) {
    console.error('Error in getProjects:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'user',
      '_id name faculty department' // Ensure _id is included
    );
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if the project is approved
    const isApproved = project.status === 'approved';
    // Check if a user is logged in and is the author or an admin/supervisor
    const isAuthor = req.user ? project.user._id.toString() === req.user.id : false;
    const isPrivileged = req.user ? ['supervisor', 'admin'].includes(req.user.role) : false;

    // A project can be viewed if it's approved, OR if the viewer is the author, OR if the viewer is a supervisor/admin.
    if (isApproved || isAuthor || isPrivileged) {
      return res.status(200).json({
      success: true,
      data: project,
    });
    }

    // If none of the above, the user is not authorized to see the project.
    return res.status(404).json({ success: false, message: 'Project not found or you do not have permission to view it' });

  } catch (err) {
    console.error('Error in getProjectById:', err);
    if (err.name === 'CastError') {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get projects submitted by the logged-in user
// @route   GET /api/projects/my-projects
// @access  Private (Student)
exports.getMyProjects = async (req, res) => {
  try {
    // Find projects and sort by most recent
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get project statistics (total, approved, pending, rejected)
// @route   GET /api/projects/stats
// @access  Private (Admin)
exports.getProjectStats = async (req, res) => {
  try {
    const [
      totalProjects,
      approvedProjects,
      pendingProjects,
      rejectedProjects,
      categoryStats,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'approved' }),
      Project.countDocuments({ status: 'pending' }),
      Project.countDocuments({ status: 'rejected' }),
      // Add aggregation to get count per category
      Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        approvedProjects,
        pendingProjects,
        rejectedProjects,
        categoryStats, // Include the new data in the response
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Students only)
exports.createProject = async (req, res) => {
  try {
    // The text fields from FormData are in req.body
    const projectData = { ...req.body };
    projectData.user = req.user.id;

    // If a file was uploaded by multer, req.file will be available
    if (req.file) {
      projectData.projectDocument = req.file.path; // Save the path to the uploaded file
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Project Owner)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Make sure user is the project owner
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }

    // Prevent editing if not 'pending' or 'approved'
    if (!['pending', 'approved'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit a project with status '${project.status}'`,
      });
    }

    const updateData = { ...req.body };
    // If an approved project is updated, reset its status to pending for re-approval
    if (project.status === 'approved') {
      updateData.status = 'pending';
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
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
    const { status, comment } = req.body;

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

    const updateFields = {
      status: status,
      supervisorComment: comment || '',
    };

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

// @desc    Approve a project
// @route   PUT /api/projects/:id/approve
// @access  Private (Supervisor, Admin)
exports.approveProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', supervisorComment: '' }, // Clear any previous comment
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reject a project
// @route   PUT /api/projects/:id/reject
// @access  Private (Supervisor, Admin)
exports.rejectProject = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Rejection comment is required' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', supervisorComment: comment },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
