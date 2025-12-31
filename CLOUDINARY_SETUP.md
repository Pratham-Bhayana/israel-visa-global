# Cloudinary Setup Instructions

## Credentials (Stored)
- **Cloud Name:** dlwn3lssr
- **Key Name:** Root
- **API Key:** 678847195882717
- **API Secret:** pa7hje_vtuwtD2fKAxw08_Eg3Zk

## Configuration File
Created: `frontend/src/cloudinary.js`

## SDK Installation
✅ Cloudinary package installed

## Next Steps (To be implemented later)

1. **Create Upload Preset in Cloudinary Dashboard:**
   - Go to Settings → Upload → Upload Presets
   - Create a new preset named: `israel_visa_documents`
   - Set folder: `visa_documents`
   - Enable unsigned uploads (for client-side uploads)
   - Set allowed formats: jpg, jpeg, png, pdf
   - Set max file size: 10MB

2. **Integration with Application Form:**
   - Connect file upload handlers to Cloudinary API
   - Store Cloudinary URLs in application data
   - Add upload progress indicators
   - Implement file validation and error handling

3. **Backend Integration:**
   - Verify uploaded files from backend
   - Store Cloudinary URLs in MongoDB
   - Add file deletion functionality for admin

## Usage (When implemented)
```javascript
import cloudinaryConfig from './cloudinary';

// Upload example
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // Return the uploaded file URL
};
```

## Storage Structure
```
visa_documents/
  ├── passports/
  ├── photos/
  ├── documents/
  ├── bank_statements/
  └── tickets/
```
