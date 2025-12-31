# India e-Visa Application - Full Implementation Plan

## Overview
This document outlines the complete implementation plan for the India e-Visa application system, including all 100+ form fields organized by category, backend integration, document processing, and validation rules.

## Current Status
✅ Country selection screen (Step 0) implemented
⏳ India-specific form fields (Steps 1-12)
⏳ Backend API endpoints
⏳ Document upload & OCR processing
⏳ Validation & error handling

---

## Form Structure (12 Steps)

### Step 0: Country Selection ✅
**Current Implementation:**
- Radio button selection between Israel Visa and India e-Visa
- Flag icons (🇮🇱 🇮🇳) for visual identification
- Continues to Step 1 after selection
- Sets `formData.country` state variable

---

### Step 1: Passport Upload & OCR
**Fields:**
- Passport Front Page (image upload with preview)
- Passport Back Page (image upload with preview)
- Auto-extraction via OCR:
  - Passport Number
  - Given Names
  - Surname
  - Date of Birth
  - Place of Birth
  - Date of Issue
  - Date of Expiry
  - Nationality

**Features:**
- Drag & drop image upload
- OCR processing with loading state
- Manual correction option for OCR results
- Image preview with zoom capability
- Validation: Must upload both pages before proceeding

**Backend Requirements:**
- OCR service integration (Google Vision API / Tesseract)
- Image storage (Cloudinary)
- POST `/api/ocr/india-passport`

---

### Step 2: Personal Information
**Fields:**
1. Name Details:
   - Given Name / First Name (from OCR, editable)
   - Surname / Family Name (from OCR, editable)
   - Have you ever changed your name? (Yes/No radio)
   - If Yes:
     - Previous Name
     - Previous Surname

2. Birth Details:
   - Date of Birth (date picker, from OCR)
   - Place of Birth: Town/City
   - Place of Birth: Country (dropdown)
   
3. Personal Details:
   - Gender (Male/Female/Transgender)
   - Citizenship/National ID Number
   - Religion (dropdown: Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Parsi, Other)
   - Visible Identification Marks (text area)
   - Educational Qualification (dropdown: Below Matriculation, Matriculation, Graduate & Above, PhD)

**Validation:**
- All fields required
- Name must match passport exactly unless name change declared
- DOB must be at least 18 years old for most visa types
- Citizenship number format validation

---

### Step 3: Passport Details
**Fields:**
1. Current Passport:
   - Passport Number (from OCR, editable)
   - Date of Issue (date picker, from OCR)
   - Date of Expiry (date picker, from OCR)
   - Place of Issue (text input)
   
2. Passport History:
   - Have you ever held another passport? (Yes/No)
   - If Yes:
     - Country of Issue
     - Passport Number
     - Date of Issue
     - Place of Issue
     - Nationality

3. Nationality Details:
   - Were you born as a citizen of present nationality? (Yes/No)
   - If No:
     - Previous Nationality
     - How did you acquire present nationality? (Birth/Naturalization/Other)
     - Date of Acquisition

**Validation:**
- Passport must be valid for at least 6 months from arrival date
- Passport must have at least 2 blank pages
- Issue date must be before expiry date

---

### Step 4: Contact Information
**Fields:**
1. Email & Phone:
   - Email Address
   - Confirm Email Address
   - Phone Number (with country code dropdown)
   - Mobile Number (with country code dropdown)

2. Current Address:
   - House No. / Street
   - Village / Town / City
   - State / Province / District
   - Postal / Zip Code
   - Country (dropdown, pre-filled from nationality)
   
3. Permanent Address:
   - Is your Permanent Address same as Present Address? (Yes/No checkbox)
   - If No, same fields as Current Address

**Validation:**
- Email addresses must match
- Valid email format
- Phone numbers must be 10-15 digits
- All address fields required

---

### Step 5: Family Information
**Fields:**
1. Father's Details:
   - Father's Name
   - Father's Nationality
   - Father's Place of Birth: Town/City
   - Father's Place of Birth: Country
   - Was your father a citizen of Pakistan or residing in Pakistan? (Yes/No)

2. Mother's Details:
   - Mother's Name
   - Mother's Maiden Name (if different)
   - Mother's Nationality
   - Mother's Place of Birth: Town/City
   - Mother's Place of Birth: Country
   - Was your mother a citizen of Pakistan or residing in Pakistan? (Yes/No)

