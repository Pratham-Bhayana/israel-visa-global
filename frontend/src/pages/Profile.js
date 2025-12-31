import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [paymentPendingApplications, setPaymentPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/profile' } });
    } else {
      fetchApplications();
    }
  }, [currentUser, navigate]);

  const fetchApplications = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
            'x-user-uid': currentUser.uid,
          },
        }
      );

      if (response.data.success) {
        const apps = response.data.applications;
        
        // Categorize applications
        const draft = apps.filter(app => app.status === 'draft');
        const pendingPayment = apps.filter(app => app.status === 'pending_payment' && app.paymentStatus === 'pending');
        const submitted = apps.filter(app => !['draft', 'pending_payment'].includes(app.status) || app.paymentStatus !== 'pending');
        
        setPendingApplications(draft);
        setPaymentPendingApplications(pendingPayment);
        setApplications(submitted);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  // Don't render anything if user is not logged in
  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const user = {
    name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
    email: currentUser.email || 'Not provided',
    mobile: currentUser.phoneNumber || 'Not provided',
    joinDate: currentUser.metadata?.creationTime 
      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
  };

  const submittedDocuments = [];


  const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    switch (normalizedStatus) {
      case 'approved':
      case 'visa approved':
      case 'embassy approved':
        return 'status-approved';
      case 'under review':
      case 'processing':
        return 'status-processing';
      case 'documents required':
        return 'status-documents-required';
      case 'documents approved':
        return 'status-documents-approved';
      case 'sent to embassy':
        return 'status-embassy';
      case 'rejected':
      case 'embassy rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const getProgressSteps = () => [
    'Submitted',
    'Under Review',
    'Documents Approved',
    'Sent to Embassy',
    'Visa Approved',
  ];

  const getStepFromStatus = (status) => {
    const statusStepMap = {
      'pending': 1,
      'under_review': 2,
      'documents_required': 2,
      'documents_approved': 3,
      'sent_to_embassy': 4,
      'embassy_approved': 5,
      'embassy_rejected': 4,
      'approved': 5,
      'rejected': 2,
    };
    return statusStepMap[status] || 1;
  };

  const handleTrackApplication = (app) => {
    setSelectedApp(app);
    setShowTracker(true);
  };

  const handleFileChange = (applicationId, event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => ({
      ...prev,
      [applicationId]: files
    }));
  };

  const handleUploadDocuments = async (applicationId) => {
    if (!selectedFiles[applicationId] || selectedFiles[applicationId].length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploadingDocs(true);
    try {
      const token = await currentUser.getIdToken();
      const formData = new FormData();
      
      selectedFiles[applicationId].forEach((file) => {
        formData.append('documents', file);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/applications/${applicationId}/upload-documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.displayName || currentUser.email?.split('@')[0],
            'x-user-uid': currentUser.uid,
          },
        }
      );

      if (response.data.success) {
        toast.success('Documents uploaded successfully!');
        setSelectedFiles(prev => ({ ...prev, [applicationId]: [] }));
        fetchApplications(); // Refresh applications
        setShowTracker(false);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploadingDocs(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Israel Visa Application</title>
        <meta name="description" content="View your profile and visa application status" />
      </Helmet>

      <div className="profile-page">
        <div className="profile-container-new">
          {/* Left Side - User Profile */}
          <motion.div
            className="profile-sidebar"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="profile-card">
              <div className="profile-avatar-large">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="profile-name">{user.name}</h2>
            </div>

            <div className="info-card">
              <h3 className="info-title">Contact Information</h3>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mobile</span>
                <span className="info-value">{user.mobile}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{user.joinDate}</span>
              </div>
            </div>

            {submittedDocuments.length > 0 && (
              <div className="info-card">
                <h3 className="info-title">Submitted Documents</h3>
                <div className="documents-list-sidebar">
                  {submittedDocuments.map((doc, idx) => (
                    <div key={idx} className="document-item">
                      <div className="document-info">
                        <span className="document-name">{doc.name}</span>
                        <span className="document-date">
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="btn-view-doc">View</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Side - Applications */}
          <motion.div
            className="applications-main"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="applications-heading">My Applications</h1>

            {/* Pending Applications */}
            {pendingApplications.length > 0 && (
              <div className="section-block">
                <h2 className="section-title">Pending Submissions</h2>
                {pendingApplications.map((app) => (
                  <div key={app.id} className="pending-app-card">
                    <div className="pending-app-content">
                      <h3>{app.type}</h3>
                      <p>{app.message}</p>
                    </div>
                    <button className="btn-complete">Complete Application</button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Payment Pending Applications */}
            {paymentPendingApplications.length > 0 && (
              <div className="section-block">
                <h2 className="section-title">Payment Pending</h2>
                {paymentPendingApplications.map((app) => (
                  <div key={app._id} className="payment-pending-card">
                    <div className="payment-card-header">
                      <div className="payment-app-info">
                        <h3>{app.visaType?.charAt(0).toUpperCase() + app.visaType?.slice(1)} Visa</h3>
                        <span className="app-id">{app.applicationNumber}</span>
                        <span className="app-date">
                          Saved: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="payment-amount-badge">
                        <span className="amount-label">Amount Due</span>
                        <span className="amount-value">₹{app.paymentAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="payment-message">
                      <span className="message-icon">⚠️</span>
                      <p>Your application has been saved. Please complete the payment to submit your application.</p>
                    </div>
                    <button
                      className="btn-pay-now"
                      onClick={() => navigate(`/payment/${app._id}`)}
                    >
                      💳 Pay Now to Submit Application
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submitted Applications */}
            <div className="section-block">
              <h2 className="section-title">Submitted Applications</h2>
              {applications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                  No submitted applications yet
                </p>
              ) : (
                applications.map((app) => (
                  <motion.div
                    key={app._id}
                    className="app-card"
                    whileHover={{ y: -2 }}
                  >
                    <div className="app-card-header">
                      <div className="app-info">
                        <h3>{app.visaType?.charAt(0).toUpperCase() + app.visaType?.slice(1)} Visa</h3>
                        <span className="app-id">{app.applicationNumber}</span>
                        <span className="app-date">
                          Applied: {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`status-badge ${getStatusColor(app.status)}`}>
                        {app.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>

                    <div className="app-action-buttons">
                      <button
                        className="btn-track"
                        onClick={() => handleTrackApplication(app)}
                      >
                        Track Application
                      </button>
                      
                      {app.status === 'approved' && app.visaUrl && (
                        <a
                          href={app.visaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-download-visa"
                        >
                          📄 Download Your Visa
                        </a>
                      )}
                    </div>

                    {showTracker && selectedApp?._id === app._id && (
                      <div className="tracker-section">
                        <div className="progress-bar-container">
                          {getProgressSteps().map((step, idx) => {
                            const currentStep = getStepFromStatus(app.status);
                            return (
                              <div
                                key={idx}
                                className={`progress-step ${
                                  idx < currentStep ? 'completed' : idx === currentStep - 1 ? 'active' : ''
                                }`}
                              >
                                <div className="step-marker">
                                  {idx < currentStep ? '✓' : idx + 1}
                                </div>
                                <span className="step-label">{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        {app.statusHistory && app.statusHistory.length > 0 && app.statusHistory[app.statusHistory.length - 1].remarks && (
                          <div className="remarks-box">
                            <h4>Latest Update</h4>
                            <p>{app.statusHistory[app.statusHistory.length - 1].remarks}</p>
                            <span className="remark-date">
                              {new Date(app.statusHistory[app.statusHistory.length - 1].changedAt).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {app.status === 'documents_required' && (
                          <div className="document-upload-box">
                            <h4>📎 Upload Required Documents</h4>
                            <p className="upload-instruction">
                              Please upload the documents requested above to continue with your application.
                            </p>
                            <div className="file-upload-area">
                              <input
                                type="file"
                                id={`file-upload-${app._id}`}
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(app._id, e)}
                                style={{ display: 'none' }}
                              />
                              <label htmlFor={`file-upload-${app._id}`} className="file-upload-label">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="17 8 12 3 7 8"/>
                                  <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <span>Choose Files</span>
                                <small>PDF, JPG, PNG (Max 10MB each)</small>
                              </label>
                              
                              {selectedFiles[app._id] && selectedFiles[app._id].length > 0 && (
                                <div className="selected-files-list">
                                  <p className="files-count">{selectedFiles[app._id].length} file(s) selected:</p>
                                  {selectedFiles[app._id].map((file, idx) => (
                                    <div key={idx} className="file-item">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                        <polyline points="13 2 13 9 20 9"/>
                                      </svg>
                                      <span>{file.name}</span>
                                      <span className="file-size">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <button
                              className="btn-upload-documents"
                              onClick={() => handleUploadDocuments(app._id)}
                              disabled={uploadingDocs || !selectedFiles[app._id] || selectedFiles[app._id].length === 0}
                            >
                              {uploadingDocs ? (
                                <>
                                  <div className="spinner-small"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                  </svg>
                                  Submit Documents
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        
                        {app.status === 'approved' && app.visaUrl && (
                          <div className="visa-preview-box">
                            <h4>Visa Document</h4>
                            <p>Your visa is ready for download. Click the button above to download your visa document as PDF.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
