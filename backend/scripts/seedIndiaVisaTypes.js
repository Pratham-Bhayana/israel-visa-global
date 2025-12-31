require('dotenv').config();
const mongoose = require('mongoose');
const VisaType = require('../models/VisaType');

const indiaVisaTypes = [
  {
    country: 'India',
    name: 'Tourist Visa',
    slug: 'india-tourist-visa',
    description: 'Perfect for tourists visiting India for sightseeing, recreation, or meeting friends and relatives.',
    fee: {
      inr: 6600,
      usd: 80,
    },
    icon: 'FaGlobe',
    processingTime: '3-5 business days',
    validity: '1 Year',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Recent passport-size photograph',
      'Copy of passport biographical page',
      'Proof of accommodation in India',
      'Return flight tickets',
    ],
    features: [
      'Valid for tourism and sightseeing',
      'Multiple entries allowed (30 days per entry)',
      'Quick online processing',
      'No embassy visit required',
    ],
    isActive: true,
    popular: true,
    order: 1,
  },
  {
    country: 'India',
    name: 'Business Visa',
    slug: 'india-business-visa',
    description: 'Designed for business travelers attending meetings, conferences, trade fairs, or exploring business opportunities in India.',
    fee: {
      inr: 8250,
      usd: 100,
    },
    icon: 'FaUserTie',
    processingTime: '3-5 business days',
    validity: '1 Year',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Recent passport-size photograph',
      'Business card or letter of introduction',
      'Proof of business activities in India',
      'Return flight tickets',
    ],
    features: [
      'Valid for business meetings and conferences',
      'Multiple entries allowed (180 days per entry)',
      'Fast-track processing available',
      'Suitable for trade fairs and exhibitions',
    ],
    isActive: true,
    popular: true,
    order: 2,
  },
  {
    country: 'India',
    name: 'Medical Visa',
    slug: 'india-medical-visa',
    description: 'For patients seeking medical treatment in India. Companion visa available for attendants.',
    fee: {
      inr: 6600,
      usd: 80,
    },
    icon: 'FaUsers',
    processingTime: '2-3 business days',
    validity: '120 Days',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Recent passport-size photograph',
      'Letter from Indian hospital/medical institution',
      'Medical documents and reports',
      'Proof of financial capability',
    ],
    features: [
      'Priority processing for urgent cases',
      'Triple entry allowed (60 days per entry)',
      'Medical attendant visa available',
      'Valid for medical treatment in recognized hospitals',
    ],
    isActive: true,
    popular: false,
    order: 3,
  },
  {
    country: 'India',
    name: 'Conference Visa',
    slug: 'india-conference-visa',
    description: 'Specifically for attending conferences, seminars, workshops organized by Government Ministries or Departments.',
    fee: {
      inr: 6600,
      usd: 80,
    },
    icon: 'FaUsers',
    processingTime: '3-5 business days',
    validity: '120 Days',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Recent passport-size photograph',
      'Conference invitation letter',
      'Event registration confirmation',
      'Proof of accommodation',
    ],
    features: [
      'Valid for attending conferences and seminars',
      'Single/multiple entry options',
      'Streamlined approval process',
      'Valid for government-approved events',
    ],
    isActive: true,
    popular: false,
    order: 4,
  },
  {
    country: 'India',
    name: 'Medical Attendant Visa',
    slug: 'india-medical-attendant-visa',
    description: 'For those accompanying a patient traveling to India for medical treatment.',
    fee: {
      inr: 6600,
      usd: 80,
    },
    icon: 'FaUsers',
    processingTime: '2-3 business days',
    validity: '120 Days',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Recent passport-size photograph',
      'Copy of patient\'s medical visa',
      'Relationship proof with patient',
      'Patient\'s medical documents',
    ],
    features: [
      'Linked to patient\'s medical visa',
      'Triple entry allowed',
      'Priority processing',
      'Maximum 2 attendants per patient',
    ],
    isActive: true,
    popular: false,
    order: 5,
  },
];

async function seedIndiaVisaTypes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/israel-visa');
    console.log('Connected to MongoDB');

    // Remove existing India visa types
    await VisaType.deleteMany({ country: 'India' });
    console.log('Cleared existing India visa types');

    // Insert new India visa types
    await VisaType.insertMany(indiaVisaTypes);
    console.log(`Seeded ${indiaVisaTypes.length} India visa types successfully!`);

    // Display the seeded visa types
    const visaTypes = await VisaType.find({ country: 'India' }).sort({ order: 1 });
    console.log('\nSeeded Visa Types:');
    visaTypes.forEach((visa, index) => {
      console.log(`${index + 1}. ${visa.name} - $${visa.fee.usd} (Order: ${visa.order})`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding India visa types:', error);
    process.exit(1);
  }
}

seedIndiaVisaTypes();
