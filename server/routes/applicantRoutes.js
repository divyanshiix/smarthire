const express = require('express');
const router = express.Router();
const {
  addApplicant,
  getApplicants,
  getApplicantById,
  updateApplicantStatus,
  deleteApplicant,
  exportApplicantsCSV
} = require('../controllers/applicantController');
const { protect } = require('../middleware/authMiddleware');
const uploadResume = require('../middleware/uploadMiddleware');

router.get('/export/csv', protect, exportApplicantsCSV);

router.route('/')
  .get(protect, getApplicants)
  .post(uploadResume.single('resume'), addApplicant);

router.route('/:id')
  .get(protect, getApplicantById)
  .delete(protect, deleteApplicant);

router.put('/:id/status', protect, updateApplicantStatus);

module.exports = router;
