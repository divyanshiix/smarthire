const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

// @desc    Get recruitment analytics & dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });
    const draftJobs = await Job.countDocuments({ status: 'draft' });

    const totalApplicants = await Applicant.countDocuments();

    // Applicants by stage
    const statusCountsRaw = await Applicant.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusBreakdown = {
      applied: 0,
      screening: 0,
      interview: 0,
      offered: 0,
      hired: 0,
      rejected: 0
    };

    statusCountsRaw.forEach((item) => {
      if (statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Conversion rate
    const conversionRate = totalApplicants > 0
      ? ((statusBreakdown.hired / totalApplicants) * 100).toFixed(1)
      : 0;

    // Recent 5 applicants
    const recentApplicants = await Applicant.find()
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 jobs
    const recentJobs = await Job.find()
      .populate('applicantsCount')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        draftJobs,
        totalApplicants,
        statusBreakdown,
        conversionRate,
        recentApplicants,
        recentJobs
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
