const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['visa_type', 'location', 'price', 'faq', 'settings'],
      required: true,
    },
    
    // For Visa Types
    visaName: String,
    duration: String,
    price: String,
    currency: {
      type: String,
      default: 'USD',
    },
    features: [String],
    isPopular: {
      type: Boolean,
      default: false,
    },
    
    // For Locations
    locationName: String,
    description: String,
    image: String,
    
    // For FAQs
    question: String,
    answer: String,
    category: String,
    order: Number,
    
    // For Settings
    settingKey: String,
    settingValue: mongoose.Schema.Types.Mixed,
    
    // Common fields
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Content', contentSchema);
