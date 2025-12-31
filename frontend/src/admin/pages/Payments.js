import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState('approve'); // approve or reject

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [filter, page]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/payments`,
        {
          params: {
            status: filter,
            page,
            limit: 20,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayments(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/payments/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const handlePaymentAction = async () => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        status: action === 'approve' ? 'completed' : 'failed',
      };

      if (action === 'reject') {
        payload.rejectionReason = rejectionReason;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/payments/${selectedPayment._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        action === 'approve'
          ? 'Payment approved successfully'
          : 'Payment rejected successfully'
      );
      setShowModal(false);
      setRejectionReason('');
      setAction('approve');
      fetchPayments();
      fetchStats();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    }) || '₹0';
  };

  if (loading) {
    return (
      <div className="payments-loading">
        <div className="spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <motion.div
        className="payments-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>💳 Payment Management</h1>
        <p>Review and approve visa application payments</p>
      </motion.div>

      {/* Statistics Cards */}
      {stats && (
        <div className="payments-stats">
          <motion.div
            className="stat-card total"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-amount">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="stat-icon">💰</div>
          </motion.div>

          <motion.div
            className="stat-card pending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="stat-content">
              <h3>Pending Approval</h3>
              <p className="stat-number">{stats.pendingCount}</p>
              <p className="stat-amount">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="stat-icon">⏳</div>
          </motion.div>

          <motion.div
            className="stat-card completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="stat-content">
              <h3>Collected</h3>
              <p className="stat-number">{stats.completedCount}</p>
              <p className="stat-amount">{formatCurrency(stats.completedAmount)}</p>
            </div>
            <div className="stat-icon">✅</div>
          </motion.div>

          <motion.div
            className="stat-card failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="stat-content">
              <h3>Rejected</h3>
              <p className="stat-number">{stats.failedCount}</p>
              <p className="stat-amount">{formatCurrency(stats.failedAmount)}</p>
            </div>
            <div className="stat-icon">❌</div>
          </motion.div>
        </div>
      )}

      {/* Filter */}
      <div className="payments-filter">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="processing">Pending Approval</option>
          <option value="completed">Collected</option>
          <option value="failed">Rejected</option>
          <option value="all">All Payments</option>
        </select>
      </div>

      {/* Payments Table */}
      <motion.div
        className="payments-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <table className="payments-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Phone</th>
              <th>Visa Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="application-id">{payment.applicationNumber}</td>
                  <td>{payment.fullName}</td>
                  <td>{payment.phoneNumber}</td>
                  <td>{payment.visaType}</td>
                  <td className="amount">{formatCurrency(payment.paymentAmount)}</td>
                  <td>
                    <span
                      className={`badge badge-${payment.paymentStatus}`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>
                    {payment.paymentStatus === 'processing' && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setAction('approve');
                            setShowModal(true);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setAction('reject');
                            setShowModal(true);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {payment.paymentStatus !== 'processing' && (
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No {filter === 'all' ? 'payments' : filter} payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Details Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Payment Details</h2>
            <div className="modal-info">
              <div className="info-row">
                <label>Application ID:</label>
                <span>{selectedPayment.applicationNumber}</span>
              </div>
              <div className="info-row">
                <label>Applicant Name:</label>
                <span>{selectedPayment.fullName}</span>
              </div>
              <div className="info-row">
                <label>Phone:</label>
                <span>{selectedPayment.phoneNumber}</span>
              </div>
              <div className="info-row">
                <label>Visa Type:</label>
                <span>{selectedPayment.visaType}</span>
              </div>
              <div className="info-row">
                <label>Amount:</label>
                <span className="amount-highlight">
                  {formatCurrency(selectedPayment.paymentAmount)}
                </span>
              </div>
              <div className="info-row">
                <label>Payment Method:</label>
                <span>{selectedPayment.paymentMethod || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Transaction ID:</label>
                <span className="transaction-id">
                  {selectedPayment.paymentTransactionId || 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <label>Status:</label>
                <span className={`badge badge-${selectedPayment.paymentStatus}`}>
                  {selectedPayment.paymentStatus}
                </span>
              </div>
              {selectedPayment.paymentProof && (
                <div className="info-row">
                  <label>Payment Proof:</label>
                  <a
                    href={selectedPayment.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-view-proof"
                  >
                    View Proof
                  </a>
                </div>
              )}
            </div>

            {/* Action Section */}
            {selectedPayment.paymentStatus === 'processing' && (
              <div className="action-section">
                {action === 'reject' && (
                  <div className="form-group">
                    <label>Rejection Reason</label>
                    <textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="4"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setShowModal(false);
                      setRejectionReason('');
                      setAction('approve');
                    }}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn-action btn-${action}`}
                    onClick={handlePaymentAction}
                    disabled={updating}
                  >
                    {updating
                      ? 'Processing...'
                      : action === 'approve'
                      ? '✓ Approve Payment'
                      : '✗ Reject Payment'}
                  </button>
                </div>
              </div>
            )}

            {selectedPayment.paymentStatus !== 'processing' && (
              <div className="modal-actions">
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Payments;
