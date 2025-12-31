const mongoose = require('mongoose');
const VisaType = require('../models/VisaType');
require('dotenv').config();

const visaTypes = [
  {
    country: 'Israel',
    name: 'Tourist Visa',
    slug: 'tourist',
    description: 'For leisure and sightseeing',
    fee: {
      inr: 8200,
      usd: 99,
    },
    icon: 'FaPassport',
    processingTime: '5-7 business days',
    validity: '90 Days',
    order: 1,
    isActive: true,
    popular: false,
    requirements: [
      'Valid passport',
      'Recent photograph',
      'Travel itinerary',
      'Hotel booking confirmation',
    ],
    features: [
      'Single Entry',
      'Valid for 90 days',
      'Tourism purposes',
      'Fast processing',
    ],
  },
  {
    country: 'Israel',
    name: 'Business Visa',
    slug: 'business',
    description: 'For business meetings and conferences',
    fee: {
      inr: 12300,
      usd: 149,
    },
    icon: 'FaBriefcase',
    processingTime: '3-5 business days',
    validity: '180 Days',
    order: 2,
    isActive: true,
    popular: true,
    requirements: [
      'Valid passport',
      'Invitation letter from Israeli company',
      'Company registration documents',
      'Bank statements',
    ],
    features: [
      'Multiple Entry',
      'Valid for 180 days',
      'Business meetings',
      'Priority support',
    ],
  },
  {
    country: 'Israel',
    name: 'Student Visa',
    slug: 'student',
    description: 'For academic studies',
    fee: {
      inr: 16400,
      usd: 199,
    },
    icon: 'FaGraduationCap',
    processingTime: '7-10 business days',
    validity: '1 Year',
    order: 3,
    isActive: true,
    popular: false,
    requirements: [
      'Valid passport',
      'Admission letter from Israeli university',
      'Proof of financial support',
      'Medical insurance',
    ],
    features: [
      'Multiple Entry',
      'Valid for 1 year',
      'Study purposes',
      'Extendable',
    ],
  },
  {
    country: 'Israel',
    name: 'Work Visa',
    slug: 'work',
    description: 'For employment purposes',
    fee: {
      inr: 21000,
      usd: 249,
    },
    icon: 'FaClock',
    processingTime: '10-14 business days',
    validity: '2 years',
    order: 4,
    isActive: true,
    popular: false,
    requirements: [
      'Valid passport',
      'Work permit from Israeli Ministry',
      'Employment contract',
      'Employer sponsorship letter',
    ],
    features: [
      'Multiple Entry',
      'Valid for 2 years',
      'Employment purposes',
      'Renewable',
    ],
  },
  {
    country: 'Israel',
    name: 'Medical Visa',
    slug: 'medical',
    description: 'For medical treatment',
    fee: {
      inr: 16400,
      usd: 199,
    },
    icon: 'FaUserTie',
    processingTime: '3-5 business days',
    validity: '90 days',
    order: 5,
    isActive: true,
    popular: false,
    requirements: [
      'Valid passport',
      'Medical documents from Israeli hospital',
      'Appointment confirmation',
      'Financial proof for treatment',
    ],
    features: [
      'Single Entry',
      'Valid for 90 days',
      'Medical treatment',
      'Fast approval',
    ],
  },
  {
    country: 'Israel',
    name: 'Transit Visa',
    slug: 'transit',
    description: 'For airport transit',
    fee: {
      inr: 4100,
      usd: 49,
    },
    icon: 'FaPlaneArrival',
    processingTime: '2-3 business days',
    validity: '48 hours',
    order: 6,
    isActive: true,
    popular: false,
    requirements: [
      'Valid passport',
      'Flight tickets showing transit',
      'Visa for final destination (if required)',
    ],
    features: [
      'Single Entry',
      'Valid for 48 hours',
      'Airport transit only',
      'Quick processing',
    ],
  },
];

const seedVisaTypes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing Israel visa types only
    await VisaType.deleteMany({ country: 'Israel' });
    console.log('🗑️  Cleared existing Israel visa types');

    // Insert new Israel visa types
    const created = await VisaType.insertMany(visaTypes);
    console.log(`✅ Created ${created.length} Israel visa types:`);
    
    created.forEach(vt => {
      console.log(`   - ${vt.name}: ₹${vt.fee.inr} / $${vt.fee.usd} (${vt.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('\n✅ Israel visa types seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding visa types:', error);
    process.exit(1);
  }
};

seedVisaTypes();
