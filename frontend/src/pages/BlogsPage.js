import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './BlogsPage.css';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
  });

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 9,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`${API_ENDPOINTS.BLOGS}?${params}`);

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
      setLoading(false);
    }
  };

  const categoryLabels = {
    'visa-guide': 'Visa Guide',
    'requirements': 'Requirements',
    'tips': 'Tips',
    'process': 'Process',
    'news': 'News',
  };

  if (loading) {
    return (
      <div className="blogs-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Israel Visa Blog - Complete Guide to Israel Visa Application & Travel Tips</title>
        <meta
          name="description"
          content="Read our comprehensive Israel visa blog for application guides, requirements, tips, and the latest visa news. Everything you need for a successful Israel visa application."
        />
        <meta name="keywords" content="Israel visa blog, visa guide, Israel visa requirements, visa application tips, Israel travel blog" />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/blogs`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Israel Visa Blog - Complete Guide & Travel Tips" />
        <meta property="og:description" content="Read our comprehensive Israel visa blog for application guides, requirements, tips, and news." />
        <meta property="og:url" content={`${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/blogs`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Israel Visa Blog - Complete Guide & Travel Tips" />
        <meta name="twitter:description" content="Read our comprehensive Israel visa blog for application guides, requirements, tips, and news." />
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/blogs`
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="blogs-page-container">
      {/* Hero Section */}
      <div className="blogs-hero">
        <h1>Israel Visa Blog</h1>
        <p>Your complete guide to Israel visa applications, requirements, and travel tips</p>
      </div>

      {/* Filters */}
      <div className="blogs-filters-section">
        <div className="container">
          <div className="filters-wrapper">
            <input
              type="text"
              placeholder="Search blogs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {Object.keys(categoryLabels).map((key) => (
                <option key={key} value={key}>
                  {categoryLabels[key]}
                </option>
              ))}
            </select>

            {(filters.category || filters.search) && (
              <button
                className="clear-filters"
                onClick={() => setFilters({ category: '', search: '' })}
              >
                Clear Filters
              </button>
            )}
          </div>

          <p className="results-count">{pagination.totalBlogs} article(s) found</p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container">
        {blogs.length === 0 ? (
          <div className="no-blogs">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>No blogs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="blogs-grid-public">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                className="blog-card-public"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {blog.featuredImage?.url && (
                  <Link to={`/blog/${blog.slug}`} className="blog-image-link">
                    <img src={blog.featuredImage.url} alt={blog.title} />
                  </Link>
                )}
                
                <div className="blog-card-body">
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="blog-categories">
                      {blog.categories.map((cat, idx) => (
                        <span key={idx} className="category-badge">
                          {categoryLabels[cat] || cat}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link to={`/blog/${blog.slug}`}>
                    <h2>{blog.title}</h2>
                  </Link>

                  <p className="blog-meta-info">
                    <span className="meta-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="meta-read">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      {blog.readTime} min read
                    </span>
                  </p>

                  <p className="blog-description">{blog.excerpt || blog.metaDescription}</p>

                  <Link to={`/blog/${blog.slug}`} className="read-more-btn">
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-public">
            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
              disabled={pagination.currentPage === 1}
              className="pagination-btn-public"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination({ ...pagination, currentPage: page })}
                  className={`pagination-number ${page === pagination.currentPage ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
              disabled={pagination.currentPage === pagination.totalPages}
              className="pagination-btn-public"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="blog-cta-section">
        <div className="container">
          <h2>Ready to Apply for Your Israel Visa?</h2>
          <p>Start your application process today and get expert guidance</p>
          <Link to="/application" className="cta-button">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogsPage;
