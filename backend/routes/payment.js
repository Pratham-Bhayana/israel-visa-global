const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
  createOrder,
  verifyPaymentSignature,
  fetchPayment,
} = require('../services/razorpayService');
const Application = require('../models/Application');
const VisaType = require('../models/VisaType');
const { protect: auth } = require('../middleware/auth');

/**
 * POST /api/payment/create-order
 * Create a Razorpay order
 */
router.post('/create-order', auth, async (req, res) => {
  try {
    const { applicationId, esimPrice = 0 } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      });
    }

    // Fetch application details
    const application = await Application.findById(applicationId)
      .populate('visaType')
      .populate('userId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    console.log('🔍 Authorization check:');
    console.log('- Application userId:', application.userId._id.toString());
    console.log('- Application firebaseUid:', application.userId.firebaseUid);
    console.log('- Request user _id:', req.user._id.toString());
    console.log('- Request user firebaseUid:', req.user.firebaseUid);
    
    const userIdMatch = application.userId._id.toString() === req.user._id.toString();
    const firebaseUidMatch = application.userId.firebaseUid === req.user.firebaseUid;
    
    console.log('- userIdMatch:', userIdMatch);
    console.log('- firebaseUidMatch:', firebaseUidMatch);
    
    if (!userIdMatch && !firebaseUidMatch) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this application',
      });
    }

    // Check if payment already completed
    if (application.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this application',
      });
    }

    // Calculate total amount
    const visaFee = application.visaType.fee.inr;
    const totalAmount = visaFee + Number(esimPrice);

    // Create Razorpay order (receipt must be max 40 chars)
    const receiptId = `${application.applicationNumber}_${Date.now()}`.substring(0, 40);
    const notes = {
      applicationId: applicationId.toString(),
      applicationNumber: application.applicationNumber,
      visaType: application.visaType.name,
      applicantName: application.fullName,
      applicantEmail: application.userId.email,
      visaFee,
      esimPrice: Number(esimPrice),
      totalAmount,
    };

    const orderResult = await createOrder(totalAmount, 'INR', receiptId, notes);

    if (!orderResult.success) {
      console.error('Order creation failed:', orderResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: orderResult.error,
      });
    }

    // Store order details in application
    application.payment = {
      ...application.payment,
      razorpayOrderId: orderResult.order.id,
      amount: totalAmount,
      currency: 'INR',
      status: 'pending',
    };

    await application.save();

    res.json({
      success: true,
      order: orderResult.order,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: 'INR',
      applicationNumber: application.applicationNumber,
      applicantName: application.fullName,
      applicantEmail: application.userId.email,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

/**
 * POST /api/payment/verify
 * Verify Razorpay payment
 */
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
      esim,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters',
      });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Fetch payment details from Razorpay
    const paymentResult = await fetchPayment(razorpay_payment_id);

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details',
      });
    }

    const paymentDetails = paymentResult.payment;

    // Update application with payment details
    const application = await Application.findById(applicationId).populate('userId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    const userIdMatch = application.userId._id.toString() === req.user._id.toString();
    const firebaseUidMatch = application.userId.firebaseUid === req.user.firebaseUid;
    
    if (!userIdMatch && !firebaseUidMatch) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this application',
      });
    }

    // Update payment information
    application.payment = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: paymentDetails.amount / 100, // Convert from paise to INR
      currency: paymentDetails.currency,
      method: paymentDetails.method,
      status: paymentDetails.status,
      paidAt: new Date(paymentDetails.created_at * 1000),
    };

    application.paymentStatus = 'completed';
    application.status = 'under_review';

    // Add eSIM data if provided
    if (esim) {
      try {
        const esimData = typeof esim === 'string' ? JSON.parse(esim) : esim;
        application.esim = esimData;
      } catch (e) {
        console.error('Error parsing eSIM data:', e);
      }
    }

    await application.save();

    // Send confirmation email
    try {
      const emailService = require('../services/emailService');
      const populatedApp = await Application.findById(applicationId)
        .populate('visaType')
        .populate('userId');
      
      await emailService.sendPaymentConfirmationEmail(populatedApp);
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: paymentDetails.amount / 100,
        currency: paymentDetails.currency,
        status: paymentDetails.status,
      },
      application: {
        id: application._id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        paymentStatus: application.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
});

/**
 * POST /api/payment/webhook
 * Razorpay webhook endpoint for payment notifications
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body.toString();

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = JSON.parse(body);
    console.log('Razorpay Webhook Event:', event.event);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        // Payment captured successfully
        console.log('Payment captured:', event.payload.payment.entity.id);
        break;

      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', event.payload.payment.entity.id);
        break;

      case 'order.paid':
        // Order paid
        console.log('Order paid:', event.payload.order.entity.id);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
});

module.exports = router;
