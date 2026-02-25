import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, setupRecaptcha, sendOTP, verifyOTP } = useAuth();
  const from = location.state?.from || '/profile';
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize reCAPTCHA on mount
  React.useEffect(() => {
    if (window.grecaptcha && window.grecaptcha.enterprise) {
      window.grecaptcha.enterprise.ready(() => {
        console.log('reCAPTCHA Enterprise ready');
      });
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success('Login successful!');
      navigate(from);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      
      // Setup reCAPTCHA
      await setupRecaptcha('recaptcha-container');
      
      // Send OTP
      await sendOTP(phoneNumber);
      
      setShowOtpInput(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(otp);
      toast.success('Login successful!');
      navigate(from);
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login to Your Account - Israel Visa Application Portal</title>
        <meta name="description" content="Login to your Israel visa application account. Track your visa application status, manage documents, and receive real-time updates." />
        <meta name="keywords" content="Israel visa login, visa application login, track visa status" />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/login`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="auth-page">
        <div className="auth-container">
          <motion.div 
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to track your visa application</p>
            </div>

            <div className="social-login">
              <motion.button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="btn btn-google"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="google-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <span>Continue with Google</span>
              </motion.button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              {/* Phone Login */}
              <form onSubmit={showOtpInput ? handleVerifyOTP : handlePhoneLogin} className="phone-login-form">
                {!showOtpInput ? (
                  <>
                    <div className="phone-input-wrapper">
                      <div className="phone-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="phone-input"
                        disabled={isLoading}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary btn-full-width"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? 'Sending OTP...' : 'Continue with Phone'}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="otp-input-wrapper">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="otp-input"
                        maxLength="6"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpInput(false);
                          setOtp('');
                        }}
                        className="change-number-btn"
                      >
                        Change Number
                      </button>
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary btn-full-width"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>
                  </>
                )}
                {/* reCAPTCHA container */}
                <div id="recaptcha-container"></div>
              </form>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
