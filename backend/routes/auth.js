const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { verifyRecaptcha } = require('../services/recaptchaService');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber, authProvider } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      displayName,
      phoneNumber,
      authProvider: authProvider || 'email',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('User found:', user.email, 'Has password:', !!user.password);

    // Check if user has a password (some users might only have OAuth)
    if (!user.password) {
      console.log('User has no password (OAuth user)');
      return res.status(401).json({
        success: false,
        message: 'This account uses social login. Please use Google or phone authentication.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('Password matched, generating token');

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    console.log('Login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { email, displayName, photoURL } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        displayName,
        photoURL,
        authProvider: 'google',
      });
    } else {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with Google authentication',
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/verify-phone
// @desc    Verify phone authentication with reCAPTCHA
// @access  Public
router.post('/verify-phone', async (req, res) => {
  try {
    const { phoneNumber, recaptchaToken, firebaseUid } = req.body;

    // Validate input
    if (!phoneNumber || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and Firebase UID are required',
      });
    }

    // Verify reCAPTCHA token if provided and credentials are configured
    if (recaptchaToken && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const isVerified = await verifyRecaptcha(recaptchaToken, 'LOGIN', 0.5);
      if (!isVerified) {
        console.log('reCAPTCHA verification failed, but continuing...');
        // Don't block authentication - Firebase already verified the phone
      }
    }

    // Check if user exists with this phone number
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // Create new user for phone authentication
      user = await User.create({
        phoneNumber,
        firebaseUid,
        authProvider: 'phone',
        displayName: `User ${phoneNumber.slice(-4)}`,
      });
    } else if (!user.firebaseUid) {
      // Update existing user with Firebase UID
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Phone authentication successful',
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying phone authentication',
      error: error.message,
    });
  }
});

// @route   GET /api/auth/test
// @desc    Test authentication setup
// @access  Public
router.get('/test', async (req, res) => {
  try {
    const jwtSecretExists = !!process.env.JWT_SECRET;
    const mongodbConnected = require('mongoose').connection.readyState === 1;
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    res.status(200).json({
      success: true,
      status: {
        jwtSecretConfigured: jwtSecretExists,
        mongodbConnected,
        totalUsers: userCount,
        adminUsers: adminCount,
        bcryptAvailable: !!require('bcryptjs'),
      },
      message: 'Authentication system check complete',
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking auth system',
      error: error.message,
    });
  }
});

module.exports = router;
