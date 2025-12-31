const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      required: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      required: true,
      maxlength: 160,
    },
    keywords: [{
      type: String,
      trim: true,
    }],
    featuredImage: {
      type: mongoose.Schema.Types.Mixed, // Allows both String URL and Object {url, publicId}
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: Date,
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    categories: [{
      type: String,
      enum: ['visa-guide', 'requirements', 'tips', 'process', 'news'],
    }],
    ctaText: {
      type: String,
      default: 'Apply Now',
    },
    ctaLink: {
      type: String,
      default: '/application',
    },
    faqSchema: [{
      question: String,
      answer: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Generate slug from title if not provided
blogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate read time based on content (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  // Set publishedAt date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', keywords: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
