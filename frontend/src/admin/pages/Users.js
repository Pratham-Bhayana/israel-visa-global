import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Users.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <motion.div
        className="users-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Users Management</h1>
          <p>View and manage registered users</p>
        </div>
      </motion.div>

      <motion.div
        className="users-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="users-count">
          <p>{filteredUsers.length} users found</p>
        </div>
      </motion.div>

      <motion.div
        className="users-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3>No users found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              className="user-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="user-avatar">
                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <h3>{user.displayName || 'No Name'}</h3>
                <p className="user-email">{user.email || 'No Email'}</p>
                {user.phoneNumber && (
                  <p className="user-phone">{user.phoneNumber}</p>
                )}
              </div>
              <div className="user-meta">
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? '👑' : '👤'} {user.role}
                </span>
                <span className="user-provider">
                  {user.authProvider === 'google' && '🔵 Google'}
                  {user.authProvider === 'phone' && '📱 Phone'}
                  {user.authProvider === 'email' && '✉️ Email'}
                </span>
                <span className="user-date">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Users;
