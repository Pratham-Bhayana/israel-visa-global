const express = require('express');
const router = express.Router();
const multer = require('multer');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const emailService = require('../services/emailService');
const { uploadToCloudinary } = require('../services/cloudinaryService');

// Configure multer for memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF allowed'), false);
    }
  }
});

// @route   POST /api/applications
// @desc    Save visa application (not yet submitted - pending payment)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('Received application data:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user.id);
    
    const application = await Application.create({
      userId: req.user.id,
      ...req.body,
      submittedAt: null, // Will be set after payment
    });

    // Don't send confirmation email yet - wait for payment
    // await emailService.sendApplicationConfirmation(req.user.email, {
    //   applicationNumber: application.applicationNumber,
    //   applicantName: application.fullName,
    // });

    res.status(201).json({
      success: true,
      message: 'Application saved successfully',
      application: {
        id: application._id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        paymentStatus: application.paymentStatus,
        paymentAmount: application.paymentAmount,
      },
    });
  } catch (error) {
    console.error('Application submission error:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
});

// @route   GET /api/applications
// @desc    Get user's applications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('visaType', 'name category')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
});

// @route   POST /api/applications/:id/payment
// @desc    Process payment for application
// @access  Private
router.post('/:id/payment', protect, async (req, res) => {
  try {
    const { paymentMethod, transactionId, paymentProof, esim } = req.body;
    
    // Validate required fields
    if (!paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and transaction ID are required',
      });
    }
    
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this application',
      });
    }

    // Check if payment is already completed
    if (application.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this application',
      });
    }

    // Update payment information
    application.paymentStatus = 'processing';
    application.paymentMethod = paymentMethod;
    application.paymentTransactionId = transactionId;
    application.paymentDate = Date.now();
    
    // Store payment proof URL if provided (uploaded to Cloudinary by frontend)
    if (paymentProof) {
      application.paymentProof = paymentProof;
    }
    
    application.status = 'pending'; // Move to pending review
    application.submittedAt = Date.now();
    
    // Parse eSIM data if it's a string
    let esimData = esim;
    if (typeof esim === 'string') {
      try {
        esimData = JSON.parse(esim);
      } catch (e) {
        esimData = null;
      }
    }
    
    // Store eSIM information if selected
    if (esimData && esimData.selected) {
      application.esim = {
        selected: true,
        data: esimData.data,
        price: esimData.price,
        validity: esimData.validity,
        type: esimData.type,
        status: 'pending',
      };
    }
    
    await application.save();

    // Send confirmation email
    await emailService.sendApplicationConfirmation(req.user.email, {
      applicationNumber: application.applicationNumber,
      applicantName: application.fullName || req.user.displayName,
      paymentAmount: application.paymentAmount,
      esim: esimData && esimData.selected ? esimData : null,
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('application:payment', {
        applicationNumber: application.applicationNumber,
        userId: req.user.id,
        paymentStatus: 'processing',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment submitted successfully. Your application is now under review.',
      data: {
        applicationNumber: application.applicationNumber,
        paymentStatus: application.paymentStatus,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message,
    });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('visaType', 'name category');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message,
    });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Don't allow updates to submitted applications
    if (application.submittedAt) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a submitted application',
      });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message,
    });
  }
});

// @route   POST /api/applications/:id/upload-documents
// @desc    Upload additional documents for documents_required status
// @access  Private
router.post('/:id/upload-documents', protect, upload.array('documents', 10), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Check if status is documents_required
    if (application.status !== 'documents_required') {
      return res.status(400).json({
        success: false,
        message: 'Documents can only be uploaded when status is documents_required',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
      });
    }

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, file.originalname, 'israel-visa/documents')
        .catch(err => {
          console.error(`Failed to upload ${file.originalname}:`, err);
          throw new Error(`Failed to upload ${file.originalname}: ${err.message}`);
        })
    );

    let cloudinaryUrls;
    try {
      cloudinaryUrls = await Promise.all(uploadPromises);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload documents to cloud storage',
        error: uploadError.message
      });
    }

    // Store uploaded file URLs in database
    const uploadedFiles = req.files.map((file, index) => ({
      filename: file.originalname,
      originalName: file.originalname,
      path: cloudinaryUrls[index], // Store Cloudinary URL instead of local path
      size: file.size,
      uploadedAt: new Date()
    }));

    console.log('Uploaded files to be stored:', JSON.stringify(uploadedFiles, null, 2));

    // Initialize additionalDocuments array if it doesn't exist
    if (!application.additionalDocuments) {
      application.additionalDocuments = [];
    }

    // Add uploaded files to application
    application.additionalDocuments.push(...uploadedFiles);

    // Add a note that documents were uploaded
    application.adminNotes.push({
      note: `User uploaded ${uploadedFiles.length} document(s)`,
      addedBy: req.user.id,
      addedAt: new Date(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading documents',
    });
  }
});

module.exports = router;
