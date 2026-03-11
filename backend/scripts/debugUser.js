const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOne({ email: 'rohitdubey@adminisrael.com' }).select('+password');
  
  console.log('User found:', !!user);
  console.log('Role:', user?.role);
  console.log('Has password:', !!user?.password);
  console.log('Password length:', user?.password?.length);
  console.log('Is bcrypt hash:', user?.password?.startsWith('$2'));
  
  // Test password comparison
  if (user?.password) {
    const testPassword = 'rohitdubey@2025';
    const match = await bcrypt.compare(testPassword, user.password);
    console.log('Password match test:', match);
    
    // If not matching, let's rehash and update
    if (!match) {
      console.log('\nPassword mismatch - rehashing...');
      const newHash = await bcrypt.hash(testPassword, 12);
      await User.updateOne(
        { email: 'rohitdubey@adminisrael.com' },
        { $set: { password: newHash } }
      );
      console.log('Password updated directly in DB');
    }
  }
  
  process.exit(0);
}

debug().catch(err => {
  console.error(err);
  process.exit(1);
});
