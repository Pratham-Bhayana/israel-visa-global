const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// Get all eSIM orders
router.get('/esims', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, type, page = 1, limit = 20 } = req.query;
    
    const query = { 'esim.selected': true };
    
    if (status) {
      query['esim.status'] = status;
    }
    
    if (type) {
      query['esim.type'] = type;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('userId', 'name email phoneNumber')
      .select('applicationNumber fullName phoneNumber email esim paymentStatus paymentAmount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching eSIM orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch eSIM orders',
      error: error.message 
    });
  }
});

// Get eSIM statistics
router.get('/esims/stats', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Application.aggregate([
      { $match: { 'esim.selected': true } },
      {
        $group: {
          _id: '$esim.status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$esim.price' },
        },
      },
    ]);

    const typeStats = await Application.aggregate([
      { $match: { 'esim.selected': true } },
      {
        $group: {
          _id: '$esim.type',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalEsims = await Application.countDocuments({ 'esim.selected': true });

    res.json({
      success: true,
      stats: {
        total: totalEsims,
        byStatus: stats,
        byType: typeStats,
      },
    });
  } catch (error) {
    console.error('Error fetching eSIM stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch eSIM statistics',
      error: error.message 
    });
  }
});

// Update eSIM status
router.put('/esims/:applicationId', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { applicationId } = req.params;
    const { status, activationCode, qrCode } = req.body;

    const updateData = {
      'esim.status': status,
    };

    if (activationCode) {
      updateData['esim.activationCode'] = activationCode;
    }

    if (qrCode) {
      updateData['esim.qrCode'] = qrCode;
    }

    if (status === 'delivered') {
      updateData['esim.deliveredAt'] = new Date();
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      message: 'eSIM status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating eSIM status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update eSIM status',
      error: error.message 
    });
  }
});

// Update payment status and upload receipt
router.put('/applications/:applicationId/payment', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { applicationId } = req.params;
    const { paymentStatus, paymentReceipt } = req.body;

    const updateData = {};

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === 'completed') {
        updateData.paymentDate = new Date();
      }
    }

    if (paymentReceipt) {
      updateData.paymentReceipt = paymentReceipt;
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment information updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating payment information:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update payment information',
      error: error.message 
    });
  }
});

// Get all payments with filtering
router.get('/payments', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { paymentStatus: { $exists: true } };
    
    if (status && status !== 'all') {
      query.paymentStatus = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('userId', 'name email phoneNumber')
      .select('applicationNumber fullName phoneNumber email visaType paymentAmount paymentStatus paymentDate paymentReceipt createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payments',
      error: error.message 
    });
  }
});

// Get payment statistics
router.get('/payments/stats', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Application.aggregate([
      {
        $match: { paymentStatus: { $exists: true } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$paymentAmount', 0] }
          },
          totalPayments: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'processing'] }, 1, 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'processing'] }, '$paymentAmount', 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
          },
          completedAmount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$paymentAmount', 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
          },
          failedAmount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, '$paymentAmount', 0] }
          },
          refundedCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] }
          },
          refundedAmount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$paymentAmount', 0] }
          }
        }
      }
    ]);

    const data = stats[0] || {
      totalRevenue: 0,
      totalPayments: 0,
      pendingCount: 0,
      pendingAmount: 0,
      completedCount: 0,
      completedAmount: 0,
      failedCount: 0,
      failedAmount: 0,
      refundedCount: 0,
      refundedAmount: 0
    };

    res.json({
      success: true,
      stats: data,
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment statistics',
      error: error.message 
    });
  }
});

// Approve or reject a payment
router.put('/payments/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status || !['completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be completed, failed, or refunded' 
      });
    }

    const updateData = {
      paymentStatus: status,
      paymentDate: new Date()
    };

    if (status === 'failed' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userId', 'name email phoneNumber');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      message: `Payment ${status === 'completed' ? 'approved' : 'rejected'} successfully`,
      application,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update payment status',
      error: error.message 
    });
  }
});

module.exports = router;
