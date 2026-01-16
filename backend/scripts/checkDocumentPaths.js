const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Application = require('../models/Application');

// Load environment variables
dotenv.config();

const checkAndFixDocumentPaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Find all applications with additional documents
    const applications = await Application.find({
      additionalDocuments: { $exists: true, $ne: [] }
    });

    console.log(`\nFound ${applications.length} applications with documents\n`);

    let fixedCount = 0;
    let validCount = 0;
    let issueCount = 0;

    for (const app of applications) {
      console.log(`\n📄 Application: ${app.applicationNumber}`);
      let appNeedsUpdate = false;

      for (let i = 0; i < app.additionalDocuments.length; i++) {
        const doc = app.additionalDocuments[i];
        console.log(`  Document ${i + 1}: ${doc.originalName || doc.filename}`);
        
        if (!doc.path) {
          console.log(`    ❌ Missing path!`);
          issueCount++;
        } else if (doc.path.startsWith('http://') || doc.path.startsWith('https://')) {
          console.log(`    ✅ Valid Cloudinary URL: ${doc.path.substring(0, 50)}...`);
          validCount++;
        } else if (doc.path.startsWith('/uploads')) {
          console.log(`    ⚠️  Local path (backend uploads): ${doc.path}`);
          console.log(`    ℹ️  This will work if backend has the file`);
          validCount++;
        } else {
          console.log(`    ⚠️  Unexpected path format: ${doc.path}`);
          issueCount++;
          
          // Try to fix if it's just a filename
          if (!doc.path.includes('/') && !doc.path.startsWith('http')) {
            console.log(`    🔧 Fixing: Converting filename to backend URL path`);
            app.additionalDocuments[i].path = `/uploads/additional-documents/${doc.path}`;
            appNeedsUpdate = true;
            fixedCount++;
          }
        }
      }

      // Save if any fixes were made
      if (appNeedsUpdate) {
        await app.save();
        console.log(`  💾 Application updated`);
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`   Valid documents: ${validCount}`);
    console.log(`   Fixed documents: ${fixedCount}`);
    console.log(`   Issues found: ${issueCount}`);
    
    if (issueCount > 0) {
      console.log(`\n⚠️  ${issueCount} documents have issues that need manual review`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

checkAndFixDocumentPaths();
