import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Application.css';

const Application = () => {
  const [step, setStep] = React.useState(1);
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Step 1: Passport Details (OCR extracted)
    passportFront: null,
    passportBack: null,
    travelDocumentType: '',
    passportNumber: '',
    passportCountryCode: '',
    nationality: '',
    isBiometric: '',
    familyName: '',
    givenName: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    
    // Step 2: Travel Information
    visitPurpose: '',
    arrivalDate: '',
    stayDuration: '',
    previousVisaApproved: '',
    previousApprovalReference: '',
    multipleEntry: '',
    multipleEntryReason: '',
    placesToVisit: '',
    palestinianAuthorityStay: '',
    currentCountry: '',
    palestinianAuthorityStayPlanned: '',
    cogatCertification: '',
    
    // Step 3: Contact Information
    mobilePhone: '',
    additionalPhone: '',
    socialNetworkAccount: '',
    
    // Step 4: Occupation
    occupation: '',
    employer: '',
    
    // Step 5: Family Information
    maritalStatus: '',
    spouseName: '',
    spouseDateOfBirth: '',
    spouseNationality: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload and OCR processing
      setTimeout(() => {
        setFormData({
          ...formData,
          [e.target.name]: file,
        });
        
        // Simulate OCR extraction (in production, call your OCR API here)
        if (e.target.name === 'passportFront') {
          // Mock OCR data - replace with actual OCR API call
          setFormData(prev => ({
            ...prev,
            passportFront: file,
            travelDocumentType: 'Ordinary',
            passportNumber: '',
            passportCountryCode: '',
            nationality: '',
            isBiometric: '',
            familyName: '',
            givenName: '',
            dateOfIssue: '',
            dateOfExpiry: '',
            dateOfBirth: '',
            placeOfBirth: '',
            gender: '',
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [e.target.name]: file,
          }));
        }
        
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 2000);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save form data to backend/database
    // This should include API call to save user application data
    toast.success('Application saved successfully! Redirecting to payment...');
    // Here you would redirect to payment page or save to profile
    // Example: navigate('/payment') or saveToProfile(formData)
  };

  return (
    <>
      <Helmet>
        <title>Apply for Visa - Israel Visa Application</title>
        <meta name="description" content="Apply for your Israel visa - Complete the application form" />
      </Helmet>

      <div className="application-page">
        <div className="application-container">

          <div className="application-content">
            <div className="progress-sidebar">
              <div className="progress-line">
                <div className="progress-fill" style={{ height: `${((step - 1) / 5) * 100}%` }}></div>
              </div>
              <div className="progress-steps">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className={`progress-step ${step >= num ? 'active' : ''}`}>
                    <div className="step-number">{num}</div>
                    <div className="step-label">
                      {num === 1 && 'Passport'}
                      {num === 2 && 'Travel Info'}
                      {num === 3 && 'Contact'}
                      {num === 4 && 'Occupation'}
                      {num === 5 && 'Family'}
                      {num === 6 && 'Review'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-wrapper">
              <motion.div
                className="application-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1>Israel Visa Application Form</h1>
                <p>Complete all steps to submit your application</p>
              </motion.div>

              <motion.form
                className="application-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
            {step === 1 && (
              <div className="form-step">
                <h2>Personal Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="visaType">Visa Type *</label>
                    <select
                      id="visaType"
                      name="visaType"
                      value={formData.visaType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select visa type</option>
                      <option value="tourist">Tourist Visa</option>
                      <option value="business">Business Visa</option>
                      <option value="student">Student Visa</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="As per passport"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nationality">Nationality *</label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="Your nationality"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="passportNumber">Passport Number *</label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      placeholder="Passport number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passportExpiry">Passport Expiry *</label>
                    <input
                      type="date"
                      id="passportExpiry"
                      name="passportExpiry"
                      value={formData.passportExpiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Travel Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="travelPurpose">Purpose of Travel *</label>
                    <textarea
                      id="travelPurpose"
                      name="travelPurpose"
                      value={formData.travelPurpose}
                      onChange={handleChange}
                      placeholder="Describe the purpose of your visit"
                      rows="4"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="arrivalDate">Arrival Date *</label>
                    <input
                      type="date"
                      id="arrivalDate"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="departureDate">Departure Date *</label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="accommodation">Accommodation Details *</label>
                    <textarea
                      id="accommodation"
                      name="accommodation"
                      value={formData.accommodation}
                      onChange={handleChange}
                      placeholder="Hotel name and address or host details"
                      rows="4"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Upload Documents</h2>

                <div className="upload-info">
                  <p>Please upload clear, high-quality scans or photos of your documents</p>
                  <p>Accepted formats: JPG, PNG, PDF (Max 5MB each)</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="passport">Passport Copy *</label>
                    <input
                      type="file"
                      id="passport"
                      name="passport"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                    />
                    {formData.documents.passport && (
                      <p className="file-name">{formData.documents.passport.name}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="photo">Passport Photo *</label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                      required
                    />
                    {formData.documents.photo && (
                      <p className="file-name">{formData.documents.photo.name}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="itinerary">Travel Itinerary *</label>
                    <input
                      type="file"
                      id="itinerary"
                      name="itinerary"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                    />
                    {formData.documents.itinerary && (
                      <p className="file-name">{formData.documents.itinerary.name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              {step > 1 && (
                <motion.button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Previous
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Application
                </motion.button>
              )}
            </div>
          </motion.form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Application;
