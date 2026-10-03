const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const sendEmailNotification = require('../utils/emailHelper');
const { Parser } = require('json2csv');

// @desc    Add a new Applicant (with optional PDF file upload)
// @route   POST /api/applicants
// @access  Public (Candidates or Recruiters)
const addApplicant = async (req, res, next) => {
  try {
    const { name, email, phone, jobId, notes, rating } = req.body;

    if (!name || !email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide candidate name, email, and target jobId'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'The target job posting does not exist'
      });
    }

    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const applicant = await Applicant.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      jobId,
      status: 'applied',
      resumeUrl,
      notes: notes || '',
      rating: rating ? parseInt(rating, 10) : 3
    });

    const populatedApplicant = await Applicant.findById(applicant._id).populate('jobId', 'title department location');

    // Trigger email notification to candidate
    sendEmailNotification({
      to: applicant.email,
      subject: `Application Received: ${job.title} at SmartHire`,
      text: `Hello ${applicant.name},\n\nThank you for applying for the position of ${job.title}. Our recruitment team is reviewing your profile and will get back to you shortly.\n\nBest regards,\nSmartHire Recruitment Team`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; borderRadius: 8px;">
        <h2 style="color: #4f46e5;">Application Confirmation</h2>
        <p>Hello <strong>${applicant.name}</strong>,</p>
        <p>Thank you for submitting your application for the <strong>${job.title}</strong> role in our <strong>${job.department}</strong> department.</p>
        <p>Our hiring managers are reviewing your application and will update you on the next steps.</p>
        <br/>
        <p style="color: #6b7280; font-size: 13px;">Sent automatically by SmartHire ATS</p>
      </div>`
    });

    res.status(201).json({
      success: true,
      message: 'Candidate application submitted successfully',
      applicant: populatedApplicant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Applicants (Search, Filter by status/job, Pagination)
// @route   GET /api/applicants
// @access  Private
const getApplicants = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, jobId, sortBy } = req.query;

    const query = {};

    if (jobId && jobId !== 'all') {
      query.jobId = jobId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'name_asc') sort = { name: 1 };
    if (sortBy === 'name_desc') sort = { name: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .populate('jobId', 'title department location status')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: applicants.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      applicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Applicant by ID
// @route   GET /api/applicants/:id
// @access  Private
const getApplicantById = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate('jobId', 'title department location status salaryRange');

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found'
      });
    }

    res.status(200).json({
      success: true,
      applicant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Applicant Status & Notes
// @route   PUT /api/applicants/:id/status
// @access  Private
const updateApplicantStatus = async (req, res, next) => {
  try {
    const { status, notes, rating } = req.body;

    const applicant = await Applicant.findById(req.params.id).populate('jobId', 'title department');
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found'
      });
    }

    const validStatuses = ['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (status) applicant.status = status;
    if (notes !== undefined) applicant.notes = notes;
    if (rating !== undefined) applicant.rating = rating;

    await applicant.save();

    // Trigger email update to candidate if status changed
    if (status && ['interview', 'offered', 'hired', 'rejected'].includes(status)) {
      sendEmailNotification({
        to: applicant.email,
        subject: `Update on your application for ${applicant.jobId.title}`,
        text: `Hello ${applicant.name},\n\nYour application status for ${applicant.jobId.title} has been updated to: ${status.toUpperCase()}.\n\nBest regards,\nSmartHire Team`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; borderRadius: 8px;">
          <h2 style="color: #4f46e5;">Application Status Update</h2>
          <p>Hello <strong>${applicant.name}</strong>,</p>
          <p>Your application status for <strong>${applicant.jobId.title}</strong> has been updated to: <span style="font-weight: bold; text-transform: uppercase; color: #4f46e5;">${status}</span>.</p>
          <p>Thank you for your interest in joining our team!</p>
        </div>`
      });
    }

    res.status(200).json({
      success: true,
      message: `Applicant status updated to '${applicant.status}'`,
      applicant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Applicant
// @route   DELETE /api/applicants/:id
// @access  Private
const deleteApplicant = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found'
      });
    }

    await applicant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Applicant record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Applicants to CSV
// @route   GET /api/applicants/export/csv
// @access  Private
const exportApplicantsCSV = async (req, res, next) => {
  try {
    const { status, jobId, search } = req.query;

    const query = {};
    if (jobId && jobId !== 'all') query.jobId = jobId;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const applicants = await Applicant.find(query).populate('jobId', 'title department').sort({ createdAt: -1 });

    const csvData = applicants.map((app) => ({
      ApplicantID: app._id.toString(),
      Name: app.name,
      Email: app.email,
      Phone: app.phone || 'N/A',
      JobTitle: app.jobId ? app.jobId.title : 'Unassigned',
      Department: app.jobId ? app.jobId.department : 'N/A',
      Status: app.status,
      Rating: app.rating,
      AppliedDate: app.createdAt.toISOString().split('T')[0],
      ResumeURL: app.resumeUrl ? `${req.protocol}://${req.get('host')}${app.resumeUrl}` : 'None'
    }));

    const fields = ['ApplicantID', 'Name', 'Email', 'Phone', 'JobTitle', 'Department', 'Status', 'Rating', 'AppliedDate', 'ResumeURL'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`smarthire_applicants_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addApplicant,
  getApplicants,
  getApplicantById,
  updateApplicantStatus,
  deleteApplicant,
  exportApplicantsCSV
};
