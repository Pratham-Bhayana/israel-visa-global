const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToCloudinary } = require('../services/cloudinaryService');

// Configure multer for memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: JPG, PNG, WebP, GIF, PDF. Received: ${file.mimetype}`
        ),
        false
      );
    }
  },
});

/**
 * POST /api/upload
 * Upload file to Cloudinary
 * Expected: multipart/form-data with 'file' field
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    // Get folder from query or body, default to 'payments'
    const folder = req.query.folder || req.body.folder || 'israel-visa/payments';

    // Upload to Cloudinary
    const secure_url = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      folder
    );

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: secure_url,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }
});

module.exports = router;
