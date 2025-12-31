const express = require('express');
const router = express.Router();
const VisaType = require('../models/VisaType');
const { protect, adminOnly } = require('../middleware/auth');

// Get all active visa types (public)
router.get('/', async (req, res) => {
  try {
    const { country } = req.query;
    const query = { isActive: true };
    
    // Filter by country if specified
    if (country) {
      query.country = country;
    }
    
    const visaTypes = await VisaType.find(query)
      .sort({ order: 1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: visaTypes,
    });
  } catch (error) {
    console.error('Error fetching visa types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visa types',
      error: error.message,
    });
  }
});

// Admin routes - Get all visa types including inactive (must be before /:slug)
router.get('/all', async (req, res) => {
  try {
    const { country } = req.query;
    const query = {};
    
    // Filter by country if specified
    if (country) {
      query.country = country;
    }
    
    const visaTypes = await VisaType.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: visaTypes,
    });
  } catch (error) {
    console.error('Error fetching all visa types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visa types',
      error: error.message,
    });
  }
});

// Get single visa type by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const visaType = await VisaType.findOne({ 
      slug: req.params.slug,
      isActive: true,
    });
    
    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }
    
    res.json({
      success: true,
      data: visaType,
    });
  } catch (error) {
    console.error('Error fetching visa type:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visa type',
      error: error.message,
    });
  }
});

// Create new visa type (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const visaType = new VisaType(req.body);
    await visaType.save();
    
    res.status(201).json({
      success: true,
      data: visaType,
      message: 'Visa type created successfully',
    });
  } catch (error) {
    console.error('Error creating visa type:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating visa type',
      error: error.message,
    });
  }
});

// Update visa type (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const visaType = await VisaType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }
    
    res.json({
      success: true,
      data: visaType,
      message: 'Visa type updated successfully',
    });
  } catch (error) {
    console.error('Error updating visa type:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating visa type',
      error: error.message,
    });
  }
});

// Toggle visa type active status (admin only)
router.patch('/:id/toggle-status', protect, adminOnly, async (req, res) => {
  try {
    const visaType = await VisaType.findById(req.params.id);
    
    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }
    
    visaType.isActive = !visaType.isActive;
    await visaType.save();
    
    res.json({
      success: true,
      data: visaType,
      message: `Visa type ${visaType.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error toggling visa type status:', error);
    res.status(400).json({
      success: false,
      message: 'Error toggling visa type status',
      error: error.message,
    });
  }
});

// Delete visa type (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const visaType = await VisaType.findByIdAndDelete(req.params.id);
    
    if (!visaType) {
      return res.status(404).json({
        success: false,
        message: 'Visa type not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Visa type deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting visa type:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting visa type',
      error: error.message,
    });
  }
});

module.exports = router;
