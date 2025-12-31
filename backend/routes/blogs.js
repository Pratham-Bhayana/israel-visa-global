const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

console.log('✅ Blog routes loaded');

// @route   GET /api/blogs
// @desc    Get all published blogs (public)
// @access  Public
router.get('/', async (req, res) => {
  console.log('🎯 GET /api/blogs route hit!');
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'published' };
    
    if (category) {
      query.categories = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    console.log('Query:', query);
    console.log('Fetching blogs...');
    
    const blogs = await Blog.find(query)
      .select('-content') // Exclude full content for listing
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    console.log('Blogs found:', blogs.length);
    console.log('First blog:', blogs[0] ? blogs[0].title : 'none');
    
    const total = await Blog.countDocuments(query);
    console.log('Total count:', total);
    
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

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
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

// @route   GET /api/blogs/related/:slug
// @desc    Get related blogs
// @access  Public
router.get('/related/:slug', async (req, res) => {
  try {
    const currentBlog = await Blog.findOne({ slug: req.params.slug });
    
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    // Find blogs with similar categories
    const relatedBlogs = await Blog.find({
      _id: { $ne: currentBlog._id },
      status: 'published',
      categories: { $in: currentBlog.categories },
    })
      .select('-content')
      .limit(3)
      .sort({ publishedAt: -1 });
    
    res.status(200).json({
      success: true,
      blogs: relatedBlogs,
    });
  } catch (error) {
    console.error('Get related blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related blogs',
      error: error.message,
    });
  }
});

module.exports = router;