3. Marital Status:
   - Marital Status (dropdown: Single, Married, Divorced, Separated, Widowed, Legally Separated)
   - If Married:
     - Spouse's Name
     - Spouse's Nationality
     - Spouse's Place of Birth: Town/City
     - Spouse's Place of Birth: Country
     - Spouse's Place of Residence (if different from applicant)

4. Grandparents (if Pakistan connection):
   - If either parent had Pakistan connection, show:
     - Paternal Grandfather's Name
     - Paternal Grandfather's Nationality
     - Maternal Grandfather's Name
     - Maternal Grandfather's Nationality

**Validation:**
- All parent details required
- Spouse details required if married
- Pakistan connection triggers additional security checks

---

### Step 6: Professional / Occupation Details
**Fields:**
1. Current Occupation:
   - Present Occupation (dropdown: Professional, Business, Service, Student, Housewife, Retired, Unemployed, Others)
   - Employer Name / Business Name
   - Designation
   - Address: House No. / Street
   - Address: Village / Town / City
   - Address: State / Province
   - Address: Country
   - Phone Number (with country code)

2. Past Occupation (if changed jobs):
   - Did you work in any other occupation in the past? (Yes/No)
   - If Yes:
     - Previous Occupation
     - Previous Employer Name

3. Special Occupation History:
   - Are you, or have you ever been, in a military/semi-military/police/security organization? (Yes/No)
   - If Yes:
     - Organization Name
     - Designation
     - Rank
     - Place of Posting

**Validation:**
- Occupation details required for all except students/unemployed
- Military service details trigger additional verification

---

### Step 7: Travel Details
**Fields:**
1. Visit Purpose:
   - Primary Purpose of Visit (dropdown: Tourism, Business, Medical, Conference, Other)
   - Expected Date of Arrival (date picker)
   - Expected Port of Arrival (dropdown: Major Indian airports/seaports)
   - Expected Port of Exit (dropdown)
   - Expected Duration of Stay (in days)
   - Number of Entries Required (Single/Multiple dropdown)

2. Itinerary:
   - Places you intend to visit in India (text area)
   - Do you have confirmed hotel bookings? (Yes/No)
   - If Yes:
     - Hotel Name
     - Hotel Address
     - Hotel City
     - Hotel Phone

3. Tour/Business Details:
   - Are you being sponsored by any tour operator/company? (Yes/No)
   - If Yes:
     - Company Name
     - Company Address
     - Company Contact Number
   - If Business Visit:
     - Name of Company to be Visited
     - Company Address in India
     - Company Phone
     - Contact Person Name

**Validation:**
- Arrival date must be at least 4 days from application date
- Duration must not exceed visa validity (30/90/180 days)
- Port of arrival and exit must be valid India immigration checkpoints

---

### Step 8: Previous Visit History
**Fields:**
1. India Visit History:
   - Have you visited India before? (Yes/No)
   - If Yes:
     - Number of Previous Visits
     - Last Indian Visa Number / Currently Valid Indian Visa Number
     - Type of Visa
     - Date of Issue
     - Place of Issue
     - Address during previous visit in India (Street)
     - City
     - State
     - Cities previously visited in India (comma-separated)

2. Visa Refusal History:
   - Has permission to visit or to extend stay in India ever been refused? (Yes/No)
   - If Yes:
     - Control Number (if available)
     - Reason for Refusal (text area)

3. SAARC Country Visits:
   - Have you visited SAARC countries (except your own country) during last 3 years? (Yes/No)
   - If Yes:
     - Countries Visited (checkboxes: Pakistan, Afghanistan, Bangladesh, Bhutan, Maldives, Nepal, Sri Lanka)
     - Year of Visit
     - Number of Visits

**Validation:**
- Previous visa details must be accurate if claiming prior visits
- Refusal history may require additional documentation

---

### Step 9: Reference Information
**Fields:**
1. Reference in India:
   - Name
   - Address: House No. / Street
   - City / Town
   - State
   - Postal Code
   - Phone Number
   - Relationship (dropdown: Friend, Relative, Business Associate, Hotel, Tour Operator, Other)

2. Reference in Your Home Country:
   - Name
   - Address: House No. / Street
   - City / Town
   - State / Province
   - Postal Code
   - Phone Number

