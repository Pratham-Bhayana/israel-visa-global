const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/content/:type
// @desc    Get content by type
// @access  Public
router.get('/:type', async (req, res) => {
  try {
    const content = await Content.find({
      type: req.params.type,
      isActive: true,
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: content.length,
      content,
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message,
    });
  }
});

// @route   POST /api/content
// @desc    Create content (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const content = await Content.create({
      ...req.body,
      updatedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content,
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content',
      error: error.message,
    });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id,
      },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      content,
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message,
    });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message,
    });
  }
});

module.exports = router;
