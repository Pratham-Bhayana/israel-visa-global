import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Esims.css';

const Esims = () => {
  const [esims, setEsims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedEsim, setSelectedEsim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchEsims();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, typeFilter, page]);

  const fetchEsims = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/esims`,
        {
          params: {
            status: filter !== 'all' ? filter : undefined,
            type: typeFilter !== 'all' ? typeFilter : undefined,
            page,
            limit: 20,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEsims(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching eSIMs:', error);
      toast.error('Failed to fetch eSIM orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/esims/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateEsim = async (applicationId) => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/esims/${applicationId}`,
        {
          status,
          activationCode: activationCode || undefined,
          qrCode: qrCode || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('eSIM status updated successfully');
      setShowModal(false);
      setActivationCode('');
      setQrCode('');
      fetchEsims();
      fetchStats();
    } catch (error) {
      console.error('Error updating eSIM:', error);
      toast.error(error.response?.data?.message || 'Failed to update eSIM');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: '#fbbf24',
      processing: '#3b82f6',
      activated: '#10b981',
      delivered: '#6366f1',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      processing: 'badge-info',
      activated: 'badge-success',
      delivered: 'badge-primary',
      cancelled: 'badge-danger',
    };
    return classes[status] || 'badge-default';
  };

  if (loading) {
    return (
      <div className="esims-loading">
        <div className="spinner"></div>
        <p>Loading eSIM orders...</p>
      </div>
    );
  }

  return (
    <div className="esims-container">
      <motion.div
        className="esims-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>📱 eSIM Management</h1>
        <p>Manage Israel eSIM orders from visa applicants</p>
      </motion.div>

      {/* Statistics Cards */}
      {stats && (
        <div className="esims-stats">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
            <div className="stat-icon">📦</div>
          </motion.div>

          {stats.byStatus.map((item) => (
            <motion.div
              key={item._id}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="stat-content">
                <h3>{item._id}</h3>
                <p className="stat-number">{item.count}</p>
                <p className="stat-revenue">₹{item.totalRevenue?.toLocaleString('en-IN') || 0}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="esims-filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="activated">Activated</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Plan Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Types</option>
            <option value="limited">Limited Data</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
      </div>

      {/* eSIM Orders Table */}
      <motion.div
        className="esims-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <table className="esims-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {esims.length > 0 ? (
              esims.map((esim) => (
                <tr key={esim._id}>
                  <td className="application-id">{esim.applicationNumber}</td>
                  <td>{esim.fullName}</td>
                  <td>{esim.phoneNumber}</td>
                  <td>
                    <div className="plan-info">
                      <strong>{esim.esim.data}</strong>
                      <small>{esim.esim.validity}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${esim.esim.type === 'unlimited' ? 'badge-success' : 'badge-info'}`}>
                      {esim.esim.type}
                    </span>
                  </td>
                  <td>₹{esim.esim.price.toLocaleString('en-IN')}</td>
                  <td>
                    <span
                      className={`badge ${getStatusBadgeClass(esim.esim.status)}`}
                      style={{ backgroundColor: getStatusBadgeColor(esim.esim.status) }}
                    >
                      {esim.esim.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${esim.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {esim.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => {
                        setSelectedEsim(esim);
                        setStatus(esim.esim.status);
                        setActivationCode(esim.esim.activationCode || '');
                        setQrCode(esim.esim.qrCode || '');
                        setShowModal(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No eSIM orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Update Modal */}
      {showModal && selectedEsim && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Update eSIM Order</h2>
            <div className="modal-info">
              <p>
                <strong>Application:</strong> {selectedEsim.applicationNumber}
              </p>
              <p>
                <strong>Applicant:</strong> {selectedEsim.fullName}
              </p>
              <p>
                <strong>Plan:</strong> {selectedEsim.esim.data} - {selectedEsim.esim.validity}
              </p>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="activated">Activated</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Activation Code</label>
              <input
                type="text"
                placeholder="Enter activation code (if applicable)"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>QR Code URL</label>
              <input
                type="text"
                placeholder="Enter QR code URL (if applicable)"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={() => handleUpdateEsim(selectedEsim._id)}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update eSIM'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Esims;
