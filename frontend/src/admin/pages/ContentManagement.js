import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';
import './ContentManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('visa-types');
  const [visaTypes, setVisaTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingVisa, setEditingVisa] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, visaId: '', visaName: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feeInr: '',
    feeUsd: '',
    processingTime: '',
    validity: '',
    isActive: true
  });

  useEffect(() => {
    fetchVisaTypes();
  }, []);

  const fetchVisaTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/visa-types/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle different response formats
      if (response.data?.data && Array.isArray(response.data.data)) {
        setVisaTypes(response.data.data);
      } else if (response.data?.visaTypes && Array.isArray(response.data.visaTypes)) {
        setVisaTypes(response.data.visaTypes);
      } else if (Array.isArray(response.data)) {
        setVisaTypes(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setVisaTypes([]);
      }
    } catch (error) {
      toast.error('Failed to fetch visa types');
      console.error('Fetch error:', error);
      setVisaTypes([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    // Transform form data to match backend expectations
    const submitData = {
      name: formData.name,
      description: formData.description,
      fee: {
        inr: parseFloat(formData.feeInr) || 0,
        usd: parseFloat(formData.feeUsd) || 0
      },
      processingTime: formData.processingTime,
      validity: formData.validity,
      isActive: formData.isActive
    };
    
    try {
      if (editingVisa) {
        await axios.put(
          `${API_URL}/api/admin/visa-types/${editingVisa._id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Visa type updated successfully');
      } else {
        await axios.post(
          `${API_URL}/api/admin/visa-types`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Visa type added successfully');
      }
      
      setShowModal(false);
      setEditingVisa(null);
      setFormData({
        name: '',
        description: '',
        feeInr: '',
        feeUsd: '',
        processingTime: '',
        validity: '',
        isActive: true
      });
      fetchVisaTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save visa type');
    }
  };

  const handleEdit = (visa) => {
    setEditingVisa(visa);
    setFormData({
      name: visa.name,
      description: visa.description,
      feeInr: visa.fee?.inr || '',
      feeUsd: visa.fee?.usd || '',
      processingTime: visa.processingTime,
      validity: visa.validity,
      isActive: visa.isActive
    });
    setShowModal(true);
  };

  const openDeleteConfirmModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      visaId: id,
      visaName: name,
    });
  };

  const handleDelete = async () => {
    const id = confirmModal.visaId;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(
        `${API_URL}/api/admin/visa-types/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Visa type deleted successfully');
      fetchVisaTypes();
    } catch (error) {
      toast.error('Failed to delete visa type');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(
        `${API_URL}/api/admin/visa-types/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      fetchVisaTypes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const tabs = [
    { id: 'visa-types', label: 'Visa Types', icon: '🛂' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
    { id: 'locations', label: 'Locations', icon: '📍' },
  ];

  return (
    <div className="content-management">
      <motion.div
        className="content-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Content Management</h1>
        <p>Manage website content, pricing, and FAQs</p>
      </motion.div>

      <motion.div
        className="tabs-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'visa-types' && (
          <div className="visa-types-section">
            <div className="section-header">
              <h2>Visa Types Management</h2>
              <button className="add-btn" onClick={() => setShowModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Visa Type
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : visaTypes && visaTypes.length > 0 ? (
              <div className="table-container">
                <table className="visa-types-table">
                  <thead>
                    <tr>
                      <th>Visa Name</th>
                      <th>Description</th>
                      <th>Fee (INR)</th>
                      <th>Processing Time</th>
                      <th>Validity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visaTypes.map((visa, index) => (
                      <motion.tr
                        key={visa._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="visa-name">{visa.name}</td>
                        <td className="visa-description">{visa.description}</td>
                        <td className="visa-fee">
                          ₹{(visa.fee?.inr || visa.fee || 0).toLocaleString()}
                        </td>
                        <td>{visa.processingTime}</td>
                        <td>{visa.validity}</td>
                        <td>
                          <button
                            className={`status-badge ${visa.isActive ? 'active' : 'inactive'}`}
                            onClick={() => toggleStatus(visa._id, visa.isActive)}
                          >
                            {visa.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(visa)} title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className="action-btn delete-btn" onClick={() => openDeleteConfirmModal(visa._id, visa.name)} title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>No visa types found. Click "Add Visa Type" to create one.</p>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'visa-types' && (
          <div className="coming-soon-card">
            <div className="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0038B8" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h2>Coming Soon</h2>
            <p>This feature is under development</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowModal(false);
              setEditingVisa(null);
              setFormData({
                name: '',
                description: '',
                fee: '',
                processingTime: '',
                validity: '',
                isActive: true
              });
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingVisa ? 'Edit Visa Type' : 'Add New Visa Type'}</h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVisa(null);
                    setFormData({
                      name: '',
                      description: '',
                      feeInr: '',
                      feeUsd: '',
                      processingTime: '',
                      validity: '',
                      isActive: true
                    });
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="visa-form">
                <div className="form-group">
                  <label>Visa Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Tourist Visa"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Brief description of the visa type"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fee (INR) *</label>
                    <input
                      type="number"
                      value={formData.feeInr}
                      onChange={(e) => setFormData({ ...formData, feeInr: e.target.value })}
                      required
                      placeholder="e.g., 4500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fee (USD) *</label>
                    <input
                      type="number"
                      value={formData.feeUsd}
                      onChange={(e) => setFormData({ ...formData, feeUsd: e.target.value })}
                      required
                      placeholder="e.g., 55"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Validity *</label>
                    <input
                      type="text"
                      value={formData.validity}
                      onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                      required
                      placeholder="e.g., 90 days"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      setEditingVisa(null);
                      setFormData({
                        name: '',
                        description: '',
                        feeInr: '',
                        feeUsd: '',
                        processingTime: '',
                        validity: '',
                        isActive: true
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingVisa ? 'Update' : 'Create'} Visa Type
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, visaId: '', visaName: '' })}
        onConfirm={handleDelete}
        title="Delete Visa Type"
        message={`Are you sure you want to delete "${confirmModal.visaName}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ContentManagement;
