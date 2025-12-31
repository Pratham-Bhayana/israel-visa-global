import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlane, FaBriefcase, FaGraduationCap, FaSuitcase, FaUserMd, FaClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import passportOCR from '../services/ocrService';
import EligibilityModal from '../components/EligibilityModal';
import './Application.css';

const Application = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [countrySelection, setCountrySelection] = React.useState('');
  const [step, setStep] = React.useState(0);
  
  // Check for country parameter in URL
  React.useEffect(() => {
    const countryParam = searchParams.get('country');
    if (countryParam && (countryParam === 'israel' || countryParam === 'india')) {
      setCountrySelection(countryParam);
      setFormData(prev => ({ ...prev, country: countryParam }));
      setStep(1); // Skip country selection, go directly to visa type
    }
  }, [searchParams]);
  
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [visaTypes, setVisaTypes] = React.useState([]);
  const [indiaVisaTypes, setIndiaVisaTypes] = React.useState([]);
  const [selectedVisaFee, setSelectedVisaFee] = React.useState(null);
  const [showEligibilityModal, setShowEligibilityModal] = React.useState(false);
  
  // Check for e-visa eligibility data on load
  React.useEffect(() => {
    const eligibilityData = sessionStorage.getItem('eVisaEligibility');
    if (eligibilityData) {
      const data = JSON.parse(eligibilityData);
      // Pre-fill country as Israel if coming from e-visa check
      if (data.isEligible) {
        setCountrySelection('israel');
        setFormData(prev => ({ ...prev, country: 'israel' }));
        setStep(1); // Go to visa type selection
        toast.success('✅ You are eligible for Israel e-Visa!');
      }
    }
  }, []);
  const [formData, setFormData] = React.useState({
    // Country Selection
    country: '',
    
    // Visa Type Selection
    visaType: '',
    
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
    
    // India Personal Information
    surname: '',
    birthCity: '',
    birthCountry: '',
    citizenshipNumber: '',
    religion: '',
    education: '',
    visibleMarks: '',
    hasNameChanged: false,
    previousName: '',
    
    // India Contact Information
    email: '',
    phone: '',
    mobile: '',
    currentAddress: '',
    permanentAddress: '',
    
    // India Family Information
    fatherName: '',
    fatherNationality: '',
    fatherPlaceOfBirth: '',
    fatherCountryOfBirth: '',
    motherName: '',
    motherNationality: '',
    motherPlaceOfBirth: '',
    motherCountryOfBirth: '',
    spousePassportNumber: '',
    spousePlaceOfBirth: '',
    spouseCountryOfBirth: '',
    
    // India Professional Details
    designation: '',
    employerAddress: '',
    militaryService: '',
    organizationServed: '',
    rankDesignation: '',
    placeOfPosting: '',
    
    // India Travel Details
    arrivalPort: '',
    exitPort: '',
    placesToVisitIndia: '',
    hotelName: '',
    hotelAddress: '',
    hotelCity: '',
    hotelState: '',
    hotelPincode: '',
    
    // India Previous Visit History
    hasVisitedIndiaBefore: '',
    lastVisitDate: '',
    lastVisitCities: '',
    hasBeenRefusedVisa: '',
    refusalDetails: '',
    hasTravelledToSAARC: '',
    saarcCountries: '',
    
    // India References
    indiaRefName: '',
    indiaRefPhone: '',
    indiaRefAddress: '',
    indiaRefCity: '',
    indiaRefState: '',
    indiaRefPincode: '',
    homeRefName: '',
    homeRefPhone: '',
    homeRefAddress: '',
    homeRefCity: '',
    homeRefCountry: '',
    
    // India Security Questions
    criminalProceedings: '',
    criminalDetails: '',
    deportedOrBlacklisted: '',
    deportedDetails: '',
    engagedInCrimes: '',
    crimeDetails: '',
    traffickedOrSmuggled: '',
    trafficDetails: '',
    espionageActivities: '',
    espionageDetails: '',
    
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
    additionalPassportPages: null,
    supportingDocuments: null,
  });

  // Fetch Israel visa types on component mount
  React.useEffect(() => {
    const fetchVisaTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/visa-types?country=Israel`);
        if (response.data.success) {
          setVisaTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching visa types:', error);
        toast.error('Failed to load visa types');
      }
    };
    fetchVisaTypes();
  }, []);

  // Fetch India visa types when India is selected
  React.useEffect(() => {
    if (countrySelection === 'india') {
      const fetchIndiaVisaTypes = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/visa-types?country=India`);
          if (response.data.success) {
            setIndiaVisaTypes(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching India visa types:', error);
          toast.error('Failed to load India visa types');
        }
      };
      fetchIndiaVisaTypes();
    }
  }, [countrySelection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update selected visa fee when visa type changes
    if (name === 'visaType') {
      const selectedVisa = visaTypes.find(vt => vt.slug === value);
      setSelectedVisaFee(selectedVisa ? selectedVisa.fee.inr : null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      // Store file immediately
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      // If passport front, trigger OCR processing
      if (fieldName === 'passportFront') {
        setIsUploading(true);
        toast.info('Processing passport image...');
        
        try {
          const ocrResult = await passportOCR.processPassport(file);
          
          if (!ocrResult.success) {
            setIsUploading(false);
            
            if (!ocrResult.isPassport) {
              // Not a valid passport
              toast.error(ocrResult.message);
              setFormData(prev => ({
                ...prev,
                passportFront: null,
              }));
              return;
            }
            
            if (ocrResult.qualityIssue) {
              // Quality issues
              toast.warning(ocrResult.message);
              // Allow user to continue but don't auto-fill
              return;
            }
            
            // Other errors
            toast.error(ocrResult.message || 'Failed to process passport image');
            return;
          }

          // Success - auto-fill fields
          const data = ocrResult.data;
          
          console.log('OCR Extracted Data:', data);
          
          // Helper function to convert dd-mm-yyyy to yyyy-mm-dd for HTML date inputs
          const convertDateFormat = (dateStr) => {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-mm-dd
            }
            return dateStr;
          };
          
          // Auto-fill fields with confidence >= 70% (lowered threshold)
          const fieldsToUpdate = {};
          const lowConfidenceFields = [];
          
          Object.keys(data).forEach(key => {
            if (key.includes('Confidence') || key.includes('Source')) return;
            
            const value = data[key];
            if (!value) return;
            
            const confidence = data[`${key}Confidence`] || 50;
            
            // Convert dates to HTML format (yyyy-mm-dd)
            let finalValue = value;
            if (key === 'dateOfBirth' || key === 'dateOfIssue' || key === 'dateOfExpiry') {
              finalValue = convertDateFormat(value);
            }
            
            // Auto-fill if confidence >= 70%
            if (confidence >= 70) {
              fieldsToUpdate[key] = finalValue;
            } else if (confidence >= 50) {
              // Still fill but mark as low confidence
              fieldsToUpdate[key] = finalValue;
              lowConfidenceFields.push(key);
            }
            
            console.log(`${key}: ${finalValue} (confidence: ${confidence}%)`);
          });

          setFormData(prev => ({
            ...prev,
            passportFront: file,
            ...fieldsToUpdate
          }));

          // Show summary message
          const highConfidenceFields = Object.keys(fieldsToUpdate).length;
          toast.success(`✓ Passport detected! Auto-filled ${highConfidenceFields} fields. Please review carefully.`, {
            autoClose: 5000
          });

          // Show warnings for low confidence fields
          if (lowConfidenceFields.length > 0) {
            const fieldLabels = lowConfidenceFields.map(f => {
              return f.replace(/([A-Z])/g, ' $1').trim();
            }).join(', ');
            toast.warning(`Please verify these fields: ${fieldLabels}`, {
              autoClose: 7000
            });
          }

        } catch (error) {
          console.error('OCR Error:', error);
          toast.error('An error occurred while processing the passport. Please fill manually.');
        } finally {
          setIsUploading(false);
        }
      } else {
        // For other files, just show success
        toast.success('File uploaded successfully!');
      }
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
    // Validate required fields before proceeding
    const requiredFields = document.querySelectorAll('input[required]:not([disabled]), select[required]:not([disabled]), textarea[required]:not([disabled])');
    let hasEmptyRequired = false;
    let emptyFieldLabels = [];
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-field') || field.closest('.form-group') || field.closest('.upload-block');
      const label = fieldContainer?.querySelector('label')?.textContent || field.name;
      
      if (!field.value || (field.type === 'file' && !formData[field.name])) {
        hasEmptyRequired = true;
        if (label) emptyFieldLabels.push(label.replace('*', '').trim());
        field.style.borderColor = '#EF4444';
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (hasEmptyRequired) {
      toast.error(`Please fill all required fields marked with *`);
      if (emptyFieldLabels.length > 0 && emptyFieldLabels.length <= 3) {
        toast.warning(`Missing: ${emptyFieldLabels.join(', ')}`);
      }
      // Scroll to first empty required field
      const firstEmpty = Array.from(requiredFields).find(f => !f.value || (f.type === 'file' && !formData[f.name]));
      if (firstEmpty) {
        firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstEmpty.focus();
      }
      return;
    }
    
    const maxSteps = countrySelection === 'india' ? 11 : 8;
    if (step < maxSteps) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit application');
      navigate('/login', { state: { from: '/apply' } });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Helper to convert yyyy-mm-dd to Date object
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
      };

      // Prepare application data with proper formatting
      const applicationData = {
        country: countrySelection, // Add country field (israel or india)
        visaType: formData.visaType,
        
        // Passport Information
        passportNumber: formData.passportNumber || null,
        fullName: formData.familyName && formData.givenName 
          ? `${formData.givenName} ${formData.familyName}`.trim()
          : (formData.givenName || formData.familyName || null),
        dateOfBirth: parseDate(formData.dateOfBirth),
        placeOfBirth: formData.placeOfBirth || null,
        nationality: formData.nationality || null,
        gender: formData.gender?.toLowerCase() || null,
        passportIssueDate: parseDate(formData.dateOfIssue),
        passportExpiryDate: parseDate(formData.dateOfExpiry),
        passportFront: formData.passportFront?.name || null,
        passportBack: formData.passportBack?.name || null,
        
        // Travel Information
        travelPurpose: formData.visitPurpose || null,
        travelStartDate: parseDate(formData.arrivalDate),
        travelEndDate: formData.stayDuration || null, // This should be a date too if needed
        previousVisa: formData.previousVisaApproved || null, // Keep as 'yes'/'no' string
        multipleEntry: formData.multipleEntry || null, // Keep as 'yes'/'no' string
        placesToVisit: formData.placesToVisit 
          ? formData.placesToVisit.split(',').map(p => p.trim()).filter(p => p) 
          : [],
        visitPalestinianAuthority: formData.palestinianAuthorityStay || null, // Keep as 'yes'/'no' string
        
        // Contact Information
        phoneNumber: formData.mobilePhone || null,
        alternatePhone: formData.additionalPhone || null,
        homeAddress: formData.homeStreet || null,
        city: formData.homeCity || null,
        state: formData.homeCountry || null,
        
        // Occupation
        occupation: formData.occupation || null,
        companyName: formData.employer || null,
        
        // Family Information
        maritalStatus: formData.maritalStatus || null,
        spouseName: formData.spouseName || null,
        
        // Documents (store file names for now, upload to cloud storage later)
        documents: {
          passportPages: formData.passportAllPages?.name || null,
          photo: formData.photograph?.name || null,
          requestLetter: formData.requestLetter?.name || null,
          noc: formData.nocEmployer?.name || null,
          salarySlips: formData.salarySlips?.name || null,
          itinerary: formData.itinerary?.name || null,
          hotelBooking: formData.hotelBooking?.name || null,
          ticketReservation: formData.ticket?.name || null,
          travelInsurance: formData.travelInsurance?.name || null,
          bankStatement: formData.bankStatement?.name || null,
          aadharCard: formData.aadharCard?.name || null,
          itrCertificate: formData.itr?.name || null,
        },
        
        // Payment Information
        paymentAmount: selectedVisaFee || 8200,
        paymentStatus: 'pending',
        status: 'pending_payment',
      };

      console.log('Submitting Application Data:', applicationData);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/applications`,
        applicationData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
            'x-user-uid': currentUser.uid,
          },
        }
      );

      if (response.data.success) {
        toast.success('Application saved successfully! Redirecting to payment...');
        
        // Redirect to payment page with application ID
        setTimeout(() => {
          navigate(`/payment/${response.data.application.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="progress-sidebar" style={{ display: step === 0 ? 'none' : 'flex' }}>
              <div className="progress-line">
                <div className="progress-fill" style={{ height: `${((step - 1) / (countrySelection === 'india' ? 10 : 7)) * 100}%` }}></div>
              </div>
              <div className="progress-steps">
                {(countrySelection === 'india' ? [
                  { num: 1, label: 'Passport OCR' },
                  { num: 2, label: 'Contact' },
                  { num: 3, label: 'Family' },
                  { num: 4, label: 'Professional' },
                  { num: 5, label: 'Travel' },
                  { num: 6, label: 'History' },
                  { num: 7, label: 'References' },
                  { num: 8, label: 'Security' },
                  { num: 9, label: 'Documents' },
                  { num: 10, label: 'Review' }
                ] : [
                  { num: 1, label: 'Visa Type' },
                  { num: 2, label: 'Passport' },
                  { num: 3, label: 'Travel' },
                  { num: 4, label: 'Contact' },
                  { num: 5, label: 'Occupation' },
                  { num: 6, label: 'Family' },
                  { num: 7, label: 'Documents' },
                  { num: 8, label: 'Review' }
                ]).map((item) => (
                  <div key={item.num} className={`progress-step ${step > item.num ? 'completed' : step === item.num ? 'active' : 'inactive'}`}>
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
                <h1>{step === 0 ? 'Visa Application' : countrySelection === 'israel' ? 'Israel Visa Application' : countrySelection === 'india' ? 'India e-Visa Application' : 'Visa Application'}</h1>
                <p>Complete all steps to submit your application</p>
              </motion.div>

              <motion.form
                className="application-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Step 0: Country Selection */}
                {step === 0 && (
                  <div className="form-step">
                    <div className="step-header">
                      <h2>Select Visa Destination</h2>
                      <p className="step-subtitle">Choose the country you wish to visit</p>
                    </div>

                    <div className="visa-type-section">
                      <div className="visa-type-grid">
                        <label className={`visa-type-card ${countrySelection === 'israel' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="country"
                            value="israel"
                            checked={countrySelection === 'israel'}
                            onChange={(e) => {
                              setCountrySelection(e.target.value);
                              setFormData({ ...formData, country: e.target.value });
                            }}
                          />
                          <div className="country-flag-container">
                            <img 
                              src="https://res.cloudinary.com/dlwn3lssr/image/upload/v1766729091/Flag_of_Israel.svg_woiesh.webp" 
                              alt="Israel Flag" 
                              className="country-flag"
                            />
                          </div>
                          <div className="visa-card-content">
                            <h3>Israel Visa</h3>
                            <p>For tourism, business, or other purposes in Israel</p>
                          </div>
                          <div className="check-icon">✓</div>
                        </label>

                        <label className={`visa-type-card ${countrySelection === 'india' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="country"
                            value="india"
                            checked={countrySelection === 'india'}
                            onChange={(e) => {
                              setCountrySelection(e.target.value);
                              setFormData({ ...formData, country: e.target.value });
                            }}
                          />
                          <div className="country-flag-container">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" 
                              alt="India Flag" 
                              className="country-flag"
                            />
                          </div>
                          <div className="visa-card-content">
                            <h3>India e-Visa</h3>
                            <p>Electronic visa for tourism, business, or medical purposes in India</p>
                          </div>
                          <div className="check-icon">✓</div>
                        </label>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          if (!countrySelection) {
                            toast.error('Please select a country');
                            return;
                          }
                          setStep(1);
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Visa Type Selection (Israel only) */}
                {step === 1 && countrySelection === 'israel' && (
                  <div className="form-step">
                    <div className="step-header-with-fee">
                      <div className="step-header-text">
                        <h2>Select Visa Type</h2>
                        <p className="step-subtitle">Choose the type of visa you wish to apply for</p>
                      </div>
                      {selectedVisaFee && (
                        <motion.div 
                          className="visa-fee-badge"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="fee-label">Visa Fee</span>
                          <span className="fee-amount">₹{selectedVisaFee.toLocaleString('en-IN')}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Visa Type Selection */}
                    <div className="visa-type-section">
                      <div className="visa-type-grid">
                        {/* E-Visa Option Card - First Position */}
                        <div 
                          className="visa-type-card evisa-card"
                          onClick={() => setShowEligibilityModal(true)}
                        >
                          <div className="visa-type-icon evisa-icon-badge">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                          </div>
                          <div className="visa-card-content">
                            <h3 className="visa-type-name">Israel e-Visa</h3>
                            <p className="visa-type-desc">Check if you're eligible for fast-track e-visa processing</p>
                            <div className="evisa-badge-wrapper">
                              <span className="evisa-fast-track">⚡ Fast Track Available</span>
                            </div>
                          </div>
                        </div>

                        {/* Regular Visa Types */}
                        {visaTypes.map((visaType) => {
                          // Icon mapping for React Icons
                          const getIcon = () => {
                            if (visaType.name.includes('Tourist')) return <FaPlane />;
                            if (visaType.name.includes('Business')) return <FaBriefcase />;
                            if (visaType.name.includes('Student')) return <FaGraduationCap />;
                            if (visaType.name.includes('Work')) return <FaSuitcase />;
                            if (visaType.name.includes('Medical')) return <FaUserMd />;
                            if (visaType.name.includes('Transit')) return <FaClock />;
                            return <FaPlane />;
                          };
                          
                          return (
                            <label 
                              key={visaType._id}
                              className={`visa-type-card ${formData.visaType === visaType._id ? 'selected' : ''} ${!visaType.isActive ? 'disabled' : ''}`}
                            >
                              <input
                                type="radio"
                                name="visaType"
                                value={visaType._id}
                                checked={formData.visaType === visaType._id}
                                onChange={(e) => {
                                  setFormData({ ...formData, visaType: e.target.value });
                                  setSelectedVisaFee(visaType.fee.inr);
                                }}
                                required
                                disabled={!visaType.isActive}
                              />
                              <div className="visa-type-icon">
                                {getIcon()}
                              </div>
                              <div className="visa-card-content">
                                <h3 className="visa-type-name">{visaType.name}</h3>
                                <p className="visa-type-desc">{visaType.description}</p>
                                <div className="visa-type-meta">
                                  <span className="visa-fee">₹{visaType.fee.inr.toLocaleString()}</span>
                                  <span className="visa-validity">{visaType.validity}</span>
                                </div>
                                {!visaType.isActive && (
                                  <span className="visa-type-inactive">Currently Unavailable</span>
                                )}
                              </div>
                              <div className="check-icon">✓</div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Visa Type Selection (India) */}
                {step === 1 && countrySelection === 'india' && (
                  <div className="form-step">
                    <div className="step-header-with-fee">
                      <div className="step-header-text">
                        <h2>Select Visa Type</h2>
                        <p className="step-subtitle">Choose the type of visa you wish to apply for</p>
                      </div>
                      {selectedVisaFee && (
                        <div className="visa-fee-display">
                          <div className="fee-label">Visa Fee</div>
                          <div className="fee-amount">
                            ₹{selectedVisaFee.inr.toLocaleString()}
                            <span className="fee-usd">(${selectedVisaFee.usd})</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="visa-type-section">
                      <div className="visa-type-grid">
                        {indiaVisaTypes
                          .filter(visa => visa.isActive)
                          .map(visa => {
                            // Icon mapping for India visa types
                            const getIcon = () => {
                              if (visa.name.includes('Tourist')) return <FaPlane />;
                              if (visa.name.includes('Business')) return <FaBriefcase />;
                              if (visa.name.includes('Medical')) return <FaUserMd />;
                              if (visa.name.includes('Conference')) return <FaGraduationCap />;
                              return <FaPlane />;
                            };

                            return (
                              <label key={visa._id} className={`visa-type-card ${formData.visaType === visa._id ? 'selected' : ''} ${!visa.isActive ? 'disabled' : ''}`}>
                                <input
                                  type="radio"
                                  name="visaType"
                                  value={visa._id}
                                  checked={formData.visaType === visa._id}
                                  onChange={(e) => {
                                    setFormData({ ...formData, visaType: e.target.value });
                                    setSelectedVisaFee(visa.fee);
                                  }}
                                  disabled={!visa.isActive}
                                />
                                <div className="visa-type-icon">
                                  {getIcon()}
                                </div>
                                <div className="visa-card-content">
                                  <h3 className="visa-type-name">{visa.name}</h3>
                                  <p className="visa-type-desc">{visa.description}</p>
                                  <div className="visa-type-meta">
                                    <span className="visa-fee">₹{visa.fee.inr.toLocaleString()}</span>
                                    <span className="visa-validity">{visa.validity}</span>
                                  </div>
                                  {!visa.isActive && <span className="visa-type-inactive">Currently Unavailable</span>}
                                </div>
                                <div className="check-icon">✓</div>
                              </label>
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 India: Passport OCR for India */}
                {step === 2 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Passport Information - OCR</h2>
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

                {/* Step 2 Israel: Passport Upload & OCR */}
                {step === 2 && countrySelection === 'israel' && (
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

                {/* Step 3 Israel: Travel Information */}
                {step === 3 && countrySelection === 'israel' && (
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

                {/* Step 3 India: Contact Information */}
                {step === 3 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Contact Information</h2>
                    <p className="step-subtitle">Provide your contact details and addresses</p>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" required />
                      </div>

                      <div className="form-field">
                        <label>Mobile Number *</label>
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+1234567890" required />
                      </div>
                    </div>

                    <h3 className="section-title">Current Address</h3>
                    <div className="form-grid">
                      <div className="form-field full-width">
                        <label>Current Address *</label>
                        <textarea name="currentAddress" value={formData.currentAddress} onChange={handleChange} rows="3" required />
                      </div>
                    </div>

                    <h3 className="section-title">Permanent Address</h3>
                    <div className="form-grid">
                      <div className="form-field full-width">
                        <label>Permanent Address *</label>
                        <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} rows="3" required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 Israel: Contact Information */}
                {step === 4 && countrySelection === 'israel' && (
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

                {/* Step 4 India: Family Information */}
                {step === 4 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Family Information</h2>
                    <p className="step-subtitle">Provide details about your family members</p>

                    <h3 className="section-title">Father's Details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Father's Name *</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Father's Nationality *</label>
                        <input type="text" name="fatherNationality" value={formData.fatherNationality} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Father's Place of Birth *</label>
                        <input type="text" name="fatherPlaceOfBirth" value={formData.fatherPlaceOfBirth} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Father's Country of Birth *</label>
                        <input type="text" name="fatherCountryOfBirth" value={formData.fatherCountryOfBirth} onChange={handleChange} required />
                      </div>
                    </div>

                    <h3 className="section-title">Mother's Details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Mother's Name *</label>
                        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Mother's Nationality *</label>
                        <input type="text" name="motherNationality" value={formData.motherNationality} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Mother's Place of Birth *</label>
                        <input type="text" name="motherPlaceOfBirth" value={formData.motherPlaceOfBirth} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Mother's Country of Birth *</label>
                        <input type="text" name="motherCountryOfBirth" value={formData.motherCountryOfBirth} onChange={handleChange} required />
                      </div>
                    </div>

                    <h3 className="section-title">Marital Status</h3>
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
                            <label>Spouse Nationality *</label>
                            <input type="text" name="spouseNationality" value={formData.spouseNationality} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Spouse Passport Number</label>
                            <input type="text" name="spousePassportNumber" value={formData.spousePassportNumber} onChange={handleChange} />
                          </div>

                          <div className="form-field">
                            <label>Spouse Date of Birth</label>
                            <input type="date" name="spouseDateOfBirth" value={formData.spouseDateOfBirth} onChange={handleChange} />
                          </div>

                          <div className="form-field">
                            <label>Spouse Place of Birth</label>
                            <input type="text" name="spousePlaceOfBirth" value={formData.spousePlaceOfBirth} onChange={handleChange} />
                          </div>

                          <div className="form-field">
                            <label>Spouse Country of Birth</label>
                            <input type="text" name="spouseCountryOfBirth" value={formData.spouseCountryOfBirth} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5 Israel: Occupation */}
                {step === 5 && countrySelection === 'israel' && (
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

                {/* Step 5 India: Professional Details */}
                {step === 5 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Professional Details</h2>
                    <p className="step-subtitle">Provide your occupation and employment information</p>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Occupation *</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                      </div>

                      <div className="form-field">
                        <label>Employer/Business Name *</label>
                        <input type="text" name="employer" value={formData.employer} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Designation/Position *</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
                      </div>

                      <div className="form-field full-width">
                        <label>Employer Address *</label>
                        <textarea name="employerAddress" value={formData.employerAddress} onChange={handleChange} rows="3" required />
                      </div>

                      <div className="form-field">
                        <label>Past/Present Military/Police Service? *</label>
                        <select name="militaryService" value={formData.militaryService} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {formData.militaryService === 'yes' && (
                      <div className="military-info">
                        <h3 className="section-title">Military/Police Service Details</h3>
                        <div className="form-grid">
                          <div className="form-field">
                            <label>Organization *</label>
                            <input type="text" name="organizationServed" value={formData.organizationServed} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Rank/Designation *</label>
                            <input type="text" name="rankDesignation" value={formData.rankDesignation} onChange={handleChange} required />
                          </div>

                          <div className="form-field">
                            <label>Place of Posting *</label>
                            <input type="text" name="placeOfPosting" value={formData.placeOfPosting} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6 Israel: Family Information */}
                {step === 6 && countrySelection === 'israel' && (
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

                {/* Step 6 India: Travel Details */}
                {step === 6 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Travel Details</h2>
                    <p className="step-subtitle">Provide information about your planned visit to India</p>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Purpose of Visit *</label>
                        <select name="visitPurpose" value={formData.visitPurpose} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="Tourism">Tourism</option>
                          <option value="Business">Business</option>
                          <option value="Medical">Medical Treatment</option>
                          <option value="Conference">Conference</option>
                          <option value="Medical Attendant">Medical Attendant</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Expected Date of Arrival *</label>
                        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Port of Arrival in India *</label>
                        <input type="text" name="arrivalPort" value={formData.arrivalPort} onChange={handleChange} placeholder="e.g., Delhi (DEL)" required />
                      </div>

                      <div className="form-field">
                        <label>Port of Exit from India *</label>
                        <input type="text" name="exitPort" value={formData.exitPort} onChange={handleChange} placeholder="e.g., Mumbai (BOM)" required />
                      </div>

                      <div className="form-field">
                        <label>Duration of Stay (days) *</label>
                        <input type="number" name="stayDuration" value={formData.stayDuration} onChange={handleChange} min="1" max="180" required />
                      </div>

                      <div className="form-field full-width">
                        <label>Places to Visit in India *</label>
                        <textarea name="placesToVisitIndia" value={formData.placesToVisitIndia} onChange={handleChange} rows="3" placeholder="e.g., Delhi, Agra, Jaipur" required />
                      </div>
                    </div>

                    <h3 className="section-title">Hotel/Accommodation Details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Hotel Name *</label>
                        <input type="text" name="hotelName" value={formData.hotelName} onChange={handleChange} required />
                      </div>

                      <div className="form-field full-width">
                        <label>Hotel Address *</label>
                        <input type="text" name="hotelAddress" value={formData.hotelAddress} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>City *</label>
                        <input type="text" name="hotelCity" value={formData.hotelCity} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>State *</label>
                        <input type="text" name="hotelState" value={formData.hotelState} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Pincode *</label>
                        <input type="text" name="hotelPincode" value={formData.hotelPincode} onChange={handleChange} pattern="[0-9]{6}" required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7 Israel: Documents Upload */}
                {step === 7 && countrySelection === 'israel' && (
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

                {/* Step 7 India: Previous Visit History */}
                {step === 7 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Previous Visit History</h2>
                    <p className="step-subtitle">Information about your previous visits to India and other countries</p>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Have you visited India before? *</label>
                        <select name="hasVisitedIndiaBefore" value={formData.hasVisitedIndiaBefore} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {formData.hasVisitedIndiaBefore === 'yes' && (
                      <div className="previous-visit-info">
                        <h3 className="section-title">Previous Visit Details</h3>
                        <div className="form-grid">
                          <div className="form-field">
                            <label>Last Visit Date *</label>
                            <input type="date" name="lastVisitDate" value={formData.lastVisitDate} onChange={handleChange} required />
                          </div>

                          <div className="form-field full-width">
                            <label>Cities Visited *</label>
                            <textarea name="lastVisitCities" value={formData.lastVisitCities} onChange={handleChange} rows="2" required />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Have you been refused an Indian Visa? *</label>
                        <select name="hasBeenRefusedVisa" value={formData.hasBeenRefusedVisa} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {formData.hasBeenRefusedVisa === 'yes' && (
                      <div className="form-grid">
                        <div className="form-field full-width">
                          <label>Details of Visa Refusal *</label>
                          <textarea name="refusalDetails" value={formData.refusalDetails} onChange={handleChange} rows="3" required />
                        </div>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Have you travelled to SAARC countries? *</label>
                        <select name="hasTravelledToSAARC" value={formData.hasTravelledToSAARC} onChange={handleChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {formData.hasTravelledToSAARC === 'yes' && (
                      <div className="form-grid">
                        <div className="form-field full-width">
                          <label>SAARC Countries Visited *</label>
                          <textarea name="saarcCountries" value={formData.saarcCountries} onChange={handleChange} rows="2" placeholder="e.g., Pakistan, Bangladesh, Nepal" required />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 8 Israel: Review */}
                {step === 8 && countrySelection === 'israel' && (
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

                {/* Step 8 India: References */}
                {step === 8 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Reference Information</h2>
                    <p className="step-subtitle">Provide reference details in India and your home country</p>

                    <h3 className="section-title">Reference in India</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Name *</label>
                        <input type="text" name="indiaRefName" value={formData.indiaRefName} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Phone Number *</label>
                        <input type="tel" name="indiaRefPhone" value={formData.indiaRefPhone} onChange={handleChange} required />
                      </div>

                      <div className="form-field full-width">
                        <label>Address *</label>
                        <input type="text" name="indiaRefAddress" value={formData.indiaRefAddress} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>City *</label>
                        <input type="text" name="indiaRefCity" value={formData.indiaRefCity} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>State *</label>
                        <input type="text" name="indiaRefState" value={formData.indiaRefState} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Pincode *</label>
                        <input type="text" name="indiaRefPincode" value={formData.indiaRefPincode} onChange={handleChange} pattern="[0-9]{6}" required />
                      </div>
                    </div>

                    <h3 className="section-title">Reference in Home Country</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Name *</label>
                        <input type="text" name="homeRefName" value={formData.homeRefName} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Phone Number *</label>
                        <input type="tel" name="homeRefPhone" value={formData.homeRefPhone} onChange={handleChange} required />
                      </div>

                      <div className="form-field full-width">
                        <label>Address *</label>
                        <input type="text" name="homeRefAddress" value={formData.homeRefAddress} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>City *</label>
                        <input type="text" name="homeRefCity" value={formData.homeRefCity} onChange={handleChange} required />
                      </div>

                      <div className="form-field">
                        <label>Country *</label>
                        <input type="text" name="homeRefCountry" value={formData.homeRefCountry} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 9 India: Security Questions */}
                {step === 9 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Security & Background Information</h2>
                    <p className="step-subtitle">Please answer the following questions honestly</p>

                    <div className="security-questions">
                      <div className="security-question-block">
                        <label className="security-question-label">
                          1. Are you or have you been involved in any criminal proceedings?
                        </label>
                        <div className="form-grid">
                          <div className="form-field">
                            <select name="criminalProceedings" value={formData.criminalProceedings} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {formData.criminalProceedings === 'yes' && (
                          <div className="form-grid">
                            <div className="form-field full-width">
                              <label>Please provide details *</label>
                              <textarea name="criminalDetails" value={formData.criminalDetails} onChange={handleChange} rows="3" required />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="security-question-block">
                        <label className="security-question-label">
                          2. Have you ever been refused entry / deported or repatriated from any country including India?
                        </label>
                        <div className="form-grid">
                          <div className="form-field">
                            <select name="deportedOrBlacklisted" value={formData.deportedOrBlacklisted} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {formData.deportedOrBlacklisted === 'yes' && (
                          <div className="form-grid">
                            <div className="form-field full-width">
                              <label>Please provide details *</label>
                              <textarea name="deportedDetails" value={formData.deportedDetails} onChange={handleChange} rows="3" required />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="security-question-block">
                        <label className="security-question-label">
                          3. Have you ever engaged in human trafficking, drug trafficking, child abuse, or women trafficking?
                        </label>
                        <div className="form-grid">
                          <div className="form-field">
                            <select name="traffickedOrSmuggled" value={formData.traffickedOrSmuggled} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {formData.traffickedOrSmuggled === 'yes' && (
                          <div className="form-grid">
                            <div className="form-field full-width">
                              <label>Please provide details *</label>
                              <textarea name="trafficDetails" value={formData.trafficDetails} onChange={handleChange} rows="3" required />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="security-question-block">
                        <label className="security-question-label">
                          4. Have you been engaged in cyber crime, terrorism, sabotage, or espionage?
                        </label>
                        <div className="form-grid">
                          <div className="form-field">
                            <select name="engagedInCrimes" value={formData.engagedInCrimes} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {formData.engagedInCrimes === 'yes' && (
                          <div className="form-grid">
                            <div className="form-field full-width">
                              <label>Please provide details *</label>
                              <textarea name="crimeDetails" value={formData.crimeDetails} onChange={handleChange} rows="3" required />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="security-question-block">
                        <label className="security-question-label">
                          5. Have you been involved in genocide or crimes against humanity?
                        </label>
                        <div className="form-grid">
                          <div className="form-field">
                            <select name="espionageActivities" value={formData.espionageActivities} onChange={handleChange} required>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {formData.espionageActivities === 'yes' && (
                          <div className="form-grid">
                            <div className="form-field full-width">
                              <label>Please provide details *</label>
                              <textarea name="espionageDetails" value={formData.espionageDetails} onChange={handleChange} rows="3" required />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 10 India: Document Upload */}
                {step === 10 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Required Documents</h2>
                    <p className="step-subtitle">Please upload all required documents for India e-Visa</p>

                    <div className="documents-grid">
                      {/* Passport Additional Pages */}
                      <div className="document-block">
                        <div className="document-header">
                          <span className="document-number">1</span>
                          <label className="document-label">Passport Additional Pages (if any)</label>
                        </div>
                        {!formData.additionalPassportPages ? (
                          <label htmlFor="additionalPassportPages" className="document-upload-box">
                            <input
                              type="file"
                              id="additionalPassportPages"
                              name="additionalPassportPages"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                              hidden
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
                            <span className="document-uploaded-name">{formData.additionalPassportPages.name}</span>
                            <div className="document-actions">
                              <label htmlFor="additionalPassportPages" className="doc-action-link">
                                <input type="file" id="additionalPassportPages" name="additionalPassportPages" onChange={handleFileChange} accept="image/*,.pdf" hidden />
                                Change
                              </label>
                              <button type="button" onClick={() => handleRemoveFile('additionalPassportPages')} className="doc-action-link">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Photograph */}
                      <div className="document-block">
                        <div className="document-header">
                          <span className="document-number">2</span>
                          <label className="document-label">Recent Photograph (White Background) *</label>
                        </div>
                        {!formData.photograph ? (
                          <label htmlFor="photograph" className="document-upload-box">
                            <input
                              type="file"
                              id="photograph"
                              name="photograph"
                              onChange={handleFileChange}
                              accept="image/*"
                              hidden
                              required
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
                            <span className="document-uploaded-name">{formData.photograph.name}</span>
                            <div className="document-actions">
                              <label htmlFor="photograph" className="doc-action-link">
                                <input type="file" id="photograph" name="photograph" onChange={handleFileChange} accept="image/*" hidden />
                                Change
                              </label>
                              <button type="button" onClick={() => handleRemoveFile('photograph')} className="doc-action-link">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Supporting Documents */}
                      <div className="document-block">
                        <div className="document-header">
                          <span className="document-number">3</span>
                          <label className="document-label">Supporting Documents (Hotel booking, Ticket, etc.)</label>
                        </div>
                        {!formData.supportingDocuments ? (
                          <label htmlFor="supportingDocuments" className="document-upload-box">
                            <input
                              type="file"
                              id="supportingDocuments"
                              name="supportingDocuments"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                              hidden
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
                            <span className="document-uploaded-name">{formData.supportingDocuments.name}</span>
                            <div className="document-actions">
                              <label htmlFor="supportingDocuments" className="doc-action-link">
                                <input type="file" id="supportingDocuments" name="supportingDocuments" onChange={handleFileChange} accept="image/*,.pdf" hidden />
                                Change
                              </label>
                              <button type="button" onClick={() => handleRemoveFile('supportingDocuments')} className="doc-action-link">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 11 India: Review & Submit */}
                {step === 11 && countrySelection === 'india' && (
                  <div className="form-step">
                    <h2>Review & Submit Application</h2>
                    <p className="step-subtitle">Please review all information carefully before submitting</p>

                    <div className="review-section">
                      <h3>Personal Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Full Name</span>
                          <span className="review-value">{formData.givenName} {formData.surname}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Date of Birth</span>
                          <span className="review-value">{formData.dateOfBirth}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Gender</span>
                          <span className="review-value">{formData.gender}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Nationality</span>
                          <span className="review-value">{formData.nationality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-section">
                      <h3>Passport Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Passport Number</span>
                          <span className="review-value">{formData.passportNumber}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Date of Issue</span>
                          <span className="review-value">{formData.dateOfIssue}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Date of Expiry</span>
                          <span className="review-value">{formData.dateOfExpiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-section">
                      <h3>Travel Details</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Purpose of Visit</span>
                          <span className="review-value">{formData.visitPurpose}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Expected Arrival</span>
                          <span className="review-value">{formData.arrivalDate}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Duration of Stay</span>
                          <span className="review-value">{formData.stayDuration} days</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Port of Arrival</span>
                          <span className="review-value">{formData.arrivalPort}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-section">
                      <h3>Contact Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Email</span>
                          <span className="review-value">{formData.email}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Mobile</span>
                          <span className="review-value">{formData.mobile}</span>
                        </div>
                      </div>
                    </div>

                    <div className="confirmation-checkbox">
                      <label>
                        <input type="checkbox" required />
                        <span>I confirm that all information provided is accurate and complete. I understand that providing false information may result in visa rejection.</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                {step > 0 && (
                  <div className="form-actions">
                    {step > 1 && (
                      <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                        Previous
                      </button>
                    )}
                  
                  <div style={{ flex: 1 }}></div>
                  
                  {step < (countrySelection === 'india' ? 11 : 8) ? (
                    <button type="button" className="btn btn-primary" onClick={handleNext}>
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save & Proceed to Payment'}
                    </button>
                  )}
                </div>
                )}
              </motion.form>
            </div>
          </div>
        </div>
      </div>
      
      {/* E-Visa Eligibility Modal */}
      <EligibilityModal 
        isOpen={showEligibilityModal} 
        onClose={() => setShowEligibilityModal(false)} 
      />
    </>
  );
};

export default Application;
