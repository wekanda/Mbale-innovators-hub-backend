const Project = require('../models/project');
const Comment = require('../models/Comment');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (student)
exports.createProject = async (req, res) => {
	try {
		// Attach the logged in user
		req.body.user = req.user.id;

		// If a file was uploaded, save its path
		if (req.file) {
			req.body.projectDocument = req.file.path;
		}

		const project = await Project.create(req.body);

		res.status(201).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
	try {
		const projects = await Project.find().populate({ path: 'user', select: 'name' });
		res.status(200).json({ success: true, count: projects.length, data: projects });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Get a single project by id
// @route   GET /api/projects/:id
// @access  Public (optional auth)
exports.getProjectById = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id).populate({ path: 'user', select: 'name' });

		if (!project) {
			return res.status(404).json({ success: false, error: 'Project not found' });
		}

		res.status(200).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Get projects for the logged in user
// @route   GET /api/projects/my-projects
// @access  Private (student)
exports.getMyProjects = async (req, res) => {
	try {
		const projects = await Project.find({ user: req.user.id });
		res.status(200).json({ success: true, count: projects.length, data: projects });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Update a project (owner only)
// @route   PUT /api/projects/:id
// @access  Private (student)
exports.updateProject = async (req, res) => {
	try {
		let project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({ success: false, error: 'Project not found' });
		}

		// Only the owner can update
		if (project.user.toString() !== req.user.id) {
			return res.status(401).json({ success: false, error: 'Not authorized to update this project' });
		}

		// Prevent status changes by students via this endpoint
		if (req.body.status) {
			delete req.body.status;
		}

		if (req.file) {
			req.body.projectDocument = req.file.path;
		}

		project = await Project.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Get pending projects (for supervisor/admin)
// @route   GET /api/projects/pending
// @access  Private (supervisor|admin)
exports.getPendingProjects = async (req, res) => {
	try {
		const projects = await Project.find({ status: 'pending' }).populate({ path: 'user', select: 'name' });
		res.status(200).json({ success: true, count: projects.length, data: projects });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Update project status (supervisor/admin)
// @route   PUT /api/projects/:id/status
// @access  Private (supervisor|admin)
exports.updateProjectStatus = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({ success: false, error: 'Project not found' });
		}

		const { status, supervisorComment } = req.body;

		if (!['pending', 'approved', 'rejected'].includes(status)) {
			return res.status(400).json({ success: false, error: 'Invalid status' });
		}

		project.status = status;
		if (supervisorComment) project.supervisorComment = supervisorComment;
		await project.save();

		res.status(200).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Approve a project
// @route   PUT /api/projects/:id/approve
// @access  Private (supervisor|admin)
exports.approveProject = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({ success: false, error: 'Project not found' });
		}

		project.status = 'approved';
		if (req.body.supervisorComment) project.supervisorComment = req.body.supervisorComment;
		await project.save();

		res.status(200).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Reject a project
// @route   PUT /api/projects/:id/reject
// @access  Private (supervisor|admin)
exports.rejectProject = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({ success: false, error: 'Project not found' });
		}

		project.status = 'rejected';
		if (req.body.supervisorComment) project.supervisorComment = req.body.supervisorComment;
		await project.save();

		res.status(200).json({ success: true, data: project });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private/Admin
exports.getProjectStats = async (req, res) => {
	try {
		const total = await Project.countDocuments();
		const approved = await Project.countDocuments({ status: 'approved' });
		const pending = await Project.countDocuments({ status: 'pending' });
		const rejected = await Project.countDocuments({ status: 'rejected' });

		res.status(200).json({
			success: true,
			data: { total, approved, pending, rejected },
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
};

