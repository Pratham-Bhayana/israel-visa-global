import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    return userCredential;
  };

  // Sign in with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Setup reCAPTCHA verifier with Enterprise token
  const setupRecaptcha = async (containerId) => {
    // Get reCAPTCHA Enterprise token
    const recaptchaToken = await window.grecaptcha.enterprise.execute(
      '6LdyHk8sAAAAAG43bRZ0XFSdm7m9EOIsPomDris5',
      { action: 'LOGIN' }
    );

    // Store token for later use in verification
    window.recaptchaEnterpriseToken = recaptchaToken;

    // Create Firebase RecaptchaVerifier with invisible reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });

    return recaptchaToken;
  };

  // Send OTP to phone number
  const sendOTP = async (phoneNumber) => {
    try {
      // Ensure phone number has country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  // Verify OTP and authenticate with backend
  const verifyOTP = async (otp) => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // Get the reCAPTCHA token that was generated during setup
      const recaptchaToken = window.recaptchaEnterpriseToken;

      // Send to backend for verification and JWT generation
      const response = await axios.post(`${API_URL}/auth/verify-phone`, {
        phoneNumber: firebaseUser.phoneNumber,
        firebaseUid: firebaseUser.uid,
        recaptchaToken: recaptchaToken,
      });

      // Store JWT token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return firebaseUser;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
