const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');
const fs = require('fs');
const path = require('path');

// Initialize credentials for Railway deployment
let credentialsInitialized = false;

function initializeCredentials() {
  if (credentialsInitialized) return;
  
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (credsJson && credsJson.startsWith('{')) {
    // If it's JSON content, write to temp file
    const tempPath = path.join('/tmp', 'google-creds.json');
    fs.writeFileSync(tempPath, credsJson);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
    console.log('Google credentials written to temp file');
  }
  
  credentialsInitialized = true;
}

/**
 * Create an assessment to analyze the risk of a UI action.
 * 
 * @param {string} token - The generated token obtained from the client
 * @param {string} recaptchaAction - Action name corresponding to the token
 * @returns {Promise<number|null>} - Risk score (0.0 to 1.0) or null if invalid
 */
async function createAssessment(token, recaptchaAction = 'LOGIN') {
  try {
    initializeCredentials();
    
    const projectID = process.env.RECAPTCHA_PROJECT_ID || 'israelvisa-1a0b3';
    const recaptchaKey = process.env.RECAPTCHA_SITE_KEY || '6LdyHk8sAAAAAG43bRZ0XFSdm7m9EOIsPomDris5';

    // Create the reCAPTCHA client
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Check if the token is valid
    if (!response.tokenProperties.valid) {
      console.log(`reCAPTCHA token invalid: ${response.tokenProperties.invalidReason}`);
      return null;
    }

    // Check if the expected action was executed
    if (response.tokenProperties.action === recaptchaAction) {
      // Get the risk score (0.0 to 1.0)
      // Higher scores indicate lower risk
      console.log(`reCAPTCHA score: ${response.riskAnalysis.score}`);
      
      if (response.riskAnalysis.reasons && response.riskAnalysis.reasons.length > 0) {
        console.log('Risk reasons:', response.riskAnalysis.reasons);
      }

      return response.riskAnalysis.score;
    } else {
      console.log(`Action mismatch. Expected: ${recaptchaAction}, Got: ${response.tokenProperties.action}`);
      return null;
    }
  } catch (error) {
    console.error('reCAPTCHA assessment error:', error);
    return null;
  }
}

/**
 * Verify reCAPTCHA token with a minimum score threshold
 * 
 * @param {string} token - The reCAPTCHA token
 * @param {string} action - The action name
 * @param {number} minScore - Minimum acceptable score (default: 0.5)
 * @returns {Promise<boolean>} - True if verified, false otherwise
 */
async function verifyRecaptcha(token, action = 'LOGIN', minScore = 0.5) {
  if (!token) {
    console.log('No reCAPTCHA token provided');
    return false;
  }

  const score = await createAssessment(token, action);
  
  if (score === null) {
    return false;
  }

  // Score ranges from 0.0 (likely bot) to 1.0 (likely human)
  return score >= minScore;
}

module.exports = {
  createAssessment,
  verifyRecaptcha,
};
