import axios from 'axios';

const OCR_API_KEY = 'K82439227288957';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

/**
 * OCR Service for Indian Passport Extraction
 * Follows strict validation and extraction rules for accurate passport data capture
 */

class PassportOCRService {
  /**
   * Main function to process passport image
   * @param {File} file - Passport image file
   * @returns {Object} - Extracted passport data with confidence scores
   */
  async processPassport(file) {
    try {
      // Step 1: Upload and extract text using OCR.space API
      const ocrResult = await this.performOCR(file);
      
      if (!ocrResult.success) {
        return {
          success: false,
          error: ocrResult.error,
          message: 'Failed to extract text from image'
        };
      }

      const extractedText = ocrResult.text;
      console.log('Extracted Text:', extractedText);

      // Step 2: Validate if document is a passport
      const isPassport = this.validateIsPassport(extractedText);
      
      if (!isPassport.valid) {
        return {
          success: false,
          isPassport: false,
          message: 'The uploaded document does not appear to be a valid passport. Please upload a clear image of your passport.',
          reason: isPassport.reason
        };
      }

      // Step 3: Check image quality
      const qualityCheck = this.validateImageQuality(ocrResult);
      
      if (!qualityCheck.passed) {
        return {
          success: false,
          qualityIssue: true,
          message: `Image quality issue: ${qualityCheck.issues.join(', ')}. Please upload a clearer image.`,
          issues: qualityCheck.issues
        };
      }

      // Step 4: Extract MRZ data (most reliable)
      const mrzData = this.extractMRZ(extractedText);
      console.log('MRZ Data:', mrzData);

      // Step 5: Extract field-by-field data
      const extractedData = this.extractPassportFields(extractedText, mrzData);
      console.log('Extracted Fields:', extractedData);

      // Step 6: Cross-validate with MRZ
      const validatedData = this.crossValidateWithMRZ(extractedData, mrzData);
      console.log('Validated Data:', validatedData);

      // Step 7: Calculate confidence scores
      const dataWithConfidence = this.calculateConfidence(validatedData);
      console.log('Data with Confidence:', dataWithConfidence);

      return {
        success: true,
        isPassport: true,
        data: dataWithConfidence,
        message: 'We\'ve filled this using OCR. Please review carefully before continuing.',
        qualityCheck: qualityCheck
      };

    } catch (error) {
      console.error('OCR Processing Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'An error occurred while processing the passport image'
      };
    }
  }

