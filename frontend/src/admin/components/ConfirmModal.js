import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'OK', 
  cancelText = 'Cancel', 
  type = 'warning',
  requireInput = false,
  inputLabel = 'Remarks',
  inputPlaceholder = 'Enter remarks...'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (requireInput) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    setInputValue('');
    onClose();
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="confirm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={`confirm-modal-header ${type}`}>
              <div className="confirm-modal-icon">
                {type === 'warning' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                )}
                {type === 'danger' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
                {type === 'info' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                )}
              </div>
              <h3>{title || 'Confirm Action'}</h3>
            </div>

            <div className="confirm-modal-body">
              <p>{message}</p>
              
              {requireInput && (
                <div className="modal-input-group">
                  <label>{inputLabel}</label>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputPlaceholder}
                    rows="3"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="confirm-modal-footer">
              <button
                className="confirm-modal-btn cancel-btn"
                onClick={handleClose}
              >
                {cancelText}
              </button>
              <button
                className="confirm-modal-btn confirm-btn"
                onClick={handleConfirm}
                disabled={requireInput && !inputValue.trim()}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
