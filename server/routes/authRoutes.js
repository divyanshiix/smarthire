const express = require('express');
const router = express.Router();
const {
  registerRecruiter,
  loginRecruiter,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
