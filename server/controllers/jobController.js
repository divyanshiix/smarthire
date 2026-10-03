const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

// @desc    Create a new Job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    const { title, department, location, type, status, description, requirements, salaryRange } = req.body;

    if (!title || !department || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, department, location, and description'
      });
    }

    const reqArray = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split(',').map((r) => r.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      department,
      location,
      type: type || 'full-time',
      status: status || 'active',
      description,
      requirements: reqArray,
      salaryRange: salaryRange || 'Competitive',
      recruiterId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Job opening created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all Jobs (Search, Filter, Pagination, Sorting)
// @route   GET /api/jobs
// @access  Public (or Private)
const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, department, type, status, sortBy } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (department && department !== 'all') {
      query.department = { $regex: new RegExp(`^${department}$`, 'i') };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'title_asc') sort = { title: 1 };
    if (sortBy === 'title_desc') sort = { title: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiterId', 'name company email')
      .populate('applicantsCount')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total: totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Job details
// @route   GET /api/jobs/:id
// @access  Public (or Private)
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiterId', 'name company email avatar')
      .populate('applicantsCount');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    const applicants = await Applicant.find({ jobId: job._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      job,
      applicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    // Check ownership or admin role
    if (job.recruiterId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job posting'
      });
    }

    const { requirements } = req.body;
    if (requirements && !Array.isArray(requirements) && typeof requirements === 'string') {
      req.body.requirements = requirements.split(',').map((r) => r.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('applicantsCount');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    if (job.recruiterId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting'
      });
    }

    // Delete related applicants
    await Applicant.deleteMany({ jobId: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