**Validation:**
- At least one reference required
- Phone numbers must be valid format
- India reference address must be complete

---

### Step 10: Security Questions
**All Yes/No questions - if Yes, text area for explanation required:**

1. Have you ever been arrested / prosecuted / convicted by Court of Law of any country?
   - If Yes: Details of charges and outcome

2. Have you ever been refused entry / deported by any country including India?
   - If Yes: Country, date, and reason

3. Have you engaged in human trafficking / drug trafficking / child abuse / crimes against women / economic offense / financial fraud?
   - If Yes: Details

4. Have you been engaged in cyber crime / terrorist activities / sabotage / espionage / genocide / political killing / other acts of violence?
   - If Yes: Details

5. Have you ever sought asylum (political or otherwise) in any country?
   - If Yes: Country and outcome

**Validation:**
- All questions must be answered
- If any "Yes" answers, detailed explanation required (minimum 50 characters)
- Security flags may trigger manual review

---

### Step 11: Document Upload
**Required Documents:**
1. Passport Pages:
   - First Page (bio-data page) - Already uploaded in Step 1
   - Last Page (if applicable)
   - Pages with previous Indian visas (if applicable)
   - Pages with other visas (if applicable)
   - ECR/Non-ECR Page (if applicable)

2. Photograph:
   - Recent color photograph (JPEG/JPG)
   - Requirements: White background, 2x2 inches, 350x350 pixels min, 80% face coverage
   - File size: 10KB - 300KB

3. Supporting Documents (based on visa type):
   - For Tourism: Return ticket, hotel bookings, bank statements (last 3 months)
   - For Business: Invitation letter from Indian company, company registration
   - For Medical: Medical letter from hospital in India, medical records
   - For Conference: Invitation letter from organizer

**Features:**
- Drag & drop upload
- Multiple file selection
- Image preview before upload
- Validation for file type, size, dimensions
- Progress bar for uploads
- Delete/replace uploaded files

**Validation:**
- Passport bio page: Required, JPEG/JPG/PDF, max 1MB
- Photograph: Required, JPEG/JPG only, 350x350 to 1000x1000 pixels, white background check
- Supporting documents: At least one required for each visa type

---

### Step 12: Review & Submit
**Features:**
1. Summary View:
   - Display all entered information organized by category
   - Uploaded documents preview
   - Edit button for each section (goes back to specific step)

2. Declarations:
   - Checkbox: "I certify that the information provided is true and correct"
   - Checkbox: "I understand that providing false information may result in visa rejection"
   - Checkbox: "I agree to the terms and conditions"

3. Payment Information:
   - Visa Fee calculation based on:
     - Visa Type (Tourist/Business/Medical)
     - Nationality
     - Number of Entries
     - Duration
   - Service Fee (processing)
   - Total Amount

4. Submit Button:
   - Validates all steps
   - Shows any missing/incorrect information
   - Creates application in backend
   - Redirects to payment page

**Validation:**
- All declarations must be checked
- All previous steps must be complete
- No validation errors in any step

---

## Backend Implementation

### Database Schema (MongoDB)

