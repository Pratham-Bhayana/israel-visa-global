const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Protect routes - Authentication middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Try to verify as JWT first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }
      
      return next();
    } catch (jwtError) {
      // If JWT verification fails, treat it as a Firebase token
      // For development purposes, we'll extract user info from request headers
      // In production, you should verify Firebase tokens properly
      
      // Extract user email from Firebase (you'd decode the Firebase token here)
      const userEmail = req.headers['x-user-email']; // Frontend should send this
      const userName = req.headers['x-user-name'];
      const userUid = req.headers['x-user-uid'];
      
      if (!userEmail || !userUid) {
        console.error('JWT verification failed:', jwtError.message);
        return res.status(401).json({
          success: false,
          message: 'Invalid authentication token',
        });
      }
      
      // Find or create user
      let user = await User.findOne({ $or: [{ email: userEmail }, { firebaseUid: userUid }] });
      
      if (!user) {
        user = await User.create({
          name: userName || userEmail.split('@')[0],
          email: userEmail,
          firebaseUid: userUid,
          role: 'user',
          authProvider: 'firebase',
        });
      }
      
      req.user = user;
      return next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
};

module.exports.generateToken = generateToken;
