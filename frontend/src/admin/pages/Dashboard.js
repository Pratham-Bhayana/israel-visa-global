import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.statistics || {});
        setRecentApplications(data.recentApplications || []);
        setTimelineData(data.applicationsTimeline || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      color: '#0038B8',
      gradient: 'linear-gradient(135deg, #0038B8 0%, #0052E0 100%)',
      bgColor: '#F0F7FF',
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      bgColor: '#FFFBEB',
    },
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      bgColor: '#F0FDF4',
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      bgColor: '#FEF2F2',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      under_review: '#0038B8',
      approved: '#10B981',
      rejected: '#EF4444',
      documents_required: '#8B5CF6',
    };
    return colors[status] || '#64748B';
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ background: stat.bgColor }}
          >
            <div className="stat-header">
              <div className="stat-icon" style={{ background: stat.gradient }}>
                {stat.icon}
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value" style={{ color: stat.color }}>{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications & Timeline */}
      <div className="dashboard-grid">
        {/* Recent Applications */}
        <motion.div
          className="dashboard-card recent-applications"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-header">
            <h2 className="card-title">Recent Applications</h2>
            <Link to="/admin/applications" className="view-all-link">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>
          <div className="applications-list">
            {recentApplications.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>No applications yet</p>
              </div>
            ) : (
              recentApplications.map((app) => (
                <Link
                  key={app._id}
                  to={`/admin/applications/${app._id}`}
                  className="application-item"
                >
                  <div className="app-info">
                    <div className="app-avatar">
                      {app.fullName?.[0]?.toUpperCase() || app.userId?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="app-details">
                      <h4>{app.fullName || app.userId?.displayName || 'No Name'}</h4>
                      <p>{app.applicationNumber}</p>
                    </div>
                  </div>
                  <div className="app-meta">
                    <span
                      className="status-badge"
                      style={{
                        background: `${getStatusColor(app.status)}15`,
                        color: getStatusColor(app.status),
                      }}
                    >
                      {getStatusLabel(app.status)}
                    </span>
                    <span className="app-date">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          className="dashboard-card activity-timeline"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="card-header">
            <h2 className="card-title">30-Day Overview</h2>
          </div>
          <div className="timeline-chart">
            {timelineData.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
                <p>No data available</p>
              </div>
            ) : (
              <div className="chart-bars">
                {timelineData.map((item, index) => {
                  const maxCount = Math.max(...timelineData.map(d => d.count), 1);
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div key={index} className="chart-bar-wrapper">
                      <motion.div
                        className="chart-bar"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        style={{
                          background: 'linear-gradient(135deg, #0038B8 0%, #0052E0 100%)',
                        }}
                      >
                        <span className="bar-value">{item.count}</span>
                      </motion.div>
                      <span className="bar-label">
                        {new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/applications" className="action-card">
            <div className="action-icon" style={{ background: '#F0F7FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0038B8" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3>Review Applications</h3>
            <p>Process pending visa applications</p>
          </Link>

          <Link to="/admin/content" className="action-card">
            <div className="action-icon" style={{ background: '#FFFBEB' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h3>Manage Content</h3>
            <p>Update visa types and pricing</p>
          </Link>

          <Link to="/admin/users" className="action-card">
            <div className="action-icon" style={{ background: '#F0FDF4' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>User Management</h3>
            <p>View and manage registered users</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
