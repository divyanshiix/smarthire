const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${safeBaseName}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF files are allowed for resume uploads!'), false);
  }
};

const uploadResume = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max limit
  fileFilter: fileFilter
});

module.exports = uploadResume;