```javascript
const indiaVisaApplicationSchema = new mongoose.Schema({
  // Application Metadata
  applicationNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String, default: 'india' },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'processing', 'approved', 'rejected', 'documents_required'],
    default: 'draft'
  },
  
  // Step 1: Passport OCR
  passportFrontPage: { type: String }, // Cloudinary URL
  passportBackPage: { type: String },
  ocrExtractedData: { type: Object },
  
  // Step 2: Personal Information
  personalInfo: {
    givenName: { type: String, required: true },
    surname: { type: String, required: true },
    nameChanged: { type: Boolean },
    previousName: { type: String },
    previousSurname: { type: String },
    dateOfBirth: { type: Date, required: true },
    birthPlace: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'], required: true },
    citizenshipNumber: { type: String },
    religion: { type: String, required: true },
    visibleMarks: { type: String },
    education: { type: String, required: true }
  },
  
  // Step 3: Passport Details
  passportDetails: {
    number: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    placeOfIssue: { type: String, required: true },
    previousPassport: {
      held: { type: Boolean },
      country: { type: String },
      number: { type: String },
      issueDate: { type: Date },
      placeOfIssue: { type: String },
      nationality: { type: String }
    },
    nationalityAcquisition: {
      bornAsCitizen: { type: Boolean },
      previousNationality: { type: String },
      acquisitionMethod: { type: String },
      acquisitionDate: { type: Date }
    }
  },
  
  // Step 4: Contact Information
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: true },
    currentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    permanentAddress: {
      sameAsCurrent: { type: Boolean },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    }
  },
  
  // Step 5: Family Information
  familyInfo: {
    father: {
      name: { type: String, required: true },
      nationality: { type: String, required: true },
      birthPlace: {
        city: { type: String, required: true },
        country: { type: String, required: true }
      },
      pakistanConnection: { type: Boolean }
    },
    mother: {
      name: { type: String, required: true },
      maidenName: { type: String },
      nationality: { type: String, required: true },
      birthPlace: {
        city: { type: String, required: true },
        country: { type: String, required: true }
      },
      pakistanConnection: { type: Boolean }
    },
    maritalStatus: { type: String, required: true },
    spouse: {
      name: { type: String },
      nationality: { type: String },
      birthPlace: {
        city: { type: String },
        country: { type: String }
      },
      residence: { type: String }
    },
    grandparents: {
      paternalGrandfather: {
        name: { type: String },
        nationality: { type: String }
      },
      maternalGrandfather: {
        name: { type: String },
        nationality: { type: String }
      }
    }
  },
  
  // Step 6: Professional Details
  professionalInfo: {
    currentOccupation: {
      type: { type: String, required: true },
      employerName: { type: String },
      designation: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String }
      },
      phone: { type: String }
    },
    previousOccupation: {
      changed: { type: Boolean },
      type: { type: String },
      employerName: { type: String }
    },
    militaryService: {
      served: { type: Boolean },
      organizationName: { type: String },
      designation: { type: String },
      rank: { type: String },
      postingPlace: { type: String }
    }
  },
  
  // Step 7: Travel Details
  travelInfo: {
    purpose: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    portOfArrival: { type: String, required: true },
    portOfExit: { type: String, required: true },
    durationOfStay: { type: Number, required: true },
    numberOfEntries: { type: String, required: true },
    placesToVisit: { type: String, required: true },
    hotelBooking: {
      confirmed: { type: Boolean },
      hotelName: { type: String },
      hotelAddress: { type: String },
      hotelCity: { type: String },
      hotelPhone: { type: String }
    },
    sponsor: {
      hasSpons: { type: Boolean },
      companyName: { type: String },
      companyAddress: { type: String },
      companyPhone: { type: String }
    },
    businessDetails: {
      companyToVisit: { type: String },
      companyAddress: { type: String },
      companyPhone: { type: String },
      contactPerson: { type: String }
    }
  },
  
  // Step 8: Previous Visit History
  visitHistory: {
    visitedBefore: { type: Boolean },
    previousVisits: {
      count: { type: Number },
      lastVisaNumber: { type: String },
      visaType: { type: String },
      issueDate: { type: Date },
      placeOfIssue: { type: String },
      previousAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String }
      },
      citiesVisited: [{ type: String }]
    },
    refusalHistory: {
      refused: { type: Boolean },
      controlNumber: { type: String },
      reason: { type: String }
    },
    saarcVisits: {
      visited: { type: Boolean },
      countries: [{ type: String }],
      year: { type: Number },
      visitCount: { type: Number }
    }
  },
  
  // Step 9: References
  references: {
    indiaReference: {
      name: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true }
      },
      phone: { type: String, required: true },
      relationship: { type: String, required: true }
    },
    homeCountryReference: {
      name: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true }
      },
      phone: { type: String, required: true }
    }
  },
  
  // Step 10: Security Questions
  securityQuestions: {
    arrested: { answer: { type: Boolean }, details: { type: String } },
    deported: { answer: { type: Boolean }, details: { type: String } },
    trafficking: { answer: { type: Boolean }, details: { type: String } },
    terrorism: { answer: { type: Boolean }, details: { type: String } },
    asylumSeeker: { answer: { type: Boolean }, details: { type: String } }
  },
  
  // Step 11: Documents
  documents: {
    passportPages: [{ type: String }], // Cloudinary URLs
    photograph: { type: String, required: true },
    supportingDocs: [{ 
      type: { type: String },
      url: { type: String },
      filename: { type: String }
    }]
  },
  
  // Step 12: Review & Submit
  declarations: {
    informationTrue: { type: Boolean, required: true },
    understandConsequences: { type: Boolean, required: true },
    agreeToTerms: { type: Boolean, required: true }
  },
  
  // Payment
  payment: {
    visaFee: { type: Number },
    serviceFee: { type: Number },
    totalAmount: { type: Number },
    paymentId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'] }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date }
});
```

