const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Admin users to create
const adminUsers = [
  { email: 'rohitdubey@adminisrael.com', password: 'rohitdubey@2025', displayName: 'Rohit Dubey' },
  { email: 'seoraizinggroup@adminisrael.com', password: 'seoraizinggroup@2025', displayName: 'SEO Raizing Group' },
  { email: 'testingteam@adminisrael.com', password: 'testingteam@2025', displayName: 'Testing Team' },
  { email: 'bsr@adminisrael.com', password: 'bsr@2025', displayName: 'BSR' },
];

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected\n');

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log('⚠️  Admin exists:', adminData.email);
        
        // Update password
        existingAdmin.password = adminData.password;
        existingAdmin.role = 'admin';
        existingAdmin.authProvider = 'email';
        await existingAdmin.save();
        
        console.log('   ✅ Password updated');
      } else {
        // Create new admin user
        await User.create({
          email: adminData.email,
          password: adminData.password,
          displayName: adminData.displayName,
          role: 'admin',
          authProvider: 'email',
          isActive: true,
        });

        console.log('✅ Created:', adminData.email);
      }
      console.log('   🔑 Password:', adminData.password);
      console.log('');
    }

    console.log('\n✅ All admin users ready!');
    console.log('You can now login at: /admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

createAdmin();