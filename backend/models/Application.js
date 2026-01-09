const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationNumber: {
      type: String,
      unique: true,
    },
    
    // Country Selection
    country: {
      type: String,
      enum: ['israel', 'india'],
      default: 'israel',
    },
    
    // Step 1: Visa Type
    visaType: {
      type: String,
      default: '',
    },
    
    // Step 2: Passport Information
    passportFront: String,
    passportBack: String,
    passportNumber: String,
    fullName: String,
    dateOfBirth: Date,
    placeOfBirth: String,
    nationality: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    passportIssueDate: Date,
    passportExpiryDate: Date,
    
    // Step 3: Travel Information
    travelPurpose: String,
    travelStartDate: Date,
    travelEndDate: Date,
    previousVisa: {
      type: String,
      enum: ['yes', 'no'],
    },
    multipleEntry: {
      type: String,
      enum: ['yes', 'no'],
    },
    placesToVisit: [String],
    visitPalestinianAuthority: {
      type: String,
      enum: ['yes', 'no'],
    },
    travelledToIsrael: {
      type: String,
      enum: ['yes', 'no'],
    },
    
    // Step 4: Contact Information
    phoneNumber: String,
    alternatePhone: String,
    whatsapp: String,
    telegram: String,
    homeAddress: String,
    city: String,
    state: String,
    pincode: String,
    
    // Step 5: Occupation
    occupation: String,
    companyName: String,
    designation: String,
    employmentType: String,
    
    // Step 6: Family Information
    fatherName: String,
    motherName: String,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
    },
    spouseName: String,
    spouseOccupation: String,
    
    // Step 7: Documents
    documents: {
      passportPages: [String],
      photo:[ String],
      requestLetter: [String],
      noc: [String],
      salarySlips:[ String],
      itinerary: [String],
      hotelBooking: [String],
      ticketReservation: [String],
      travelInsurance:[ String],
      bankStatement:[ String],
      aadharCard: [String],
      itrCertificate:[ String],
    },
    
    // eSIM Information
    esim: {
      selected: {
        type: Boolean,
        default: false,
      },
      data: String,
      price: Number,
      validity: String,
      type: {
        type: String,
        enum: ['limited', 'unlimited'],
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'activated', 'delivered', 'cancelled'],
        default: 'pending',
      },
      activationCode: String,
      qrCode: String,
      deliveredAt: Date,
    },
    
    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    paymentCurrency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: String,
    paymentTransactionId: String,
    paymentDate: Date,
    paymentProof: String,
    paymentReceipt: String,
    rejectionReason: String,
    
    // Application Status
    status: {
      type: String,
      enum: ['draft', 'pending_payment', 'pending', 'under_review', 'documents_required', 'documents_approved', 'sent_to_embassy', 'embassy_approved', 'embassy_rejected', 'approved', 'rejected'],
      default: 'draft',
    },
    
    // Admin Notes
    adminNotes: [{
      note: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    // Status History
    statusHistory: [{
      status: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      remarks: String,
    }],
    
    // Additional Documents (uploaded when documents_required)
    additionalDocuments: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    // Submission Date
    submittedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate unique application number
applicationSchema.pre('save', async function (next) {
  if (!this.applicationNumber) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `IV${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