### API Endpoints

#### 1. OCR Processing
```
POST /api/applications/india/ocr
Body: { frontPage: File, backPage: File }
Response: { extractedData: { ... }, frontPageUrl: String, backPageUrl: String }
```

#### 2. Save Draft Application
```
POST /api/applications/india/draft
Body: { userId, formData, currentStep }
Response: { applicationId, message }
```

#### 3. Submit Application
```
POST /api/applications/india/submit
Body: { applicationId, allFormData, declarations }
Response: { applicationNumber, paymentUrl }
```

#### 4. Upload Documents
```
POST /api/applications/india/documents/:applicationId
Body: FormData with files
Response: { uploadedUrls: [...] }
```

#### 5. Get Application Status
```
GET /api/applications/india/:applicationId
Response: { application: {...}, status, timeline }
```

---

## Validation Rules

### Client-Side Validation (React)

**Email Validation:**
```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

**Passport Number Validation:**
```javascript
const validatePassportNumber = (number, country) => {
  const patterns = {
    USA: /^[A-Z0-9]{9}$/,
    UK: /^[0-9]{9}$/,
    IND: /^[A-Z]{1}[0-9]{7}$/,
    // Add more country patterns
  };
  return patterns[country]?.test(number) || /^[A-Z0-9]{6,9}$/.test(number);
};
```

**Date Validation:**
```javascript
const validateArrivalDate = (date) => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4); // Minimum 4 days from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 4); // Maximum 4 months from now
  return date >= minDate && date <= maxDate;
};
```

**Passport Expiry Validation:**
```javascript
const validatePassportExpiry = (expiryDate, arrivalDate) => {
  const sixMonthsAfterArrival = new Date(arrivalDate);
  sixMonthsAfterArrival.setMonth(sixMonthsAfterArrival.getMonth() + 6);
  return expiryDate >= sixMonthsAfterArrival;
};
```

### Server-Side Validation (Express)

Use `express-validator` middleware:

```javascript
const { body, validationResult } = require('express-validator');

const validateIndiaApplication = [
  // Personal Info
  body('personalInfo.givenName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Given name must be 2-50 characters'),
  
  body('personalInfo.surname')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Surname must be 2-50 characters'),
  
  body('personalInfo.dateOfBirth')
    .isISO8601()
    .custom(value => {
      const age = (Date.now() - new Date(value)) / 31557600000;
      if (age < 18) throw new Error('Must be 18 or older');
      return true;
    }),
  
  // Contact Info
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  
  body('contactInfo.phone')
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Invalid phone number'),
  
  // Passport Details
  body('passportDetails.expiryDate')
    .custom((value, { req }) => {
      const expiry = new Date(value);
      const arrival = new Date(req.body.travelInfo.arrivalDate);
      const sixMonthsLater = new Date(arrival);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      
      if (expiry < sixMonthsLater) {
        throw new Error('Passport must be valid for 6 months from arrival');
      }
      return true;
    }),
  
  // Security Questions - at least one answer required
  body('securityQuestions.*.answer')
    .isBoolean()
    .withMessage('All security questions must be answered'),
  
  body('securityQuestions.*.details')
    .if((value, { req, path }) => {
      // If answer is true, details required
      const questionKey = path.split('.')[1];
      return req.body.securityQuestions[questionKey]?.answer === true;
    })
    .isLength({ min: 50 })
    .withMessage('Please provide detailed explanation (min 50 characters)')
];

module.exports = { validateIndiaApplication };
```

---

## File Upload Handling

### Frontend Upload Component
```javascript
import { useState } from 'react';
import axios from 'axios';

const DocumentUpload = ({ onUploadComplete, documentType, requirements }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
      alert('Only JPEG, PNG, and PDF files are allowed');
      return;
    }
    
    // Validate file size
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      alert('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    try {
      const response = await axios.post('/api/applications/india/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      onUploadComplete(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <input type="file" onChange={handleFileSelect} accept=".jpg,.jpeg,.png,.pdf" />
      {preview && <img src={preview} alt="Preview" className="upload-preview" />}
      {file && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? `Uploading... ${progress}%` : 'Upload'}
        </button>
      )}
    </div>
  );
};
```

### Backend Upload Handler (Cloudinary)
```javascript
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'india-visa-documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

