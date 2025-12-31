import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import './VisaTypes.css';

const VisaTypes = () => {
  const [activeTab, setActiveTab] = useState('Israel');
  const [visaTypes, setVisaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visaToDelete, setVisaToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const [formData, setFormData] = useState({
    country: 'Israel',
    name: '',
    slug: '',
    description: '',
    fee: { inr: 0, usd: 0 },
    icon: 'FaPassport',
    processingTime: '5-7 business days',
    validity: '90 days',
    requirements: [],
    features: [],
    isActive: true,
    popular: false,
    order: 0,
  });

  const iconOptions = [
    'FaPassport',
    'FaGlobe',
    'FaUserTie',
    'FaUsers',
    'FaPlaneArrival',
    'FaFileAlt',
    'FaBriefcase',
    'FaGraduationCap',
    'FaHeart',
    'FaHome',
  ];

  useEffect(() => {
    fetchVisaTypes();
  }, [activeTab]);

  const fetchVisaTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      const response = await fetch(
        `http://localhost:5000/api/visa-types/all?country=${activeTab}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-email': adminUser.email || '',
            'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
            'x-user-uid': adminUser._id || '',
          },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setVisaTypes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching visa types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      const url = isEditing
        ? `http://localhost:5000/api/visa-types/${selectedVisa._id}`
        : 'http://localhost:5000/api/visa-types';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(isEditing ? 'Visa type updated successfully!' : 'Visa type created successfully!');
        setShowModal(false);
        resetForm();
        fetchVisaTypes();
      } else {
        alert(data.message || 'Error saving visa type');
      }
    } catch (error) {
      console.error('Error saving visa type:', error);
      alert('Error saving visa type');
    }
  };

  const handleEdit = (visa) => {
    setSelectedVisa(visa);
    setIsEditing(true);
    setFormData({
      country: visa.country,
      name: visa.name,
      slug: visa.slug,
      description: visa.description,
      fee: visa.fee,
      icon: visa.icon,
      processingTime: visa.processingTime,
      validity: visa.validity,
      requirements: visa.requirements || [],
      features: visa.features || [],
      isActive: visa.isActive,
      popular: visa.popular,
      order: visa.order,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!visaToDelete) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      const response = await fetch(
        `http://localhost:5000/api/visa-types/${visaToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-email': adminUser.email || '',
            'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
            'x-user-uid': adminUser._id || '',
          },
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        alert('Visa type deleted successfully!');
        fetchVisaTypes();
      } else {
        alert(data.message || 'Error deleting visa type');
      }
    } catch (error) {
      console.error('Error deleting visa type:', error);
      alert('Error deleting visa type');
    } finally {
      setShowDeleteConfirm(false);
      setVisaToDelete(null);
    }
  };

  const openDeleteConfirm = (visa) => {
    setVisaToDelete(visa);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      country: activeTab,
      name: '',
      slug: '',
      description: '',
      fee: { inr: 0, usd: 0 },
      icon: 'FaPassport',
      processingTime: '5-7 business days',
      validity: '90 days',
      requirements: [],
      features: [],
      isActive: true,
      popular: false,
      order: 0,
    });
    setSelectedVisa(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setFormData(prev => ({ ...prev, country: activeTab }));
    setShowModal(true);
  };

  return (
    <div className="visa-types-container">
      <div className="page-header">
        <h1>Manage Visa Types</h1>
        <p>Create and manage visa types for Israel and India</p>
      </div>

      {/* Tabs */}
      <div className="visa-tabs">
        <button
          className={`tab-button ${activeTab === 'Israel' ? 'active' : ''}`}
          onClick={() => setActiveTab('Israel')}
        >
          🇮🇱 Israel Visas
        </button>
        <button
          className={`tab-button ${activeTab === 'India' ? 'active' : ''}`}
          onClick={() => setActiveTab('India')}
        >
          🇮🇳 India Visas
        </button>
      </div>

      {/* Action Bar with View Toggle */}
      <div className="action-bar">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Card View"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
        <motion.button
          className="btn-add"
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add New Visa Type
        </motion.button>
      </div>

      {/* Visa Types List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading visa types...</p>
        </div>
      ) : (
        <div className="visa-types-list">
          {visaTypes.length === 0 ? (
            <div className="empty-state">
              <p>No visa types found for {activeTab}</p>
              <button className="btn-primary" onClick={openAddModal}>
                Create First Visa Type
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="table-container">
              <table className="visa-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Fee (USD)</th>
                    <th>Fee (INR)</th>
                    <th>Processing</th>
                    <th>Validity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visaTypes.map((visa) => (
                    <tr key={visa._id} className={!visa.isActive ? 'inactive-row' : ''}>
                      <td className="order-cell">{visa.order}</td>
                      <td className="name-cell">
                        <div className="name-wrapper">
                          <strong>{visa.name}</strong>
                          {visa.popular && <span className="badge badge-popular-sm">Popular</span>}
                        </div>
                      </td>
                      <td className="description-cell">
                        <span className="description-text" title={visa.description}>
                          {visa.description}
                        </span>
                      </td>
                      <td className="fee-cell">${visa.fee.usd}</td>
                      <td className="fee-cell">₹{visa.fee.inr}</td>
                      <td className="processing-cell">{visa.processingTime}</td>
                      <td className="validity-cell">{visa.validity}</td>
                      <td className="status-cell">
                        {visa.isActive ? (
                          <span className="status-badge active">Active</span>
                        ) : (
                          <span className="status-badge inactive">Inactive</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-table-edit"
                          onClick={() => handleEdit(visa)}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="btn-table-delete"
                          onClick={() => openDeleteConfirm(visa)}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View */
            <div className="visa-cards-grid">
              {visaTypes.map((visa) => (
                <motion.div
                  key={visa._id}
                  className={`visa-card ${!visa.isActive ? 'inactive' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="visa-card-header">
                    <h3>{visa.name}</h3>
                    <div className="visa-badges">
                      {visa.popular && <span className="badge badge-popular">Popular</span>}
                      {!visa.isActive && <span className="badge badge-inactive">Inactive</span>}
                    </div>
                  </div>
                  
                  <p className="visa-description">{visa.description}</p>
                  
                  <div className="visa-details-grid">
                    <div className="detail-item">
                      <span className="label">Fee (USD):</span>
                      <span className="value">${visa.fee.usd}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Fee (INR):</span>
                      <span className="value">₹{visa.fee.inr}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Processing:</span>
                      <span className="value">{visa.processingTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Validity:</span>
                      <span className="value">{visa.validity}</span>
                    </div>
                  </div>

                  {visa.features && visa.features.length > 0 && (
                    <div className="visa-features">
                      <strong>Features:</strong>
                      <ul>
                        {visa.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="visa-card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(visa)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => openDeleteConfirm(visa)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content visa-form-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Visa Type' : 'Add New Visa Type'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="visa-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing}
                  >
                    <option value="Israel">Israel</option>
                    <option value="India">India</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    required
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Tourist Visa"
                />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., tourist-visa"
                  disabled={isEditing}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Brief description of the visa type"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fee (USD) *</label>
                  <input
                    type="number"
                    name="fee.usd"
                    value={formData.fee.usd}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label>Fee (INR) *</label>
                  <input
                    type="number"
                    name="fee.inr"
                    value={formData.fee.inr}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Processing Time</label>
                  <input
                    type="text"
                    name="processingTime"
                    value={formData.processingTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 5-7 business days"
                  />
                </div>
                
                <div className="form-group">
                  <label>Validity</label>
                  <input
                    type="text"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    placeholder="e.g., 90 days"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Requirements (one per line)</label>
                <textarea
                  name="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleArrayInput('requirements', e.target.value)}
                  rows="4"
                  placeholder="Valid passport&#10;Passport photo&#10;Travel itinerary"
                />
              </div>

              <div className="form-group">
                <label>Features (one per line)</label>
                <textarea
                  name="features"
                  value={formData.features.join('\n')}
                  onChange={(e) => handleArrayInput('features', e.target.value)}
                  rows="4"
                  placeholder="Fast processing&#10;Multiple entries&#10;90-day validity"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                  
                  <label>
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                    />
                    Popular
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {isEditing ? 'Update' : 'Create'} Visa Type
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Visa Type"
          message={`Are you sure you want to delete "${visaToDelete?.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setVisaToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default VisaTypes;
