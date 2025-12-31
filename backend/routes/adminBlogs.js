const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');

// Apply auth middleware to all admin blog routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/blogs
// @desc    Get all blogs (admin)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/blogs/:id
// @desc    Get single blog by ID (admin)
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message,
    });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create new blog (admin)
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message,
    });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update blog (admin)
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message,
    });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete blog (admin)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message,
    });
  }
});

module.exports = router;
