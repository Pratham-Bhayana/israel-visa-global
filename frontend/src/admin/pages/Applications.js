import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    visaType: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [filters, pagination.currentPage]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.visaType && { visaType: filters.visaType }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`http://localhost:5000/api/admin/applications?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications || []);
        setPagination({
          currentPage: data.pagination?.page || 1,
          totalPages: data.pagination?.pages || 1,
          totalApplications: data.pagination?.total || 0,
        });
      } else {
        toast.error(data.message || 'Failed to load applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value });
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

  const visaTypes = ['tourist', 'business', 'student', 'work', 'medical', 'transit'];
  const statuses = ['pending', 'under_review', 'documents_required', 'documents_approved', 'sent_to_embassy', 'embassy_approved', 'embassy_rejected', 'approved', 'rejected'];

  if (loading) {
    return (
      <div className="applications-loading">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-page">
      {/* Header */}
      <div className="applications-header">
        <div className="header-content">
          <h1>Visa Applications</h1>
          <p>Manage and review all visa applications</p>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="filter-group">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or application number..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{getStatusLabel(status)}</option>
            ))}
          </select>

          <select
            value={filters.visaType}
            onChange={(e) => handleFilterChange('visaType', e.target.value)}
            className="filter-select"
          >
            <option value="">All Visa Types</option>
            {visaTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {(filters.status || filters.visaType || filters.search) && (
            <button
              className="clear-filters-btn"
              onClick={() => setFilters({ status: '', visaType: '', search: '' })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>

        <div className="results-info">
          <p>{pagination.totalApplications} applications found</p>
        </div>
      </motion.div>

      {/* Applications Table */}
      <motion.div
        className="applications-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {applications.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>No applications found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Application No.</th>
                  <th>Visa Type</th>
                  <th>Payment Status</th>
                  <th>Application Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="applicant-cell">
                        <div className="applicant-avatar">
                          {app.fullName?.[0]?.toUpperCase() || app.userId?.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="applicant-info">
                          <span className="applicant-name">
                            {app.fullName || app.userId?.displayName || 'No Name'}
                          </span>
                          <span className="applicant-email">
                            {app.userId?.email || 'No Email'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="application-number">{app.applicationNumber}</span>
                    </td>
                    <td>
                      <span className="visa-type-badge">
                        {app.visaType?.charAt(0).toUpperCase() + app.visaType?.slice(1) || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="payment-status-badge"
                        style={{
                          background: app.paymentStatus === 'completed' ? '#10B98115' :
                                     app.paymentStatus === 'processing' ? '#F59E0B15' :
                                     app.paymentStatus === 'pending' ? '#EF444415' : '#64748B15',
                          color: app.paymentStatus === 'completed' ? '#10B981' :
                                app.paymentStatus === 'processing' ? '#F59E0B' :
                                app.paymentStatus === 'pending' ? '#EF4444' : '#64748B',
                        }}
                      >
                        {app.paymentStatus === 'completed' ? '✓ Paid' :
                         app.paymentStatus === 'processing' ? '⏳ Processing' :
                         app.paymentStatus === 'pending' ? '⚠️ Pending' : 'Unknown'}
                      </span>
                      {app.paymentAmount && (
                        <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                          ₹{app.paymentAmount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${getStatusColor(app.status)}15`,
                          color: getStatusColor(app.status),
                        }}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td>
                      <span className="date-cell">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/admin/applications/${app._id}`}
                        className="view-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          className="pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={pagination.currentPage === 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>

          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Applications;
