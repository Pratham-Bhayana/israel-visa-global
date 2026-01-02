import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';
import './Blogs.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, blogId: '', blogTitle: '' });

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`${API_URL}/api/admin/blogs?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });

      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setPagination({
          currentPage: response.data.pagination?.page || 1,
          totalPages: response.data.pagination?.pages || 1,
          totalBlogs: response.data.pagination?.total || 0,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
      setLoading(false);
    }
  };

  const openDeleteConfirmModal = (id, title) => {
    setConfirmModal({
      isOpen: true,
      blogId: id,
      blogTitle: title,
    });
  };

  const handleDelete = async () => {
    const id = confirmModal.blogId;
    const token = localStorage.getItem('adminToken');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    try {
      await axios.delete(`${API_URL}/api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      published: { bg: '#D1FAE5', color: '#10B981' },
      draft: { bg: '#FEF3C7', color: '#F59E0B' },
      archived: { bg: '#F3F4F6', color: '#6B7280' },
    };
    return colors[status] || colors.draft;
  };

  if (loading) {
    return (
      <div className="blogs-loading">
        <div className="loading-spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-header">
        <div>
          <h1>Blog Management</h1>
          <p>Create and manage blog posts</p>
        </div>
        <Link to="/admin/blogs/create" className="btn-create-blog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create New Blog
        </Link>
      </div>

      <motion.div
        className="blogs-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          placeholder="Search blogs..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="status-filter"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        {(filters.status || filters.search) && (
          <button
            className="clear-filters-btn"
            onClick={() => setFilters({ status: '', search: '' })}
          >
            Clear
          </button>
        )}

        <div className="results-info">
          <p>{pagination.totalBlogs} blog(s) found</p>
        </div>
      </motion.div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>No blogs found</h3>
          <p>Create your first blog post to get started</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              className="blog-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {blog.featuredImage?.url && (
                <div className="blog-card-image">
                  <img src={blog.featuredImage.url} alt={blog.title} />
                </div>
              )}
              
              <div className="blog-card-content">
                <div className="blog-card-header">
                  <span
                    className="status-badge"
                    style={{
                      background: getStatusBadge(blog.status).bg,
                      color: getStatusBadge(blog.status).color,
                    }}
                  >
                    {blog.status}
                  </span>
                  <span className="blog-views">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {blog.views}
                  </span>
                </div>

                <h3>{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt || blog.metaDescription}</p>
                
                <div className="blog-meta">
                  <span className="blog-date">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="blog-readtime">{blog.readTime} min read</span>
                </div>

                <div className="blog-card-actions">
                  <Link to={`/admin/blogs/edit/${blog._id}`} className="btn-edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Link>
                  <button 
                    onClick={() => openDeleteConfirmModal(blog._id, blog.title)} 
                    className="btn-delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={pagination.currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, blogId: '', blogTitle: '' })}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${confirmModal.blogTitle}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Blogs;
