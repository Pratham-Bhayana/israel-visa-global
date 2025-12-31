const mongoose = require('mongoose');

const visaTypeSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    enum: ['Israel', 'India'],
    default: 'Israel',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  fee: {
    inr: {
      type: Number,
      required: true,
      min: 0,
    },
    usd: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  icon: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  processingTime: {
    type: String,
    default: '5-7 business days',
  },
  validity: {
    type: String,
    default: '90 days',
  },
  requirements: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  popular: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound unique index for country and slug combination
visaTypeSchema.index({ country: 1, slug: 1 }, { unique: true });
visaTypeSchema.index({ country: 1, name: 1 }, { unique: true });

// Index for faster queries
visaTypeSchema.index({ isActive: 1, order: 1 });
visaTypeSchema.index({ slug: 1 });

module.exports = mongoose.model('VisaType', visaTypeSchema);
