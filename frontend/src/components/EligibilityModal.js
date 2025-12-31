import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './EligibilityModal.css';

const EligibilityModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applyingFrom: '',
    nationality: '',
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const countries = [
    'India',
    'Sri Lanka',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Other',
  ];

  const nationalities = [
    'Indian',
    'Sri Lankan',
    'American',
    'British',
    'Canadian',
    'Australian',
    'German',
    'French',
    'Other',
  ];

  const checkEligibility = () => {
    // E-visa eligibility rules:
    // 1. Indians applying from India
    // 2. Sri Lankans (from anywhere)
    
    const isIndianFromIndia = formData.nationality === 'Indian' && formData.applyingFrom === 'India';
    const isSriLankan = formData.nationality === 'Sri Lankan';
    
    if (isIndianFromIndia || isSriLankan) {
      setEligibilityResult('eligible');
    } else {
      setEligibilityResult('not-eligible');
    }
    setStep(2);
  };

  const handleContinue = () => {
    if (eligibilityResult === 'eligible') {
      // Save eligibility information
      const eligibilityData = {
        isEligible: true,
        visaType: 'e-visa',
        applyingFrom: formData.applyingFrom,
        nationality: formData.nationality,
        checkedAt: new Date().toISOString()
      };
      
      // Store in sessionStorage for the application form
      sessionStorage.setItem('eVisaEligibility', JSON.stringify(eligibilityData));
      
      onClose();
      // Navigate to application with e-visa pre-selected
      navigate('/apply?evisa=true');
    } else {
      // Save that user is not eligible
      const eligibilityData = {
        isEligible: false,
        visaType: 'regular',
        applyingFrom: formData.applyingFrom,
        nationality: formData.nationality,
        checkedAt: new Date().toISOString()
      };
      
      sessionStorage.setItem('eVisaEligibility', JSON.stringify(eligibilityData));
      
      onClose();
      navigate('/apply');
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({ applyingFrom: '', nationality: '' });
    setEligibilityResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="eligibility-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="eligibility-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="modal-close" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {step === 1 ? (
              <div className="eligibility-content">
                <div className="modal-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0038B8" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <h2>Check e-Visa Eligibility</h2>
                <p className="modal-subtitle">
                  Please provide the following information to check if you're eligible for Israel e-Visa
                </p>

                <div className="eligibility-form">
                  <div className="form-group">
                    <label>Where are you applying from? *</label>
                    <select
                      value={formData.applyingFrom}
                      onChange={(e) => setFormData({ ...formData, applyingFrom: e.target.value })}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>What is your nationality? *</label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      required
                    >
                      <option value="">Select nationality</option>
                      {nationalities.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="info-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038B8" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <div>
                      <strong>e-Visa Eligibility:</strong>
                      <p>Currently, Israel e-Visa is available for:</p>
                      <ul>
                        <li>Indian citizens applying from India</li>
                        <li>Sri Lankan citizens</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    onClick={checkEligibility}
                    disabled={!formData.applyingFrom || !formData.nationality}
                  >
                    Check Eligibility
                  </button>
                </div>
              </div>
            ) : (
              <div className="eligibility-content">
                {eligibilityResult === 'eligible' ? (
                  <>
                    <div className="modal-icon success">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h2>You're Eligible! 🎉</h2>
                    <p className="modal-subtitle success">
                      Great news! You qualify for Israel e-Visa application.
                    </p>

                    <div className="result-details">
                      <div className="detail-item">
                        <span className="label">Applying From:</span>
                        <span className="value">{formData.applyingFrom}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Nationality:</span>
                        <span className="value">{formData.nationality}</span>
                      </div>
                    </div>

                    <div className="info-box success">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      <div>
                        <strong>Next Steps:</strong>
                        <p>Click 'Continue to Application' to proceed with your e-Visa application.</p>
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button className="btn btn-outline" onClick={handleReset}>
                        Check Again
                      </button>
                      <button className="btn btn-primary" onClick={handleContinue}>
                        Continue to Application
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="modal-icon error">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <h2>Not Eligible for e-Visa</h2>
                    <p className="modal-subtitle error">
                      Based on your information, you're not eligible for e-Visa at this time.
                    </p>

                    <div className="result-details">
                      <div className="detail-item">
                        <span className="label">Applying From:</span>
                        <span className="value">{formData.applyingFrom}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Nationality:</span>
                        <span className="value">{formData.nationality}</span>
                      </div>
                    </div>

                    <div className="info-box warning">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div>
                        <strong>Alternative Option:</strong>
                        <p>Don't worry! You can still apply for a regular Israel visa. Click below to proceed with the standard visa application.</p>
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button className="btn btn-outline" onClick={handleReset}>
                        Check Again
                      </button>
                      <button className="btn btn-primary" onClick={handleContinue}>
                        Apply for Regular Visa
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EligibilityModal;