---

## OCR Integration

### Google Vision API Setup
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const extractPassportData = async (imageUrl) => {
  try {
    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;
    const text = detections[0]?.description || '';
    
    // Parse passport data using regex patterns
    const extractedData = {
      passportNumber: extractPassportNumber(text),
      givenName: extractGivenName(text),
      surname: extractSurname(text),
      dateOfBirth: extractDateOfBirth(text),
      dateOfIssue: extractDateOfIssue(text),
      dateOfExpiry: extractDateOfExpiry(text),
      nationality: extractNationality(text),
      sex: extractSex(text)
    };
    
    return extractedData;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to process passport image');
  }
};

// Helper functions for parsing
const extractPassportNumber = (text) => {
  const match = text.match(/Passport No\.?\s*([A-Z0-9]{8,9})/i);
  return match ? match[1] : null;
};

const extractGivenName = (text) => {
  const match = text.match(/Given Names?\s*\/\s*(.+?)(?:\n|Surname)/i);
  return match ? match[1].trim() : null;
};

// ... more extraction functions
```

---

## Email Notifications

### Application Submission Email
```javascript
const sendSubmissionEmail = async (application, user) => {
  const emailHtml = `
    <h2>India e-Visa Application Submitted</h2>
    <p>Dear ${application.personalInfo.givenName},</p>
    <p>Your India e-Visa application has been successfully submitted.</p>
    <h3>Application Details:</h3>
    <ul>
      <li><strong>Application Number:</strong> ${application.applicationNumber}</li>
      <li><strong>Visa Type:</strong> ${application.travelInfo.purpose}</li>
      <li><strong>Applicant Name:</strong> ${application.personalInfo.givenName} ${application.personalInfo.surname}</li>
      <li><strong>Passport Number:</strong> ${application.passportDetails.number}</li>
      <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
    </ul>
    <h3>Next Steps:</h3>
    <ol>
      <li>Your application is under review</li>
      <li>You will receive updates via email</li>
      <li>Processing time: 3-5 business days</li>
      <li>Track your application status in your profile</li>
    </ol>
    <p>Important: Please keep your passport ready for travel. Do not make any changes to your passport during the processing period.</p>
  `;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `India e-Visa Application Submitted - ${application.applicationNumber}`,
    html: emailHtml
  });
};
```

---

## Fee Calculation Logic

```javascript
const calculateIndiaVisaFee = (application) => {
  const { travelInfo, personalInfo } = application;
  
  // Base fees by visa type and nationality (USD)
  const baseFees = {
    Tourist: {
      USA: 100,
      UK: 100,
      GBR: 100,
      CAN: 100,
      default: 80
    },
    Business: {
      USA: 160,
      UK: 160,
      GBR: 160,
      CAN: 160,
      default: 100
    },
    Medical: {
      default: 80
    }
  };
  
  // Get nationality from passport
  const nationality = application.passportDetails.nationality || 'default';
  const visaType = travelInfo.purpose;
  
  // Calculate base fee
  let visaFee = baseFees[visaType]?.[nationality] || baseFees[visaType]?.default || 80;
  
  // Multiple entry surcharge
  if (travelInfo.numberOfEntries === 'Multiple') {
    visaFee *= 1.5;
  }
  
  // Service fee
  const serviceFee = 30;
  
  // Total
  const totalAmount = visaFee + serviceFee;
  
  return {
    visaFee,
    serviceFee,
    totalAmount,
    currency: 'USD'
  };
};
```

---

## Admin Panel Features

### View India Applications
- Separate tab/section for India visa applications
- Filter by status, date range, visa type
- Search by application number, passport number, or name
- Bulk actions (approve, request documents, reject)

### Application Details View
- All submitted information organized by category
- Document viewer with zoom and download
- OCR extracted data comparison
- Status update options
- Internal notes section
- Email communication history

### Analytics Dashboard
- India visa statistics (total applications, approval rate)
- Popular visa types
- Average processing time
- Revenue from India visa applications
- Nationality breakdown

---

## Testing Checklist

### Unit Tests
- [ ] Form field validation functions
- [ ] Fee calculation logic
- [ ] Date validation (arrival, expiry, age)
- [ ] Email format validation
- [ ] Passport number format validation
- [ ] OCR data extraction parsing

### Integration Tests
- [ ] Complete application flow (all 12 steps)
- [ ] Document upload to Cloudinary
- [ ] OCR API integration
- [ ] Email sending
- [ ] Payment integration
- [ ] Database save/retrieve

### E2E Tests (Cypress)
```javascript
describe('India e-Visa Application', () => {
  it('should complete full application flow', () => {
    cy.visit('/apply');
    
    // Step 0: Country Selection
    cy.get('input[value="india"]').click();
    cy.contains('Continue').click();
    
    // Step 1: Passport Upload
    cy.get('input[type="file"]').first().attachFile('passport-front.jpg');
    cy.get('input[type="file"]').last().attachFile('passport-back.jpg');
    cy.contains('Process with OCR').click();
    cy.wait(5000); // Wait for OCR
    
    // Step 2: Personal Information
    cy.get('input[name="givenName"]').should('have.value'); // OCR filled
    cy.get('select[name="gender"]').select('Male');
    cy.get('select[name="religion"]').select('Hindu');
    cy.get('select[name="education"]').select('Graduate & Above');
    cy.contains('Next').click();
    
    // ... continue through all steps
    
    // Step 12: Review & Submit
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').last().check();
    cy.contains('Submit Application').click();
    
    // Verify redirect to payment
    cy.url().should('include', '/payment');
  });
});
```

### Manual Testing
- [ ] Test with various passport formats
- [ ] Test with different nationalities
- [ ] Test validation error messages
- [ ] Test back/forward navigation between steps
- [ ] Test draft save/resume functionality
- [ ] Test mobile responsiveness
- [ ] Test file upload with various sizes and formats
- [ ] Test OCR accuracy with different passport qualities

---

## Deployment Steps

### 1. Environment Variables
```env
# Backend .env
MONGODB_URI=mongodb://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://yourdomain.com
```

### 2. Backend Deployment
```bash
cd backend
npm install
npm run build
pm2 start server.js --name india-visa-api
```

### 3. Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Deploy build folder to hosting (Vercel, Netlify, etc.)
```