  /**
   * Perform OCR using OCR.space API
   */
  async performOCR(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apikey', OCR_API_KEY);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

      const response = await axios.post(OCR_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.IsErroredOnProcessing) {
        return {
          success: false,
          error: response.data.ErrorMessage?.[0] || 'OCR processing failed'
        };
      }

      const parsedText = response.data.ParsedResults?.[0]?.ParsedText || '';
      
      return {
        success: true,
        text: parsedText,
        exitCode: response.data.ParsedResults?.[0]?.FileParseExitCode || 1,
        errorDetails: response.data.ParsedResults?.[0]?.ErrorDetails || null
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Step 1: Validate if document is a passport
   * Checks for multiple strong indicators
   */
  validateIsPassport(text) {
    const upperText = text.toUpperCase();
    let indicators = 0;
    const reasons = [];

    // Indicator 1: Key passport words
    const hasRepublicOfIndia = upperText.includes('REPUBLIC OF INDIA') || text.includes('भारत गणराज्य');
    const hasPassportWord = upperText.includes('PASSPORT') || text.includes('पासपोर्ट');
    
    if (hasRepublicOfIndia || hasPassportWord) {
      indicators++;
      reasons.push('Contains passport keywords');
    }

    // Indicator 2: Passport number pattern (1 letter + 7 digits)
    const passportNumberPattern = /\b[A-Z]\d{7}\b/;
    if (passportNumberPattern.test(upperText)) {
      indicators++;
      reasons.push('Valid passport number pattern found');
    }

    // Indicator 3: Standard passport fields
    const hasStandardFields = [
      /NATIONALITY/i,
      /DATE OF BIRTH/i,
      /DATE OF ISSUE/i,
      /DATE OF EXPIRY/i,
      /SURNAME|GIVEN NAME/i,
      /PLACE OF BIRTH/i
    ];
    
    const fieldsFound = hasStandardFields.filter(pattern => pattern.test(text)).length;
    if (fieldsFound >= 3) {
      indicators++;
      reasons.push(`Found ${fieldsFound} standard passport fields`);
    }

    // Indicator 4: MRZ (Machine Readable Zone)
    const hasMRZ = /P<IND/i.test(text) || /P<< IND/i.test(text);
    if (hasMRZ) {
      indicators++;
      reasons.push('Machine Readable Zone detected');
    }

    // Decision: Need at least 2 indicators
    if (indicators >= 2) {
      return {
        valid: true,
        confidence: indicators * 25,
        indicators: indicators,
        reasons: reasons
      };
    }

    return {
      valid: false,
      confidence: 0,
      indicators: indicators,
      reason: 'Document does not have enough passport indicators'
    };
  }

  /**
   * Step 2: Validate image quality
   */
  validateImageQuality(ocrResult) {
    const issues = [];
    const text = ocrResult.text;

    // Check if text is too short (likely blurred or unreadable)
    if (text.length < 100) {
      issues.push('Text extraction too short - image may be blurred');
    }

    // Check for passport number area
    const hasPassportNumber = /\b[A-Z]\d{7}\b/.test(text.toUpperCase());
    if (!hasPassportNumber) {
      issues.push('Passport number area not clearly visible');
    }

    // Check for MRZ area
    const hasMRZ = /P<IND/.test(text.toUpperCase()) || /P<<IND/.test(text.toUpperCase());
    if (!hasMRZ) {
      issues.push('Machine Readable Zone (MRZ) missing or unclear');
    }

    // Check if exit code indicates issues
    if (ocrResult.exitCode !== 1 && ocrResult.errorDetails) {
      issues.push(ocrResult.errorDetails);
    }

    return {
      passed: issues.length === 0,
      issues: issues,
      confidence: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30))
    };
  }

