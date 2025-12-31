import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './BlogEditor.css';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    featuredImage: { url: '', publicId: '' },
    content: '',
    excerpt: '',
    categories: [],
    ctaText: 'Apply Now',
    ctaLink: '/application',
    status: 'draft',
    faqSchema: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableCategories = [
    'visa-guide',
    'requirements',
    'tips',
    'process',
    'news',
  ];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const response = await axios.get(`http://localhost:5000/api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-email': adminUser.email || '',
          'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
          'x-user-uid': adminUser._id || '',
        },
      });

      if (response.data.success) {
        const blog = response.data.blog;
        console.log('Fetched blog data:', blog); // Debug log
        
        // Handle featuredImage which can be either string or object
        let featuredImage = { url: '', publicId: '' };
        if (typeof blog.featuredImage === 'string') {
          featuredImage = { url: blog.featuredImage, publicId: '' };
        } else if (blog.featuredImage && blog.featuredImage.url) {
          featuredImage = blog.featuredImage;
        }
        
        setFormData({
          title: blog.title || '',
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || '',
          keywords: blog.keywords || [],
          featuredImage: featuredImage,
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          categories: blog.categories || [],
          ctaText: blog.ctaText || 'Apply Now',
          ctaLink: blog.ctaLink || '/application',
          status: blog.status || 'draft',
          faqSchema: blog.faqSchema || [],
        });
        console.log('Form data set successfully'); // Debug log
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'israel_visa_blog');
    formDataImg.append('folder', 'blogs');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dmvvzchbr/image/upload`,
        formDataImg
      );

      setFormData({
        ...formData,
        featuredImage: {
          url: response.data.secure_url,
          publicId: response.data.public_id,
        },
      });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    });
  };

  const toggleCategory = (category) => {
    const categories = formData.categories.includes(category)
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category];
    setFormData({ ...formData, categories });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqSchema: [...formData.faqSchema, { question: '', answer: '' }],
    });
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...formData.faqSchema];
    newFAQs[index][field] = value;
    setFormData({ ...formData, faqSchema: newFAQs });
  };

  const removeFAQ = (index) => {
    setFormData({
      ...formData,
      faqSchema: formData.faqSchema.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.metaTitle || !formData.metaDescription || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-user-email': adminUser.email || '',
        'x-user-name': adminUser.name || adminUser.email?.split('@')[0] || '',
        'x-user-uid': adminUser._id || '',
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/admin/blogs/${id}`, formData, { headers });
        toast.success('Blog updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin/blogs', formData, { headers });
        toast.success('Blog created successfully');
      }

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-editor">
        <div className="editor-loading">
          <div className="loading-spinner"></div>
          <p>Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <button onClick={() => navigate('/admin/blogs')} className="btn-back">\n          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Blogs
        </button>
        <h1>{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section full-width">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Blog Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title..."
                required
              />
              <span className="help-text">This will be used as H1 heading</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Meta Title * <span className="char-count">{formData.metaTitle.length}/60</span></label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value.slice(0, 60) })}
                  placeholder="SEO title (max 60 characters)..."
                  maxLength={60}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Meta Description * <span className="char-count">{formData.metaDescription.length}/160</span></label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value.slice(0, 160) })}
                placeholder="SEO description (max 160 characters)..."
                maxLength={160}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Excerpt <span className="char-count">{formData.excerpt.length}/200</span></label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value.slice(0, 200) })}
                placeholder="Short summary (max 200 characters)..."
                maxLength={200}
                rows={2}
              />
              <span className="help-text">Leave empty to auto-generate from meta description</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="form-section full-width">
            <h2>SEO Keywords</h2>
            <div className="form-group">
              <div className="keyword-input-wrapper">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Type keyword and press Enter..."
                />
                <button type="button" onClick={addKeyword} className="btn-add-keyword">
                  Add
                </button>
              </div>
              <div className="keywords-list">
                {formData.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                    <button type="button" onClick={() => removeKeyword(keyword)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="form-section full-width">
            <h2>Featured Image</h2>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={typeof formData.featuredImage === 'string' ? formData.featuredImage : formData.featuredImage.url}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg or upload below"
              />
              <small>Paste image URL or upload from your computer</small>
            </div>
            <div className="form-group">
              <div className="image-upload-area">
                {((typeof formData.featuredImage === 'string' && formData.featuredImage) || formData.featuredImage.url) ? (
                  <div className="image-preview">
                    <img src={typeof formData.featuredImage === 'string' ? formData.featuredImage : formData.featuredImage.url} alt="Featured" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featuredImage: '' })}
                      className="btn-remove-image"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>{imageUploading ? 'Uploading...' : 'Click to upload featured image'}</p>
                    <span>Recommended: 1200x630px (Max 5MB)</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="form-section full-width">
            <h2>Categories</h2>
            <div className="categories-grid">
              {availableCategories.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="form-section full-width">
            <h2>Content *</h2>
            <div className="form-group">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={quillModules}
                placeholder="Write your blog content here..."
              />
              <span className="help-text">Use proper headings (H2, H3) for better SEO</span>
            </div>
          </div>

          {/* FAQ Schema */}
          <div className="form-section full-width">
            <h2>FAQ Schema (Optional)</h2>
            <button type="button" onClick={addFAQ} className="btn-add-faq">
              + Add FAQ
            </button>
            {formData.faqSchema.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-header">
                  <span>FAQ #{index + 1}</span>
                  <button type="button" onClick={() => removeFAQ(index)} className="btn-remove-faq">
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  placeholder="Question..."
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  placeholder="Answer..."
                  rows={3}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="form-section full-width">
            <h2>Call to Action</h2>
            <div className="form-row">
              <div className="form-group">
                <label>CTA Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Apply Now"
                />
              </div>
              <div className="form-group">
                <label>CTA Link</label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/application"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/blogs')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-save">
            {saving ? 'Saving...' : isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
