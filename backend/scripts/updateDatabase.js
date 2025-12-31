require('dotenv').config();
const mongoose = require('mongoose');
const VisaType = require('../models/VisaType');

async function updateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/israel-visa');
    console.log('✅ MongoDB Connected');

    // Drop old indexes
    try {
      await VisaType.collection.dropIndex('name_1');
      console.log('✅ Dropped old name index');
    } catch (error) {
      console.log('ℹ️  name_1 index not found (already dropped or never existed)');
    }

    try {
      await VisaType.collection.dropIndex('slug_1');
      console.log('✅ Dropped old slug index');
    } catch (error) {
      console.log('ℹ️  slug_1 index not found (already dropped or never existed)');
    }

    // Clear all existing visa types
    const deleted = await VisaType.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing visa types`);

    // Create new indexes as defined in the model
    await VisaType.createIndexes();
    console.log('✅ Created new indexes');

    // List all indexes
    const indexes = await VisaType.collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`   - ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Database updated successfully!');
    console.log('Now you can run the seed scripts:');
    console.log('  - node scripts/seedVisaTypes.js (for Israel visas)');
    console.log('  - node scripts/seedIndiaVisaTypes.js (for India visas)');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error updating database:', error);
    process.exit(1);
  }
}

updateDatabase();
