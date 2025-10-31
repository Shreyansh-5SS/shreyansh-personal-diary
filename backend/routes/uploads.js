const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
        console.log('Created uploads directory:', uploadDir);
      } catch (err) {
        console.error('Error creating uploads directory:', err);
        return cb(err);
      }
    }
    
    // Verify directory is writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Uploads directory is writable');
    } catch (err) {
      console.error('Uploads directory is not writable:', err);
      return cb(err);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Clean the original filename and add timestamp
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${cleanName}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

const router = express.Router();

router.post('/local', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Log the file details
  console.log('Uploaded file:', {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path
  });

  // Ensure the path uses forward slashes
  const normalizedPath = `/uploads/${req.file.filename}`.replace(/\\/g, '/');
  
  res.json({
    filename: req.file.filename,
    path: normalizedPath
  });
});

module.exports = router;