  /**
   * Step 3: Extract MRZ (Machine Readable Zone) data
   * MRZ is the most reliable data source
   */
  extractMRZ(text) {
    try {
      const lines = text.split('\n');
      const mrzLines = [];

      // Find MRZ lines (typically last 2 lines, starting with P<IND)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/\s+/g, '').toUpperCase();
        if (line.startsWith('P<IND') || line.startsWith('P<<IND')) {
          mrzLines.push(line);
          if (lines[i + 1]) {
            mrzLines.push(lines[i + 1].replace(/\s+/g, '').toUpperCase());
          }
          break;
        }
      }

      if (mrzLines.length < 2) {
        return null;
      }

      // Parse MRZ Line 1: P<INDLASTNAME<<FIRSTNAME<<<<<<<<<<<<<<<<<<<<<
      const line1 = mrzLines[0];
      const namesSection = line1.substring(5).split('<<');
      const surname = namesSection[0]?.replace(/</g, ' ').trim() || '';
      const givenName = namesSection[1]?.replace(/</g, ' ').trim() || '';

      // Parse MRZ Line 2: L8369854<0IND9308122F3008026<<<<<<<<<<<<<<<08
      const line2 = mrzLines[1];
      
      return {
        passportNumber: line2.substring(0, 9).replace(/</g, '').trim(),
        nationality: 'INDIAN',
        dateOfBirth: this.parseMRZDate(line2.substring(13, 19)),
        gender: line2.charAt(20) === 'M' ? 'MALE' : line2.charAt(20) === 'F' ? 'FEMALE' : '',
        dateOfExpiry: this.parseMRZDate(line2.substring(21, 27)),
        surname: surname,
        givenName: givenName,
        source: 'MRZ'
      };

    } catch (error) {
      console.error('MRZ parsing error:', error);
      return null;
    }
  }

  /**
   * Parse MRZ date format (YYMMDD) to dd-mm-yyyy
   */
  parseMRZDate(mrzDate) {
    if (!mrzDate || mrzDate.length !== 6) return '';
    
    try {
      const yy = parseInt(mrzDate.substring(0, 2));
      const mm = mrzDate.substring(2, 4);
      const dd = mrzDate.substring(4, 6);
      
      // Determine century (if YY > 30, assume 1900s, else 2000s)
      const yyyy = yy > 30 ? `19${yy}` : `20${yy}`;
      
      return `${dd}-${mm}-${yyyy}`;
    } catch (error) {
      return '';
    }
  }

  /**
   * Step 4: Extract passport fields from OCR text
   */
  extractPassportFields(text, mrzData) {
    const data = {};

    // Always set as Ordinary for Indian passports
    data.travelDocumentType = 'Ordinary';

    // Extract Passport Number
    data.passportNumber = this.extractPassportNumber(text);

    // Country Code
    data.passportCountryCode = 'IND';

    // Nationality
    data.nationality = this.extractNationality(text);

    // Biometric Passport Detection
    data.isBiometric = this.detectBiometric(text);

    // Gender
    data.gender = this.extractGender(text);

    // Names
    const names = this.extractNames(text);
    data.familyName = names.surname;
    data.givenName = names.givenName;

    // Dates
    data.dateOfBirth = this.extractDate(text, 'DATE OF BIRTH');
    data.dateOfIssue = this.extractDate(text, 'DATE OF ISSUE');
    data.dateOfExpiry = this.extractDate(text, 'DATE OF EXPIRY');

    // Place of Birth
    data.placeOfBirth = this.extractPlaceOfBirth(text);

    return data;
  }

  /**
   * Extract Passport Number
   */
  extractPassportNumber(text) {
    const upperText = text.toUpperCase();
    
    // Look for "Passport No" label (most reliable)
    const patterns = [
      /PASSPORT\s*(?:NO|NUMBER|N0)[.:\s]*([A-Z])\s*(\d{7})/i,
      /PASSPORT[:\s]*([A-Z])\s*(\d{7})/i,
      /(?:NO|NUMBER)[.:\s]*([A-Z])\s*(\d{7})/i
    ];
    
    for (const pattern of patterns) {
      const match = upperText.match(pattern);
      if (match) {
        return (match[1] + match[2]).replace(/\s+/g, '');
      }
    }

    // Look for pattern anywhere in text (standalone)
    const patternMatch = upperText.match(/\b([A-Z])(\d{7})\b/);
    if (patternMatch) {
      return patternMatch[1] + patternMatch[2];
    }

    return '';
  }

  /**
   * Extract Nationality
   */
  extractNationality(text) {
    if (/INDIAN|INDIA/i.test(text)) {
      return 'INDIAN';
    }
    return '';
  }

  /**
   * Detect if passport is biometric
   */
  detectBiometric(text) {
    // Check for chip symbol mention or assume yes for modern passports
    const hasChipMention = /CHIP|BIOMETRIC|ELECTRONIC/i.test(text);
    
    // Extract issue date to check if >= 2008
    const issueDate = this.extractDate(text, 'DATE OF ISSUE');
    if (issueDate) {
      const year = parseInt(issueDate.split('-')[2]);
      if (year >= 2008) {
        return 'yes';
      }
    }

    return hasChipMention ? 'yes' : 'yes'; // Default to yes for Indian passports
  }

  /**
   * Extract Gender
   */
  extractGender(text) {
    const genderMatch = text.match(/Sex[:\s]*([MF])/i);
    if (genderMatch) {
      return genderMatch[1].toUpperCase() === 'M' ? 'MALE' : 'FEMALE';
    }
    return '';
  }

  /**
   * Extract Names (Surname and Given Name)
   */
  extractNames(text) {
    const result = { surname: '', givenName: '' };

    // Look for surname with multiple patterns
    const surnamePatterns = [
      /Surname[:\s]*([A-Z][A-Z\s]+?)(?:\n|Given|Sex|Date|Nationality)/i,
      /(?:Family|Last)\s*Name[:\s]*([A-Z][A-Z\s]+?)(?:\n|Given|Sex|Date)/i,
      /SURNAME[:\s\n]+([A-Z][A-Z\s]+?)(?:\n|GIVEN|SEX|DATE)/
    ];
    
    for (const pattern of surnamePatterns) {
      const match = text.match(pattern);
      if (match) {
        result.surname = match[1].trim().replace(/\s+/g, ' ');
        break;
      }
    }

    // Look for given name with multiple patterns
    const givenNamePatterns = [
      /Given\s*Name[s]?[:\s]*([A-Z][A-Z\s]+?)(?:\n|Sex|Date|Nationality|Place)/i,
      /(?:First|Given)\s*Name[:\s]*([A-Z][A-Z\s]+?)(?:\n|Sex|Date)/i,
      /GIVEN\s*NAME[S]?[:\s\n]+([A-Z][A-Z\s]+?)(?:\n|SEX|DATE|NATIONALITY)/
    ];
    
    for (const pattern of givenNamePatterns) {
      const match = text.match(pattern);
      if (match) {
        let name = match[1].trim().replace(/\s+/g, ' ');
        // Remove titles
        name = name.replace(/\b(MR|MRS|DR|MS|MISS)\b\.?/gi, '').trim();
        result.givenName = name;
        break;
      }
    }

    // If no surname found but given name exists, it's okay (common in Indian passports)
    // If neither found, try to extract full name
    if (!result.surname && !result.givenName) {
      const nameMatch = text.match(/Name[:\s]*([A-Z][A-Z\s]+?)(?:\n|Passport|Sex|Date)/i);
      if (nameMatch) {
        const fullName = nameMatch[1].trim();
        // Try to split into surname and given name
        const nameParts = fullName.split(/\s+/);
        if (nameParts.length > 1) {
          result.surname = nameParts[nameParts.length - 1];
          result.givenName = nameParts.slice(0, -1).join(' ');
        } else {
          result.givenName = fullName;
        }
      }
    }

    return result;
  }

  /**
   * Extract dates with specific labels
   */
  extractDate(text, label) {
    // Try various date formats and patterns
    const patterns = [
      // DD/MM/YYYY or DD-MM-YYYY
      new RegExp(`${label}[:\\s]*?(\\d{2})[/-](\\d{2})[/-](\\d{4})`, 'i'),
      // DD Month YYYY
      new RegExp(`${label}[:\\s]*?(\\d{1,2})\\s+(\\w+)\\s+(\\d{4})`, 'i'),
      // More flexible spacing
      new RegExp(`${label}[:\\s\\n]+(\\d{2})[/-](\\d{2})[/-](\\d{4})`, 'i'),
      // With colon
      new RegExp(`${label}\\s*:\\s*(\\d{2})[/-](\\d{2})[/-](\\d{4})`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // Handle DD-MM-YYYY or DD/MM/YYYY
        if (match[2] && match[2].match(/^\d{1,2}$/)) {
          const dd = match[1].padStart(2, '0');
          const mm = match[2].padStart(2, '0');
          const yyyy = match[3];
          
          // Validate date
          if (parseInt(dd) > 0 && parseInt(dd) <= 31 && parseInt(mm) > 0 && parseInt(mm) <= 12) {
            return `${dd}-${mm}-${yyyy}`;
          }
        }
        
        // Handle DD Month YYYY
        if (match[2] && !match[2].match(/^\d+$/)) {
          const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const monthFull = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          
          const monthStr = match[2].toUpperCase();
          let monthIndex = monthNames.findIndex(m => monthStr.startsWith(m));
          
          if (monthIndex === -1) {
            monthIndex = monthFull.findIndex(m => monthStr.startsWith(m));
          }
          
          if (monthIndex !== -1) {
            const dd = match[1].padStart(2, '0');
            const mm = (monthIndex + 1).toString().padStart(2, '0');
            const yyyy = match[3];
            return `${dd}-${mm}-${yyyy}`;
          }
        }
      }
    }

    return '';
  }

  /**
   * Extract Place of Birth
   */
  extractPlaceOfBirth(text) {
    const patterns = [
      /Place of Birth[:\s]*([A-Z][A-Z\s,]+?)(?:\n|Passport|Date|Sex|Authority)/i,
      /(?:Birth\s*Place|POB)[:\s]*([A-Z][A-Z\s,]+?)(?:\n|Passport|Date)/i,
      /PLACE\s*OF\s*BIRTH[:\s\n]+([A-Z][A-Z\s,]+?)(?:\n|PASSPORT|DATE)/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    
    return '';
  }

  /**
   * Step 5: Cross-validate extracted data with MRZ
   * MRZ data takes priority in case of conflict
   */
  crossValidateWithMRZ(extractedData, mrzData) {
    if (!mrzData) {
      return extractedData;
    }

    const validated = { ...extractedData };

    // MRZ wins for these critical fields
    if (mrzData.passportNumber && mrzData.passportNumber.length === 8) {
      validated.passportNumber = mrzData.passportNumber;
      validated.passportNumberSource = 'MRZ';
    }

    if (mrzData.dateOfBirth) {
      validated.dateOfBirth = mrzData.dateOfBirth;
      validated.dobSource = 'MRZ';
    }

    if (mrzData.gender) {
      validated.gender = mrzData.gender;
      validated.genderSource = 'MRZ';
    }

    if (mrzData.dateOfExpiry) {
      validated.dateOfExpiry = mrzData.dateOfExpiry;
      validated.expirySource = 'MRZ';
    }

    if (mrzData.nationality) {
      validated.nationality = mrzData.nationality;
    }

    // For names, prefer MRZ if extracted data is empty
    if (!validated.familyName && mrzData.surname) {
      validated.familyName = mrzData.surname;
    }

    if (!validated.givenName && mrzData.givenName) {
      validated.givenName = mrzData.givenName;
    }

    return validated;
  }

  /**
   * Step 6: Calculate confidence scores for each field
   */
  calculateConfidence(data) {
    const result = {};

    for (const [key, value] of Object.entries(data)) {
      if (!value || key.includes('Source')) {
        result[key] = value;
        continue;
      }

      let confidence = 50; // Base confidence

      // Higher confidence for MRZ-sourced data
      if (data[`${key}Source`] === 'MRZ') {
        confidence = 95;
      }

      // Passport number validation
      if (key === 'passportNumber') {
        const isValid = /^[A-Z]\d{7}$/.test(value);
        confidence = isValid ? 90 : 50;
      }

      // Date validation
      if (key.includes('date') || key.includes('Date')) {
        const isValid = /^\d{2}-\d{2}-\d{4}$/.test(value);
        confidence = isValid ? 85 : 50;
      }

      // Gender validation
      if (key === 'gender') {
        const isValid = ['MALE', 'FEMALE'].includes(value);
        confidence = isValid ? 90 : 50;
      }

      // Name validation
      if (key === 'familyName' || key === 'givenName') {
        const isValid = /^[A-Z\s]+$/.test(value);
        confidence = isValid ? 80 : 60;
      }

      result[key] = value;
      result[`${key}Confidence`] = confidence;
    }

    return result;
  }

  /**
   * Date validation helper
   */
  validateDates(data) {
    const errors = [];

    if (data.dateOfIssue && data.dateOfExpiry) {
      const issue = this.parseDate(data.dateOfIssue);
      const expiry = this.parseDate(data.dateOfExpiry);
      
      if (issue && expiry && issue >= expiry) {
        errors.push('Date of Expiry must be after Date of Issue');
      }
    }

    if (data.dateOfBirth && data.dateOfIssue) {
      const dob = this.parseDate(data.dateOfBirth);
      const issue = this.parseDate(data.dateOfIssue);
      
      if (dob && issue && dob >= issue) {
        errors.push('Date of Issue must be after Date of Birth');
      }
    }

    return errors;
  }

  /**
   * Parse date string to Date object
   */
  parseDate(dateStr) {
    if (!dateStr) return null;
    
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
}

// Export singleton instance
export const passportOCR = new PassportOCRService();
export default passportOCR;
