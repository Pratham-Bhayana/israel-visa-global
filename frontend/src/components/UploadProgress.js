import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UploadProgress.css';

const UploadProgress = ({ isOpen, uploadProgress }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('upload-progress-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('upload-progress-open');
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.classList.remove('upload-progress-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="upload-progress-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Progress Modal */}
          <motion.div
            className="upload-progress-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="upload-progress-header">
              <div className="upload-icon-container">
                <motion.div
                  className="upload-icon"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </motion.div>
              </div>
              <h3>Uploading Documents</h3>
              <p>Please wait while we securely upload your documents...</p>
            </div>

            <div className="upload-progress-content">
              <div className="upload-checklist">
                {uploadProgress.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className={`upload-item ${item.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="upload-item-icon">
                      {item.status === 'pending' && (
                        <div className="status-icon pending">
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#e0e0e0"/>
                          </svg>
                        </div>
                      )}
                      {item.status === 'uploading' && (
                        <motion.div
                          className="status-icon uploading"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038B8" strokeWidth="2.5">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                          </svg>
                        </motion.div>
                      )}
                      {item.status === 'completed' && (
                        <motion.div
                          className="status-icon completed"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      )}
                      {item.status === 'error' && (
                        <motion.div
                          className="status-icon error"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#f44336"/>
                            <path d="M15 9l-6 6m0-6l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <div className="upload-item-details">
                      <span className="upload-item-name">{item.label}</span>
                      {item.status === 'completed' && (
                        <motion.span
                          className="upload-item-status success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Uploaded
                        </motion.span>
                      )}
                      {item.status === 'uploading' && (
                        <span className="upload-item-status uploading">Uploading...</span>
                      )}
                      {item.status === 'error' && (
                        <span className="upload-item-status error">Failed</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Overall Progress Bar */}
              <div className="upload-progress-bar-container">
                <div className="upload-progress-stats">
                  <span>
                    {uploadProgress.filter(i => i.status === 'completed').length} of {uploadProgress.length} completed
                  </span>
                  <span>
                    {Math.round((uploadProgress.filter(i => i.status === 'completed').length / uploadProgress.length) * 100)}%
                  </span>
                </div>
                <div className="upload-progress-bar">
                  <motion.div
                    className="upload-progress-fill"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(uploadProgress.filter(i => i.status === 'completed').length / uploadProgress.length) * 100}%`
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadProgress;
