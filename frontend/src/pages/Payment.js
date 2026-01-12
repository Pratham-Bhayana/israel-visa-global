import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Payment.css';

const Payment = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentProof, setPaymentProof] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [selectedEsim, setSelectedEsim] = useState(null);
  const [showEsimDetails, setShowEsimDetails] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/payment/${applicationId}` } });
      return;
    }
    fetchApplicationDetails();
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    setPaymentProof(file);
    toast.success('Payment proof uploaded successfully');
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setProcessing(true);

    try {
      // First, upload payment proof to backend which uploads to Cloudinary
      let paymentProofUrl = null;
      if (paymentProof) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', paymentProof);

        try {
          const uploadResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/upload?folder=israel-visa/payments`,
            uploadFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
          if (uploadResponse.data.success) {
            paymentProofUrl = uploadResponse.data.data.url;
          } else {
            throw new Error(uploadResponse.data.message || 'Upload failed');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Failed to upload payment proof. Please try again.');
          setProcessing(false);
          return;
        }
      }

      // Then, submit payment to backend with the uploaded file URL
      const token = await currentUser.getIdToken();
      const paymentData = {
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        paymentProof: paymentProofUrl,
      };
      
      // Include eSIM data if selected
      if (selectedEsim) {
        paymentData.esim = JSON.stringify({
          selected: true,
          data: selectedEsim.data,
          price: selectedEsim.price,
          validity: selectedEsim.validity,
          type: selectedEsim.type,
        });
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/applications/${applicationId}/payment`,
        paymentData,
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

      if (response.data.success) {
        toast.success('Payment submitted successfully! Your application is now under review.');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment submission failed');
    } finally {
      setProcessing(false);
    }
  };

  // eSIM Plans Data (prices in INR)
  const esimPlans = {
    limited: [
      { data: '1GB', price: 425, validity: '5 DAYS', type: 'limited' },
      { data: '3GB', price: 680, validity: '7 DAYS', type: 'limited' },
      { data: '5GB', price: 1020, validity: '15 DAYS', type: 'limited' },
      { data: '10GB', price: 1700, validity: '30 DAYS', type: 'limited' },
      { data: '15GB', price: 2125, validity: '30 DAYS', type: 'limited' },
      { data: '25GB', price: 2975, validity: '30 DAYS', type: 'limited' },
    ],
    unlimited: [
      { data: 'UNLIMITED', price: 1020, validity: '3 DAYS', type: 'unlimited' },
      { data: 'UNLIMITED', price: 1530, validity: '5 DAYS', type: 'unlimited' },
      { data: 'UNLIMITED', price: 1955, validity: '7 DAYS', type: 'unlimited' },
      { data: 'UNLIMITED', price: 2720, validity: '10 DAYS', type: 'unlimited' },
    ]
  };

  const handleEsimSelection = (plan) => {
    setSelectedEsim(plan);
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
          <motion.div
            className="payment-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Complete Your Payment</h1>
            <p>Application ID: {application.applicationNumber || applicationId}</p>
          </motion.div>

          <div className="payment-content">
            {/* Left Sidebar */}
            <div className="payment-left-sidebar">
              {/* eSIM Highlight Card */}
              <motion.div
                className="esim-highlight-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="esim-card-header">
                  <span className="sim-icon">📶</span>
                  <h3>Add Israel eSIM</h3>
                </div>
                <p className="esim-tagline">Stay Connected with 5G/4G LTE</p>
                
                <div className="esim-quick-plans">
                  <div className="quick-plan" onClick={() => handleEsimSelection(esimPlans.limited[0])}>
                    <span className="plan-name">{esimPlans.limited[0].data}</span>
                    <span className="plan-price">₹{esimPlans.limited[0].price}</span>
                    <span className="plan-validity">{esimPlans.limited[0].validity}</span>
                  </div>
                  <div className="quick-plan" onClick={() => handleEsimSelection(esimPlans.unlimited[0])}>
                    <span className="plan-name">{esimPlans.unlimited[0].data}</span>
                    <span className="plan-price">₹{esimPlans.unlimited[0].price}</span>
                    <span className="plan-validity">{esimPlans.unlimited[0].validity}</span>
                  </div>
                </div>
                
                <button 
                  className="view-all-plans-btn"
                  onClick={() => setShowEsimDetails(!showEsimDetails)}
                >
                  {showEsimDetails ? '← Back' : 'View All Plans →'}
                </button>

                {selectedEsim && (
                  <div className="selected-plan-badge">
                    <span>✓ {selectedEsim.data} - ₹{selectedEsim.price}</span>
                    <button onClick={() => setSelectedEsim(null)}>×</button>
                  </div>
                )}
              </motion.div>

              {/* Application Summary */}
              <motion.div
                className="application-summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2>Application Summary</h2>
              <div className="summary-item">
                <span className="label">Visa Type:</span>
                <span className="value">{application.visaType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Applicant Name:</span>
                <span className="value">{application.fullName || currentUser.displayName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Application Fee:</span>
                <span className="value amount">₹{application.paymentAmount?.toLocaleString('en-IN') || '0'}</span>
              </div>
              {selectedEsim && (
                <div className="summary-item">
                  <span className="label">eSIM ({selectedEsim.data} - {selectedEsim.validity}):</span>
                  <span className="value amount">₹{selectedEsim.price.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span className="label">Total Amount:</span>
                <span className="value amount">
                  ₹{((application.paymentAmount || 0) + (selectedEsim ? selectedEsim.price : 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </motion.div>
            </div>

            {/* Right Content Area */}
            <div className="payment-right-content">
              {showEsimDetails && (
                <motion.div
                  className="esim-section esim-full-plans"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <div className="esim-header">
                    <div className="esim-title-wrapper">
                      <span className="esim-icon">📶</span>
                      <h2>All Israel eSIM Plans</h2>
                    </div>
                    <p className="esim-subtitle">Choose the perfect plan for your stay</p>
                  </div>

                  {/* Limited Data Plans */}
                  <div className="esim-plans-group">
                    <h3>Limited Data Plans</h3>
                    <div className="esim-plans-grid">
                      {esimPlans.limited.map((plan, index) => (
                        <div
                          key={index}
                          className={`esim-plan-card ${selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity ? 'selected' : ''}`}
                          onClick={() => handleEsimSelection(plan)}
                        >
                          <div className="plan-badge">Limited</div>
                          <div className="plan-data">{plan.data}</div>
                          <div className="plan-validity">{plan.validity}</div>
                          <div className="plan-price">₹{plan.price.toLocaleString('en-IN')}</div>
                          {selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity && (
                            <div className="plan-selected-icon">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unlimited Data Plans */}
                  <div className="esim-plans-group">
                    <h3>Unlimited Data Plans</h3>
                    <p className="unlimited-note">2.5GB high-speed daily, renews at midnight</p>
                    <div className="esim-plans-grid">
                      {esimPlans.unlimited.map((plan, index) => (
                        <div
                          key={index}
                          className={`esim-plan-card unlimited ${selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity ? 'selected' : ''}`}
                          onClick={() => handleEsimSelection(plan)}
                        >
                          <div className="plan-badge unlimited-badge">Unlimited</div>
                          <div className="plan-data">{plan.data}</div>
                          <div className="plan-validity">{plan.validity}</div>
                          <div className="plan-price">₹{plan.price.toLocaleString('en-IN')}</div>
                          {selectedEsim?.data === plan.data && selectedEsim?.validity === plan.validity && (
                            <div className="plan-selected-icon">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="esim-details-content">
                    <div className="detail-box">
                      <h4>Limited Data Plans Explained:</h4>
                      <p>
                        Limited internet is a set data plan you get for usage. For example: a 30GB plan with 30 days validity from the day you activate it in Israel. While keeping the eSIM connection active, it will slowly deduct from your 30GB balance depending on your usage.
                      </p>
                      <p>
                        Our eSIM connects you locally on an Israeli network, so you're charged as a local user, making our plans cost-friendly and allowing us to provide more data benefits at minimum costs.
                      </p>
                      <p className="note">
                        <strong>Note:</strong> These plans will not renew daily unlike unlimited plans - your data balance carries over until you use it all or the validity expires.
                      </p>
                    </div>

                    <div className="detail-box">
                      <h4>Unlimited Plans Explained:</h4>
                      <p>
                        This plan renews every day post-midnight, and a new plan is activated the next day for usage - just like a normal SIM card plan we use every day!
                      </p>
                      <p>
                        You get <strong>Unlimited data at 2.5GB high speed</strong>, unthrottled 5G (where available) or 4G LTE advanced network per 24 hours. If you finish the high-speed daily allowance, the speed will reduce to 512kbps but internet will not stop.
                      </p>
                      <p className="note">
                        <strong>Remember:</strong> Post midnight, your internet will be back at full high speed! This will continue to work every day for as long as you're in Israel.
                      </p>
                    </div>

                    <div className="detail-box benefits">
                      <h4>eSIM Benefits:</h4>
                      <ul>
                        <li>✓ No physical SIM card needed - instant activation</li>
                        <li>✓ Keep your primary SIM active for calls</li>
                        <li>✓ Local Israeli network rates</li>
                        <li>✓ 5G/4G LTE high-speed connectivity</li>
                        <li>✓ No roaming charges</li>
                        <li>✓ Works immediately upon arrival in Israel</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

            {/* Payment Methods */}
            <motion.div
              className="payment-methods"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>Payment Details</h2>
              
              <div className="payment-method-selector">
                <h3>Select Payment Method</h3>
                <div className="method-options">
                  <label className={`method-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="method-icon"></span>
                    <span className="method-name">UPI</span>
                  </label>
                  
                  <label className={`method-option ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="method-icon"></span>
                    <span className="method-name">Bank Transfer</span>
                  </label>
                  
                  <label className={`method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="method-icon"></span>
                    <span className="method-name">Card</span>
                  </label>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="payment-instructions">
                <h3>Payment Instructions</h3>
                {paymentMethod === 'upi' && (
                  <div className="instruction-box">
                    <p><strong>UPI ID:</strong> israelvisa@upi</p>
                    <p>1. Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
                    <p>2. Send ₹{application.paymentAmount?.toLocaleString('en-IN')} to the above UPI ID</p>
                    <p>3. Save the transaction ID/screenshot</p>
                    <p>4. Upload the payment proof below</p>
                  </div>
                )}
                {paymentMethod === 'bank_transfer' && (
                  <div className="instruction-box">
                    <p><strong>Bank Details:</strong></p>
                    <p>Account Name: Israel Visa Services</p>
                    <p>Account Number: 1234567890</p>
                    <p>IFSC Code: SBIN0001234</p>
                    <p>Bank: State Bank of India</p>
                    <br />
                    <p>Transfer ₹{application.paymentAmount?.toLocaleString('en-IN')} and upload the receipt below</p>
                  </div>
                )}
                {paymentMethod === 'card' && (
                  <div className="instruction-box">
                    <p>Please contact our office for card payment details:</p>
                    <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                    <p><strong>Email:</strong> payment@israelvisa.com</p>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="payment-form">
                <div className="form-group">
                  <label htmlFor="transactionId">Transaction ID / Reference Number *</label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="paymentProof">Upload Payment Proof (JPG, PNG, or PDF) *</label>
                  <div className="file-upload-box">
                    <input
                      type="file"
                      id="paymentProof"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      required
                    />
                    <div className="file-upload-label">
                      {paymentProof ? (
                        <span className="file-selected">✓ {paymentProof.name}</span>
                      ) : (
                        <>
                          <span className="upload-icon">+</span>
                          <span>Click to upload or drag and drop</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="payment-actions">
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="btn-cancel"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-payment"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Submit Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
