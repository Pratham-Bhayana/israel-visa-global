import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaWifi, FaShieldAlt } from 'react-icons/fa';
import './Payment.css';

// Load Razorpay Script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState(null);
  const [selectedEsim, setSelectedEsim] = useState(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/payment/${applicationId}` } });
      return;
    }
    fetchApplicationDetails();
    loadRazorpayScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, applicationId, navigate]);

  const fetchApplicationDetails = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
            'x-user-uid': currentUser.uid,
          },
        }
      );
      setApplication(response.data.application);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setProcessing(true);

      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please refresh and try again.');
        setProcessing(false);
        return;
      }

      // Calculate total amount
      const esimPrice = selectedEsim ? selectedEsim.price : 0;

      // Create order on backend
      const token = await currentUser.getIdToken();
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        {
          applicationId: applicationId,
          esimPrice: esimPrice,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
            'x-user-uid': currentUser.uid,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { order, keyId, applicantName, applicantEmail } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: keyId,
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: 'Israel Visa Services',
        description: `Visa Application - ${application.applicationNumber || applicationId}`,
        order_id: order.id,
        prefill: {
          name: applicantName || currentUser.displayName || '',
          email: applicantEmail || currentUser.email || '',
          contact: application.phoneNumber || '',
        },
        theme: {
          color: '#0038B8', // Israel flag blue
        },
        handler: async function (response) {
          // Payment successful - verify on backend
          try {
            const verifyResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId: applicationId,
                esim: selectedEsim ? JSON.stringify({
                  selected: true,
                  data: selectedEsim.data,
                  price: selectedEsim.price,
                  validity: selectedEsim.validity,
                  type: selectedEsim.type,
                }) : null,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  'x-user-email': currentUser.email,
                  'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
                  'x-user-uid': currentUser.uid,
                },
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful! Your application is now under review.');
              setTimeout(() => {
                navigate('/profile');
              }, 2000);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast.error('Payment verification failed. Please contact support with your payment ID.');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.warning('Payment cancelled. You can retry anytime.');
            setProcessing(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  // eSIM Plans Data (prices in INR)
  const esimPlans = [
    { data: '1GB', price: 499, validity: '5 DAYS', type: 'limited' },
    { data: '3GB', price: 799, validity: '7 DAYS', type: 'limited' },
    { data: '5GB', price: 1199, validity: '15 DAYS', type: 'limited' },
    { data: '10GB', price: 1899, validity: '30 DAYS', type: 'limited' },
    { data: '15GB', price: 2399, validity: '30 DAYS', type: 'limited' },
    { data: '25GB', price: 3299, validity: '30 DAYS', type: 'limited' },
    { data: 'UNLIMITED', price: 1199, validity: '3 DAYS', type: 'unlimited' },
    { data: 'UNLIMITED', price: 1699, validity: '5 DAYS', type: 'unlimited' },
    { data: 'UNLIMITED', price: 2199, validity: '7 DAYS', type: 'unlimited' },
    { data: 'UNLIMITED', price: 2999, validity: '10 DAYS', type: 'unlimited' },
  ];

  // Show only first 2 plans initially
  const displayedPlans = showAllPlans ? esimPlans : esimPlans.slice(0, 2);

  const handleEsimSelection = (plan) => {
    // Toggle selection - deselect if clicking the same plan
    if (selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity) {
      setSelectedEsim(null);
    } else {
      setSelectedEsim(plan);
    }
  };

  const toggleViewAllPlans = () => {
    setShowAllPlans(!showAllPlans);
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="payment-error">
        <h2>Application not found</h2>
        <button onClick={() => navigate('/profile')} className="btn-back">
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Secure Payment - Israel Visa Application | Complete Your Payment</title>
        <meta name="description" content="Complete your Israel visa application payment securely. Multiple payment options available with instant confirmation and receipt." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/payment/${applicationId}`} />
      </Helmet>

      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-content-centered">

            {/* Single Payment Card */}
            <motion.div
              className="payment-card-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Blue Header */}
              <div className="payment-card-header">
                <div className="header-left">
                  <h2>Order Summary</h2>
                  <p className="application-id-header">Application ID: {application.applicationNumber || applicationId}</p>
                </div>
                <div className="header-right">
                  <div className="amount-badge">
                    <span className="amount-label">Total</span>
                    <span className="amount-value">
                      ₹{((application.paymentAmount || 0) + (selectedEsim ? selectedEsim.price : 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* White Content Area */}
              <div className="payment-card-content">
                
                {/* Visa Details */}
                <div className="visa-details-section">
                  <div className="detail-row-white">
                    <span className="label-white">Visa Type</span>
                    <span className="value-white">
                      {typeof application.visaType === 'object' && application.visaType?.name 
                        ? application.visaType.name 
                        : application.visaType || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-row-white">
                    <span className="label-white">Applicant</span>
                    <span className="value-white">{application.fullName || currentUser.displayName}</span>
                  </div>
                  <div className="detail-row-white">
                    <span className="label-white">Visa Fee</span>
                    <span className="value-white">₹{(application.paymentAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Recommended Add-ons Section */}
                <div className="addons-section">
                  <div className="addons-header">
                    <FaWifi className="addons-icon" />
                    <span>RECOMMENDED ADD-ONS</span>
                  </div>

                  {!showAllPlans && (
                    <button className="view-all-plans-link" onClick={toggleViewAllPlans}>
                      View All Plans →
                    </button>
                  )}

                  {showAllPlans && (
                    <button className="back-to-summary-link" onClick={toggleViewAllPlans}>
                      ← Back to Summary
                    </button>
                  )}

                  {/* Plans Grid */}
                  <div className={`plans-grid ${showAllPlans ? 'expanded' : 'compact'}`}>
                    {displayedPlans.map((plan, index) => (
                      <div
                        key={index}
                        className={`plan-card-horizontal ${selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity ? 'selected' : ''}`}
                        onClick={() => handleEsimSelection(plan)}
                      >
                        <div className="plan-card-radio">
                          <div className={`radio-button ${selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity ? 'checked' : ''}`}>
                            {selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity && (
                              <div className="radio-inner"></div>
                            )}
                          </div>
                        </div>
                        <div className="plan-card-info">
                          <h4>{plan.data} {plan.type === 'unlimited' ? '' : 'Data'}</h4>
                          <p className="plan-description">
                            {plan.type === 'unlimited' ? 'Maximum freedom for travel' : 'Stay connected with 5G/4G LTE'}
                          </p>
                          <p className="plan-validity-text">{plan.validity}</p>
                        </div>
                        <div className="plan-card-price">
                          <span className="price-amount">₹{plan.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Amount Section */}
                <div className="total-amount-section">
                  <div className="total-amount-content">
                    <div>
                      <p className="total-label">Total Amount</p>
                      <p className="total-sublabel">Including all taxes & add-ons</p>
                    </div>
                    <div className="total-price">
                      ₹{((application.paymentAmount || 0) + (selectedEsim ? selectedEsim.price : 0)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  className="btn-pay-now"
                  onClick={handleRazorpayPayment}
                  disabled={processing || !application}
                >
                  {processing ? 'Processing...' : 'Pay Now'}
                </button>

                {/* Cancel Link */}
                <button
                  className="btn-cancel-payment"
                  onClick={() => navigate('/profile')}
                  disabled={processing}
                >
                  Cancel Payment
                </button>

                {/* Security Notice */}
                <div className="security-notice-footer">
                  <FaShieldAlt className="shield-icon-footer" />
                  <span>Secured with 256-bit SSL encryption by Razorpay</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile-Only Footer */}
        <div className="mobile-payment-footer">
          <button
            className="mobile-cancel-btn"
            onClick={() => navigate('/profile')}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            className="mobile-pay-btn"
            onClick={handleRazorpayPayment}
            disabled={processing || !application}
          >
            {processing ? 'Processing...' : `Pay ₹${((application.paymentAmount || 0) + (selectedEsim ? selectedEsim.price : 0)).toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
