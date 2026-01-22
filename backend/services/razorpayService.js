const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {Number} amount - Amount in INR (will be converted to paise)
 * @param {String} currency - Currency code (default: INR)
 * @param {String} receipt - Receipt ID for reference
 * @param {Object} notes - Additional notes
 * @returns {Promise<Object>} - Razorpay order object
 */
const createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency,
      receipt,
      notes,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create order',
      details: error.error 
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} - Whether signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Signature Verification Error:', error);
    return false;
  }
};

/**
 * Fetch payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} - Payment details
 */
const fetchPayment = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return { success: true, payment };
  } catch (error) {
    console.error('Razorpay Fetch Payment Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to fetch payment',
      details: error.error 
    };
  }
};

/**
 * Fetch order details
 * @param {String} orderId - Razorpay order ID
 * @returns {Promise<Object>} - Order details
 */
const fetchOrder = async (orderId) => {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay Fetch Order Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to fetch order',
      details: error.error 
    };
  }
};

/**
 * Refund a payment (full or partial)
 * @param {String} paymentId - Razorpay payment ID
 * @param {Number} amount - Amount to refund in paise (optional, full refund if not provided)
 * @returns {Promise<Object>} - Refund details
 */
const refundPayment = async (paymentId, amount = null) => {
  try {
    const refundOptions = amount ? { amount: Math.round(amount * 100) } : {};
    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    return { success: true, refund };
  } catch (error) {
    console.error('Razorpay Refund Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to process refund',
      details: error.error 
    };
  }
};

module.exports = {
  razorpay,
  createOrder,
  verifyPaymentSignature,
  fetchPayment,
  fetchOrder,
  refundPayment,
};
