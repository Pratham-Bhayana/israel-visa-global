const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createMultipleAdmins() {
  try {
    const admins = [
      {
        email: 'rohitdubey@adminisrael.com',
        password: 'rohitdubey@2025',
        displayName: 'Rohit Dubey',
      },
      {
        email: 'seoraizinggroup@adminisrael.com',
        password: 'seoraizinggroup@2025',
        displayName: 'SEO Raizing Group',
      },
      {
        email: 'testingteam@adminisrael.com',
        password: 'testingteam@2025',
        displayName: 'Testing Team',
      },
      {
        email: 'bsr@adminisrael.com',
        password: 'bsr@2025',
        displayName: 'BSR',
      },
    ];

    console.log('🚀 Creating admin users...\n');

    for (const adminData of admins) {
      console.log(`🔍 Processing ${adminData.displayName}...`);
      
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`⚠️  ${adminData.displayName} already exists. Updating...`);
        await User.deleteOne({ email: adminData.email });
      }

      // Create admin user
      const admin = await User.create({
        email: adminData.email,
        password: adminData.password, // Model will hash it
        displayName: adminData.displayName,
        role: 'admin',
        authProvider: 'email',
        isActive: true
      });

      console.log(`✅ ${adminData.displayName} created successfully!`);
      console.log(`   📧 Email: ${adminData.email}`);
      console.log(`   🔑 Password: ${adminData.password}`);
      console.log(`   🆔 User ID: ${admin._id}\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ All admin users created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Login Credentials:\n');
    
    admins.forEach(admin => {
      console.log(`${admin.displayName}:`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${admin.password}\n`);
    });

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

createMultipleAdmins();
