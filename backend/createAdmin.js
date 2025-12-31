const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdmin() {
  try {
    // New admin credentials
    const adminEmail = 'pb@admin.com';
    const adminPassword = 'Pb@2004';

    console.log('🔍 Checking for existing admin...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  Admin user found. Deleting...');
      await User.deleteOne({ email: adminEmail });
      console.log('✅ Old admin deleted');
    }

    console.log('� Creating admin in database...');
    // DON'T hash here - the User model will do it automatically in pre-save hook
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword, // Plain password - model will hash it
      displayName: 'PB Admin',
      role: 'admin',
      authProvider: 'email',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role:', admin.role);
    console.log('🆔 User ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test password verification
    console.log('\n🧪 Testing password verification...');
    const testUser = await User.findOne({ email: adminEmail }).select('+password');
    const isMatch = await testUser.comparePassword(adminPassword);
    console.log('Password verification result:', isMatch ? '✅ PASS' : '❌ FAIL');
    
    if (isMatch) {
      console.log('\n🎉 SUCCESS! You can now login at: http://localhost:3000/admin/login');
    } else {
      console.log('\n❌ ERROR: Password verification failed. Please contact support.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
