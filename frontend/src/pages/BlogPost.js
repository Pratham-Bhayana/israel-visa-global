import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './BlogPost.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickLinks, setQuickLinks] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchRelatedBlogs();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (blog) {
      // Extract H2 headings for quick links
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      const headings = tempDiv.querySelectorAll('h2');
      const links = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent
      }));
      setQuickLinks(links);

      // Add IDs to actual H2 elements after render
      setTimeout(() => {
        const actualHeadings = document.querySelectorAll('.blog-post-body h2');
        actualHeadings.forEach((heading, index) => {
          heading.id = `heading-${index}`;
        });
      }, 100);
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${slug}`);
      if (response.data.success) {
        setBlog(response.data.blog);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
      navigate('/blogs');
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/related/${slug}`);
      if (response.data.success) {
        setRelatedBlogs(response.data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const generateFAQSchema = () => {
    if (!blog?.faqSchema || blog.faqSchema.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: blog.faqSchema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const faqSchema = generateFAQSchema();

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle}</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="keywords" content={blog.keywords.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.metaTitle} />
        <meta property="og:description" content={blog.metaDescription} />
        {blog.featuredImage?.url && <meta property="og:image" content={blog.featuredImage.url} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.publishedAt || blog.createdAt} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle} />
        <meta name="twitter:description" content={blog.metaDescription} />
        {blog.featuredImage?.url && <meta name="twitter:image" content={blog.featuredImage.url} />}

        {/* FAQ Schema */}
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="blog-post-page">
        <div className="blog-post-container">
          {/* Main Content */}
          <div className="blog-post-content">
            <Link to="/blogs" className="back-to-blogs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Blogs
            </Link>

            {blog.categories && blog.categories.length > 0 && (
              <div className="blog-post-categories">
                {blog.categories.map((cat, idx) => (
                  <span key={idx} className="category-badge">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            <h1>{blog.title}</h1>

            <div className="blog-post-meta">
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>{blog.readTime} min read</span>
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{blog.views} views</span>
              </div>
            </div>

            {blog.featuredImage && (
              <img 
                src={blog.featuredImage} 
                alt={blog.title} 
                className="blog-post-featured-image"
              />
            )}

            <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {blog.faqSchema && blog.faqSchema.length > 0 && (
              <div className="blog-faq-section">
                <h2>Frequently Asked Questions</h2>
                {blog.faqSchema.map((faq, index) => (
                  <details key={index} className="faq-item-post">
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            )}

            {blog.ctaText && blog.ctaLink && (
              <div className="blog-cta-box">
                <h3>Ready to Get Started?</h3>
                <p>Start your Israel visa application process today</p>
                <Link to={blog.ctaLink} className="cta-button-post">
                  {blog.ctaText}
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Quick Links */}
            {quickLinks.length > 0 && (
              <div className="quick-links">
                <h3>Quick Links</h3>
                <ul className="quick-links-list">
                  {quickLinks.map((link) => (
                    <li key={link.id}>
                      <a href={`#${link.id}`}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="related-blogs">
                <h3>Related Articles</h3>
                <div className="related-blogs-list">
                  {relatedBlogs.map((related) => (
                    <Link
                      key={related._id}
                      to={`/blog/${related.slug}`}
                      className="related-blog-item"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {related.featuredImage && (
                        <img src={related.featuredImage} alt={related.title} />
                      )}
                      <div className="related-blog-info">
                        <h4>{related.title}</h4>
                        <span className="related-blog-meta">{related.readTime} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
