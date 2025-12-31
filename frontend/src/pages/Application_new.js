import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Application.css';

const Application = () => {
  const [step, setStep] = React.useState(1);
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Passport Details
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
    
    // Travel Information
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
    
    // Contact Information
    mobilePhone: '',
    additionalPhone: '',
    socialNetworkAccount: '',
    homeCountry: '',
    homeCity: '',
    homeStreet: '',
    
    // Occupation
    occupation: '',
    employer: '',
    
    // Family Information
    maritalStatus: '',
    spouseName: '',
    spouseDateOfBirth: '',
    spouseNationality: '',
    
    // Documents
    passportAllPages: null,
    photograph: null,
    requestLetter: null,
    nocEmployer: null,
    salarySlips: null,
    itinerary: null,
    hotelBooking: null,
    ticket: null,
    travelInsurance: null,
    bankStatement: null,
    aadharCard: null,
    itr: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      setIsUploading(true);
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: file,
        }));
        
        if (fieldName === 'passportFront') {
          setFormData(prev => ({
            ...prev,
            passportFront: file,
            travelDocumentType: 'Ordinary',
            gender: 'MALE',
          }));
          toast.info('OCR processing completed. Please verify the extracted data.');
        }
        
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 1500);
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: null,
    });
    toast.info('File removed');
  };

  const handleNext = () => {
    if (step < 7) {
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
    toast.success('Application saved successfully! Redirecting to payment...');
  };

  const documents = [
    { id: 'passportAllPages', label: 'Passport All Pages Scan', required: true },
    { id: 'photograph', label: 'Photograph (5.5cm × 5.5cm, White Background)', required: true },
    { id: 'requestLetter', label: 'Request Letter', required: true },
    { id: 'nocEmployer', label: 'NOC from Employer', required: true },
    { id: 'salarySlips', label: 'Salary Slips for 6 Months', required: true },
    { id: 'itinerary', label: 'Day to Day Itinerary', required: true },
    { id: 'hotelBooking', label: 'Hotel Booking', required: true },
    { id: 'ticket', label: 'Flight Ticket', required: true },
    { id: 'travelInsurance', label: 'Travel Insurance', required: true },
    { id: 'bankStatement', label: 'Bank Statement (Last 6 Months)', required: true },
    { id: 'aadharCard', label: 'Copy of Aadhar Card', required: true },
    { id: 'itr', label: 'ITR for 3 Years', required: true },
  ];

  return (
    <>
      <Helmet>
        <title>Apply for Visa - Israel Visa Application</title>
        <meta name="description" content="Apply for your Israel visa - Complete the application form" />
      </Helmet>

      <div className="application-page">
        <div className="application-container">
          <div className="application-content">
            {/* Progress Sidebar */}
            <div className="progress-sidebar">
              <div className="progress-line">
                <div className="progress-fill" style={{ height: `${((step - 1) / 6) * 100}%` }}></div>
              </div>
              <div className="progress-steps">
                {[
                  { num: 1, label: 'Passport' },
                  { num: 2, label: 'Travel' },
                  { num: 3, label: 'Contact' },
                  { num: 4, label: 'Occupation' },
                  { num: 5, label: 'Family' },
                  { num: 6, label: 'Documents' },
                  { num: 7, label: 'Review' }
                ].map((item) => (
                  <div key={item.num} className={`progress-step ${step >= item.num ? 'active' : ''}`}>
                    <div className="step-number">{item.num}</div>
                    <div className="step-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="form-wrapper">
              <motion.div
                className="application-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Israel Visa Application</h1>
                <p>Complete all steps to submit your application</p>
              </motion.div>

              <motion.form
                className="application-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Step 1: Passport Upload & OCR */}
                {step === 1 && (
                  <div className="form-step">
                    <h2>Passport Information</h2>
                    <p className="step-subtitle">Upload your passport for automatic data extraction</p>

                    <div className="upload-grid">
                      {/* Passport Front */}
                      <div className="upload-block">
                        <label className="upload-label">Passport Front Page *</label>
                        {!formData.passportFront ? (
                          <label htmlFor="passportFront" className="upload-box">
                            <input
                              type="file"
                              id="passportFront"
                              name="passportFront"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                              hidden
                            />
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span className="upload-text">Upload File</span>
                            <span className="upload-hint">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        ) : (
                          <div className="file-uploaded">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span className="file-uploaded-name">{formData.passportFront.name}</span>
                            <div className="file-uploaded-actions">
                              <label htmlFor="passportFront" className="file-action-btn">
                                <input type="file" id="passportFront" name="passportFront" onChange={handleFileChange} accept="image/*,.pdf" hidden />
                                Reupload
                              </label>
                              <button type="button" onClick={() => handleRemoveFile('passportFront')} className="file-action-btn">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Passport Back */}
                      <div className="upload-block">
                        <label className="upload-label">Passport Last Page *</label>
                        {!formData.passportBack ? (
                          <label htmlFor="passportBack" className="upload-box">
                            <input
                              type="file"
                              id="passportBack"
                              name="passportBack"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                              hidden
                            />
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span className="upload-text">Upload File</span>
                            <span className="upload-hint">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        ) : (
                          <div className="file-uploaded">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span className="file-uploaded-name">{formData.passportBack.name}</span>
                            <div className="file-uploaded-actions">
                              <label htmlFor="passportBack" className="file-action-btn">
                                <input type="file" id="passportBack" name="passportBack" onChange={handleFileChange} accept="image/*,.pdf" hidden />
                                Reupload
                              </label>
                              <button type="button" onClick={() => handleRemoveFile('passportBack')} className="file-action-btn">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isUploading && (
                      <div className="processing-overlay">
                        <div className="processing-spinner"></div>
                        <p>Processing document...</p>
                      </div>
                    )}

                    {formData.passportFront && !isUploading && (
                      <div className="ocr-data">
                        <h3>Extracted Information</h3>
                        <p className="ocr-subtitle">Please verify and complete the details below</p>

                        <div className="form-grid">
                          <div className="form-field">
                            <label>Travel Document Type</label>
                            <input type="text" name="travelDocumentType" value={formData.travelDocumentType} onChange={handleChange} />
                          </div>

                          <div className="form-field">
                            <label>Passport Number *</label>
                            <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Country Code</label>
                            <input type="text" name="passportCountryCode" value={formData.passportCountryCode} onChange={handleChange} />
                          </div>

                          <div className="form-field">
                            <label>Nationality *</label>
                            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Biometric Passport *</label>
                            <select name="isBiometric" value={formData.isBiometric} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>

                          <div className="form-field">
                            <label>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>

                          <div className="form-field">
                            <label>Family Name (Surname) *</label>
                            <input type="text" name="familyName" value={formData.familyName} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Given Name *</label>
                            <input type="text" name="givenName" value={formData.givenName} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Date of Issue *</label>
                            <input type="date" name="dateOfIssue" value={formData.dateOfIssue} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Date of Expiry *</label>
                            <input type="date" name="dateOfExpiry" value={formData.dateOfExpiry} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Date of Birth *</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Place of Birth *</label>
                            <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Travel Information */}
                {step === 2 && (
                  <div className="form-step">
                    <h2>Travel Information</h2>

                    <div className="form-grid">
                      <div className="form-field full-width">
                        <label>What's the main purpose of your visit? *</label>
                        <textarea name="visitPurpose" value={formData.visitPurpose} onChange={handleChange} rows="3" required />
                      </div>

                      <div className="form-field">
                        <label>Expected Date of Arrival *</label>
                        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Stay Duration *</label>
                        <input type="text" name="stayDuration" value={formData.stayDuration} onChange={handleChange} placeholder="e.g., 10 days" required />
                      </div>

                      <div className="form-field">
                        <label>Previous Visa Approved in Israel? *</label>
                        <select name="previousVisaApproved" value={formData.previousVisaApproved} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      {formData.previousVisaApproved === 'yes' && (
                        <div className="form-field">
                          <label>Approval Reference Number</label>
                          <input type="text" name="previousApprovalReference" value={formData.previousApprovalReference} onChange={handleChange} />
                        </div>
                      )}

                      <div className="form-field">
                        <label>Multiple Entry Required? *</label>
                        <select name="multipleEntry" value={formData.multipleEntry} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      {formData.multipleEntry === 'yes' && (
                        <div className="form-field full-width">
                          <label>Reason for Multiple Entry</label>
                          <textarea name="multipleEntryReason" value={formData.multipleEntryReason} onChange={handleChange} rows="3" />
                        </div>
                      )}

                      <div className="form-field full-width">
                        <label>Places to Visit in Israel *</label>
                        <textarea name="placesToVisit" value={formData.placesToVisit} onChange={handleChange} rows="3" required />
                      </div>

                      <div className="form-field">
                        <label>Stay in Palestinian Authority? *</label>
                        <select name="palestinianAuthorityStay" value={formData.palestinianAuthorityStay} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Current Country of Stay *</label>
                        <input type="text" name="currentCountry" value={formData.currentCountry} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {step === 3 && (
                  <div className="form-step">
                    <h2>Contact Information</h2>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Mobile Phone *</label>
                        <input type="tel" name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} placeholder="+1234567890" required />
                      </div>

                      <div className="form-field">
                        <label>Additional Phone</label>
                        <input type="tel" name="additionalPhone" value={formData.additionalPhone} onChange={handleChange} placeholder="+1234567890" />
                      </div>

                      <div className="form-field">
                        <label>Social Network Account</label>
                        <select name="socialNetworkAccount" value={formData.socialNetworkAccount} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="section-title">Home Address</h3>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Country *</label>
                        <input type="text" name="homeCountry" value={formData.homeCountry} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>City *</label>
                        <input type="text" name="homeCity" value={formData.homeCity} onChange={handleChange} required />
                      </div>

                      <div className="form-field full-width">
                        <label>Street and Number *</label>
                        <input type="text" name="homeStreet" value={formData.homeStreet} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Occupation */}
                {step === 4 && (
                  <div className="form-step">
                    <h2>Occupation Details</h2>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Occupation *</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                      </div>

                      <div className="form-field">
                        <label>Employer / Company</label>
                        <input type="text" name="employer" value={formData.employer} onChange={handleChange} placeholder="Company name" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Family Information */}
                {step === 5 && (
                  <div className="form-step">
                    <h2>Family Information</h2>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Marital Status *</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      </div>
                    </div>

                    {formData.maritalStatus === 'married' && (
                      <div className="spouse-info">
                        <h3 className="section-title">Spouse Details</h3>
                        <div className="form-grid">
                          <div className="form-field">
                            <label>Spouse Full Name *</label>
                            <input type="text" name="spouseName" value={formData.spouseName} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Spouse Date of Birth *</label>
                            <input type="date" name="spouseDateOfBirth" value={formData.spouseDateOfBirth} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Spouse Nationality *</label>
                            <input type="text" name="spouseNationality" value={formData.spouseNationality} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6: Documents Upload */}
                {step === 6 && (
                  <div className="form-step">
                    <h2>Required Documents</h2>
                    <p className="step-subtitle">Please upload all required documents</p>

                    <div className="documents-grid">
                      {documents.map((doc) => (
                        <div key={doc.id} className="document-block">
                          <div className="document-header">
                            <span className="document-number">{documents.indexOf(doc) + 1}</span>
                            <label className="document-label">{doc.label}</label>
                          </div>
                          
                          {!formData[doc.id] ? (
                            <label htmlFor={doc.id} className="document-upload-box">
                              <input
                                type="file"
                                id={doc.id}
                                name={doc.id}
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                hidden
                                required={doc.required}
                              />
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                              </svg>
                              <span>Upload</span>
                            </label>
                          ) : (
                            <div className="document-uploaded">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span className="document-uploaded-name">{formData[doc.id].name}</span>
                              <div className="document-actions">
                                <label htmlFor={doc.id} className="doc-action-link">
                                  <input type="file" id={doc.id} name={doc.id} onChange={handleFileChange} accept="image/*,.pdf" hidden />
                                  Change
                                </label>
                                <button type="button" onClick={() => handleRemoveFile(doc.id)} className="doc-action-link">Remove</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 7: Review */}
                {step === 7 && (
                  <div className="form-step">
                    <h2>Review Application</h2>
                    <p className="step-subtitle">Please review all information before submitting</p>

                    <div className="review-section">
                      <h3>Passport Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Full Name</span>
                          <span className="review-value">{formData.familyName} {formData.givenName}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Passport Number</span>
                          <span className="review-value">{formData.passportNumber}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Nationality</span>
                          <span className="review-value">{formData.nationality}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Date of Birth</span>
                          <span className="review-value">{formData.dateOfBirth}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-section">
                      <h3>Travel Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Purpose of Visit</span>
                          <span className="review-value">{formData.visitPurpose}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Arrival Date</span>
                          <span className="review-value">{formData.arrivalDate}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Stay Duration</span>
                          <span className="review-value">{formData.stayDuration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-section">
                      <h3>Contact Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Mobile Phone</span>
                          <span className="review-value">{formData.mobilePhone}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Address</span>
                          <span className="review-value">{formData.homeStreet}, {formData.homeCity}, {formData.homeCountry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="confirmation-checkbox">
                      <label>
                        <input type="checkbox" required />
                        <span>I confirm that all information provided is accurate and complete</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  {step > 1 && (
                    <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                      Previous
                    </button>
                  )}
                  
                  <div style={{ flex: 1 }}></div>
                  
                  {step < 7 ? (
                    <button type="button" className="btn btn-primary" onClick={handleNext}>
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Save & Proceed to Payment
                    </button>
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
