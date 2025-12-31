const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} filename - Original filename
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<string>} - Secure URL of uploaded file
 */
const uploadToCloudinary = async (fileBuffer, filename, folder = 'israel-visa') => {
  return new Promise((resolve, reject) => {
    // Remove extension from filename for public_id
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const safeFilename = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Determine resource type based on file extension
    const ext = filename.split('.').pop().toLowerCase();
    const resourceType = ext === 'pdf' ? 'raw' : 'auto';
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        public_id: `${Date.now()}-${safeFilename}`,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of file to delete
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
