const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Get admin credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@israelvisa.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
      
      // Update password if needed
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.authProvider = 'email';
      await existingAdmin.save();
      
      console.log('✅ Admin password updated successfully');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    } else {
      // Create new admin user
      const admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Admin',
        role: 'admin',
        authProvider: 'email',
        isActive: true,
      });

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    }

    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('You can now login at: /admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

createAdmin();
