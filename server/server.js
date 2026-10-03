const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resume files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'SmartHire ATS API',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌐 SmartHire ATS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
