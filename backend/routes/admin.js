const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const Content = require('../models/Content');
const VisaType = require('../models/VisaType');
const { protect, adminOnly } = require('../middleware/auth');
const emailService = require('../services/emailService');

// Apply auth middleware to all admin routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const underReviewApplications = await Application.countDocuments({ status: 'under_review' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'email displayName')
      .select('applicationNumber fullName status createdAt visaType');

    // Applications by visa type
    const applicationsByType = await Application.aggregate([
      {
        $group: {
          _id: '$visaType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Applications by status over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsTimeline = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalApplications,
        pendingApplications,
        underReviewApplications,
        approvedApplications,
        rejectedApplications,
        totalUsers,
      },
      recentApplications,
      applicationsByType,
      applicationsTimeline,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications with filters
// @access  Private/Admin
router.get('/applications', async (req, res) => {
  try {
    const { status, visaType, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (visaType) query.visaType = visaType;
    if (search) {
      query.$or = [
        { applicationNumber: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'email displayName');

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
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

// @route   GET /api/admin/applications/:id
// @desc    Get single application with full details
// @access  Private/Admin
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'email displayName phoneNumber')
      .populate('adminNotes.addedBy', 'displayName')
      .populate('statusHistory.changedBy', 'displayName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
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

// @route   PUT /api/admin/applications/:id/status
// @desc    Update application status
// @access  Private/Admin
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.id).populate('userId', 'email displayName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Update status
    application.status = status;

    // Add to status history
    application.statusHistory.push({
      status,
      changedBy: req.user.id,
      changedAt: Date.now(),
      remarks,
    });

    await application.save();

    // Send email notification
    await emailService.sendStatusUpdate(application.userId.email, {
      applicationNumber: application.applicationNumber,
      applicantName: application.fullName,
      status,
      remarks,
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('application:status_updated', {
      applicationId: application._id,
      applicationNumber: application.applicationNumber,
      status,
      userId: application.userId._id,
    });

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message,
    });
  }
});

// @route   POST /api/admin/applications/:id/notes
// @desc    Add admin note to application
// @access  Private/Admin
router.post('/applications/:id/notes', async (req, res) => {
  try {
    const { note } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.adminNotes.push({
      note,
      addedBy: req.user.id,
      addedAt: Date.now(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      application,
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Visa Types Management Routes

// @route   POST /api/admin/visa-types
// @desc    Create new visa type
// @access  Private/Admin
router.post('/visa-types', async (req, res) => {
  try {
    const { name, description, fee, processingTime, validity, isActive } = req.body;

    const visaType = await VisaType.create({
      name,
      description,
      fee,
      processingTime,
      validity,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Visa type created successfully',
      visaType,
    });
  } catch (error) {
    console.error('Create visa type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating visa type',
      error: error.message,
    });
  }
});

// @route   PUT /api/admin/visa-types/:id
// @desc    Update visa type
// @access  Private/Admin
router.put('/visa-types/:id', async (req, res) => {
  try {
    const { name, description, fee, processingTime, validity, isActive } = req.body;

    const visaType = await VisaType.findByIdAndUpdate(
      req.params.id,
      { name, description, fee, processingTime, validity, isActive },
      { new: true, runValidators: true }
    );

    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Visa type updated successfully',
      visaType,
    });
  } catch (error) {
    console.error('Update visa type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating visa type',
      error: error.message,
    });
  }
});

// @route   DELETE /api/admin/visa-types/:id
// @desc    Delete visa type
// @access  Private/Admin
router.delete('/visa-types/:id', async (req, res) => {
  try {
    const visaType = await VisaType.findByIdAndDelete(req.params.id);

    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Visa type deleted successfully',
    });
  } catch (error) {
    console.error('Delete visa type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting visa type',
      error: error.message,
    });
  }
});

module.exports = router;
