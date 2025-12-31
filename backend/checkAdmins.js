const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkAdmins() {
  try {
    console.log('🔍 Checking admin users...\n');

    const adminEmails = [
      'rohitdubey@adminisrael.com',
      'seoraizinggroup@adminisrael.com',
      'testingteam@adminisrael.com',
      'bsr@adminisrael.com',
    ];

    for (const email of adminEmails) {
      const user = await User.findOne({ email }).select('+password');
      
      if (user) {
        console.log(`✅ ${email}`);
        console.log(`   Name: ${user.displayName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Has Password: ${!!user.password}`);
        
        // Test password
        const testPassword = email.split('@')[0] + '@2025';
        const isMatch = await user.comparePassword(testPassword);
        console.log(`   Password '${testPassword}' works: ${isMatch ? '✅ YES' : '❌ NO'}`);
        console.log('');
      } else {
        console.log(`❌ ${email} - NOT FOUND\n`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkAdmins();
