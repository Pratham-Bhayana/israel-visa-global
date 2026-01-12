import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import './ApplicationDetails.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    status: '', 
    message: '', 
    requireInput: false,
    inputLabel: '',
    inputPlaceholder: ''
  });

  useEffect(() => {
    fetchApplicationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const response = await fetch(`${API_URL}/api/admin/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });
      const data = await response.json();

      if (data.success) {
        setApplication(data.application);
      } else {
        toast.error('Application not found');
        navigate('/admin/applications');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const openStatusConfirmModal = (newStatus) => {
    const statusLabels = {
      pending: 'Pending',
      under_review: 'Under Review',
      documents_required: 'Documents Required',
      documents_approved: 'Documents Approved',
      sent_to_embassy: 'Sent to Embassy',
      embassy_approved: 'Embassy Approved',
      embassy_rejected: 'Embassy Rejected',
      approved: 'Approved',
      rejected: 'Rejected',
    };

    // Determine if input is required for this status
    const requiresInput = ['documents_required', 'embassy_rejected', 'rejected'].includes(newStatus);
    
    let inputLabel = 'Remarks';
    let inputPlaceholder = 'Enter remarks...';
    
    if (newStatus === 'documents_required') {
      inputLabel = 'Required Documents';
      inputPlaceholder = 'Please specify which documents are required...';
    } else if (newStatus === 'embassy_rejected' || newStatus === 'rejected') {
      inputLabel = 'Rejection Reason';
      inputPlaceholder = 'Please provide reason for rejection...';
    }

    setConfirmModal({
      isOpen: true,
      status: newStatus,
      message: `Are you sure you want to change status to ${statusLabels[newStatus] || newStatus}?`,
      requireInput: requiresInput,
      inputLabel,
      inputPlaceholder,
    });
  };

  const handleStatusUpdate = async (remarks = '') => {
    const newStatus = confirmModal.status;
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const response = await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
        body: JSON.stringify({ status: newStatus, remarks }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        fetchApplicationDetails();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const response = await fetch(`${API_URL}/api/admin/applications/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
        body: JSON.stringify({ note: newNote }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Note added successfully');
        setNewNote('');
        fetchApplicationDetails();
      } else {
        toast.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      under_review: '#0038B8',
      documents_required: '#8B5CF6',
      documents_approved: '#10B981',
      sent_to_embassy: '#0EA5E9',
      embassy_approved: '#22C55E',
      embassy_rejected: '#EF4444',
      approved: '#10B981',
      rejected: '#EF4444',
    };
    return colors[status] || '#64748B';
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="application-details">
      {/* Header */}
      <motion.div
        className="details-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-btn" onClick={() => navigate('/admin/applications')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Applications
        </button>

        <div className="header-main">
          <div className="header-left">
            <div className="applicant-avatar-large">
              {application.fullName?.[0]?.toUpperCase() || application.userId?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1>{application.fullName || application.userId?.displayName || 'No Name'}</h1>
              <p className="application-number">{application.applicationNumber}</p>
            </div>
          </div>

          <div className="header-right">
            <span
              className="status-badge-large"
              style={{
                background: `${getStatusColor(application.status)}15`,
                color: getStatusColor(application.status),
              }}
            >
              {getStatusLabel(application.status)}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="details-grid">
        {/* Main Content */}
        <div className="details-main">
          {/* Personal Information */}
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Personal Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{application.fullName || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{application.userId?.email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{application.phoneNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">{application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nationality</span>
                <span className="info-value">{application.nationality || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{application.gender ? application.gender.charAt(0).toUpperCase() + application.gender.slice(1) : 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Passport Information */}
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M7 18v-1a5 5 0 0 1 10 0v1"/>
              </svg>
              Passport Details
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Passport Number</span>
                <span className="info-value">{application.passportNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Issue Date</span>
                <span className="info-value">{application.passportIssueDate ? new Date(application.passportIssueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expiry Date</span>
                <span className="info-value">{application.passportExpiryDate ? new Date(application.passportExpiryDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Place of Issue</span>
                <span className="info-value">{application.placeOfBirth || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Travel Information */}
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Travel Details
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Visa Type</span>
                <span className="info-value">
                  {application.visaType?.name || (application.visaType?.charAt(0).toUpperCase() + application.visaType?.slice(1)) || 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Arrival Date</span>
                <span className="info-value">{application.travelStartDate ? new Date(application.travelStartDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Departure Date</span>
                <span className="info-value">{application.travelEndDate || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Purpose</span>
                <span className="info-value">{application.travelPurpose || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Port of Entry</span>
                <span className="info-value">{application.placesToVisit?.join(', ') || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Accommodation</span>
                <span className="info-value">{application.homeAddress || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              Uploaded Documents
            </h2>
            <div className="documents-grid">
              {application.documents && Object.keys(application.documents).length > 0 ? (
                Object.entries(application.documents).map(([key, url]) => (
                  url && (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-card"
                    >
                      <div className="document-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <span>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </a>
                  )
                ))
              ) : (
                <p className="no-documents">No documents uploaded</p>
              )}
            </div>
          </motion.div>

          {/* Additional Documents */}
          {application.additionalDocuments && application.additionalDocuments.length > 0 && (
            <motion.div
              className="info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Additional Documents (User Uploaded)
              </h2>
              <div className="additional-docs-list">
                {application.additionalDocuments && application.additionalDocuments.length > 0 ? (
                  application.additionalDocuments.map((doc, index) => {
                    // Debug: Log document structure
                    console.log('Document:', JSON.stringify(doc, null, 2));
                    
                    // Determine the correct URL for the document
                    let documentUrl;
                    
                    if (!doc.path && !doc.filename) {
                      console.error('Document has no path or filename:', doc);
                      documentUrl = '#';
                    } else if (doc.path && (doc.path.startsWith('http://') || doc.path.startsWith('https://'))) {
                      // It's already a full URL (Cloudinary)
                      documentUrl = doc.path;
                      console.log('Using Cloudinary URL:', documentUrl);
                    } else if (doc.path && doc.path.startsWith('/uploads')) {
                      // It's a relative path to backend uploads folder
                      documentUrl = `${API_URL}${doc.path}`;
                      console.log('Using backend relative path:', documentUrl);
                    } else {
                      // It's just a filename or invalid path, construct backend URL
                      const filename = doc.path || doc.filename;
                      documentUrl = `${API_URL}/uploads/additional-documents/${filename}`;
                      console.log('Constructed backend URL:', documentUrl);
                    }
                    
                    return (
                      <div key={index} className="additional-doc-item">
                        <div className="doc-info">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                          </svg>
                          <div>
                            <span className="doc-name">{doc.originalName || doc.filename || 'Document'}</span>
                            <span className="doc-meta">
                              {doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB • ` : ''}
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-view-doc"
                          onClick={(e) => {
                            if (documentUrl === '#') {
                              e.preventDefault();
                              alert('Document URL not available. Please check console for details.');
                            }
                          }}
                        >
                          View
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-documents">No additional documents uploaded</p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
          {/* Status Actions */}
          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="sidebar-title">Update Status</h3>
            <div className="status-actions">
              <button
                className="status-btn pending"
                onClick={() => openStatusConfirmModal('pending')}
                disabled={updating || application.status === 'pending'}
              >
                Pending
              </button>
              <button
                className="status-btn under-review"
                onClick={() => openStatusConfirmModal('under_review')}
                disabled={updating || application.status === 'under_review'}
              >
                Under Review
              </button>
              <button
                className="status-btn documents-required"
                onClick={() => openStatusConfirmModal('documents_required')}
                disabled={updating || application.status === 'documents_required'}
              >
                Documents Required
              </button>
              <button
                className="status-btn documents-approved"
                onClick={() => openStatusConfirmModal('documents_approved')}
                disabled={updating || application.status === 'documents_approved'}
              >
                Documents Approved
              </button>
              <button
                className="status-btn sent-to-embassy"
                onClick={() => openStatusConfirmModal('sent_to_embassy')}
                disabled={updating || application.status === 'sent_to_embassy'}
              >
                Sent to Embassy
              </button>
              <button
                className="status-btn embassy-approved"
                onClick={() => openStatusConfirmModal('embassy_approved')}
                disabled={updating || application.status === 'embassy_approved'}
              >
                Embassy Approved
              </button>
              <button
                className="status-btn embassy-rejected"
                onClick={() => openStatusConfirmModal('embassy_rejected')}
                disabled={updating || application.status === 'embassy_rejected'}
              >
                Embassy Rejected
              </button>
              <button
                className="status-btn approved"
                onClick={() => openStatusConfirmModal('approved')}
                disabled={updating || application.status === 'approved'}
              >
                Approved
              </button>
              <button
                className="status-btn rejected"
                onClick={() => openStatusConfirmModal('rejected')}
                disabled={updating || application.status === 'rejected'}
              >
                Rejected
              </button>
            </div>
          </motion.div>

          {/* Payment & eSIM Information */}
          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h3 className="sidebar-title">💳 Payment & eSIM</h3>
            
            {/* Payment Status */}
            <div className="payment-info">
              <div className="info-item">
                <label>Payment Status</label>
                <span className={`badge badge-${application.paymentStatus}`}>
                  {application.paymentStatus || 'Pending'}
                </span>
              </div>
              
              <div className="info-item">
                <label>Amount</label>
                <span className="amount">₹{application.paymentAmount?.toLocaleString('en-IN') || 0}</span>
              </div>
              
              {application.paymentDate && (
                <div className="info-item">
                  <label>Payment Date</label>
                  <span>{new Date(application.paymentDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {application.paymentTransactionId && (
                <div className="info-item">
                  <label>Transaction ID</label>
                  <span className="transaction-id">{application.paymentTransactionId}</span>
                </div>
              )}
              
              {application.paymentReceipt && (
                <div className="info-item">
                  <label>Receipt</label>
                  <a 
                    href={application.paymentReceipt} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-view-receipt"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>

            {/* eSIM Information */}
            {application.esim && application.esim.selected && (
              <div className="esim-info">
                <h4>📱 eSIM Details</h4>
                <div className="info-item">
                  <label>Plan</label>
                  <span>{application.esim.data}</span>
                </div>
                
                <div className="info-item">
                  <label>Validity</label>
                  <span>{application.esim.validity}</span>
                </div>
                
                <div className="info-item">
                  <label>Type</label>
                  <span className={`badge badge-${application.esim.type}`}>
                    {application.esim.type}
                  </span>
                </div>
                
                <div className="info-item">
                  <label>Price</label>
                  <span>₹{application.esim.price?.toLocaleString('en-IN') || 0}</span>
                </div>
                
                <div className="info-item">
                  <label>Status</label>
                  <span className={`badge badge-${application.esim.status}`}>
                    {application.esim.status}
                  </span>
                </div>
                
                {application.esim.activationCode && (
                  <div className="info-item">
                    <label>Activation Code</label>
                    <span className="code">{application.esim.activationCode}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Admin Notes */}
          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="sidebar-title">Admin Notes</h3>
            <div className="notes-section">
              <div className="add-note">
                <textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows="3"
                />
                <button className="add-note-btn" onClick={handleAddNote}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Note
                </button>
              </div>

              <div className="notes-list">
                {application.adminNotes && application.adminNotes.length > 0 ? (
                  application.adminNotes.map((note, index) => (
                    <div key={index} className="note-item">
                      <p>{note.note}</p>
                      <span className="note-date">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-notes">No notes yet</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Status History */}
          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="sidebar-title">Status History</h3>
            <div className="history-timeline">
              {application.statusHistory && application.statusHistory.length > 0 ? (
                application.statusHistory.map((history, index) => (
                  <div key={index} className="history-item">
                    <div
                      className="history-dot"
                      style={{ background: getStatusColor(history.status) }}
                    />
                    <div className="history-content">
                      <span className="history-status">{getStatusLabel(history.status)}</span>
                      <span className="history-date">
                        {new Date(history.changedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-history">No history available</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, status: '', message: '', requireInput: false, inputLabel: '', inputPlaceholder: '' })}
        onConfirm={handleStatusUpdate}
        title="Confirm Status Change"
        message={confirmModal.message}
        type="warning"
        confirmText="OK"
        cancelText="Cancel"
        requireInput={confirmModal.requireInput}
        inputLabel={confirmModal.inputLabel}
        inputPlaceholder={confirmModal.inputPlaceholder}
      />
    </div>
  );
};

export default ApplicationDetails;