### 4. Database Migration
```bash
# Run migration script to add India visa collection
node scripts/migrateIndiaVisa.js
```

### 5. Post-Deployment Verification
- [ ] Test OCR functionality
- [ ] Test file uploads
- [ ] Test email notifications
- [ ] Test payment integration
- [ ] Verify database connections
- [ ] Check admin panel access

---

## Future Enhancements

### Phase 2
- [ ] Visa status tracking with real-time updates
- [ ] WhatsApp notifications
- [ ] Multiple language support (Hindi, Spanish, etc.)
- [ ] Visa interview scheduling
- [ ] Travel insurance integration
- [ ] Flight booking recommendations

### Phase 3
- [ ] AI-powered document verification
- [ ] Chatbot for application assistance
- [ ] Mobile app (React Native)
- [ ] Visa approval predictions using ML
- [ ] Automated passport validation

---

## Support & Documentation

### User Guides
- Create PDF guide for India e-Visa application process
- Video tutorial for each step
- FAQ section on website
- Live chat support

### Developer Documentation
- API documentation (Swagger/Postman)
- Database schema diagrams
- Component library documentation
- Deployment guides

---

## Timeline Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| Phase 1 | Steps 1-4 (Passport, Personal, Contact) | 1 week |
| Phase 2 | Steps 5-7 (Family, Professional, Travel) | 1 week |
| Phase 3 | Steps 8-10 (History, References, Security) | 1 week |
| Phase 4 | Steps 11-12 (Documents, Review) | 1 week |
| Phase 5 | Backend API & Database | 1 week |
| Phase 6 | Testing & Bug Fixes | 1 week |
| Phase 7 | Admin Panel Integration | 3 days |
| Phase 8 | Deployment & Documentation | 2 days |
| **Total** | | **6-7 weeks** |

---

## Contact for Implementation

For any questions or clarifications during implementation, please refer to:
- Project Requirements Document
- API Documentation
- Design System Guide
- This Implementation Plan

**Last Updated:** 2024
**Version:** 1.0
