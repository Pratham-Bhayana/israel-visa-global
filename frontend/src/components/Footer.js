import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EligibilityModal from './EligibilityModal';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  const footerLinks = {
    'Quick Links': [
      { label: 'Home', path: '/' },
      { label: 'Apply Now', path: '/apply' },
      { label: 'Track Application', path: '/profile' },
      { label: 'Blog', path: '/blogs' },
    ],
    'Resources': [
      { label: 'Visa Types', path: '/visa-types' },
      { label: 'Requirements', path: '/requirements' },
      { label: 'Processing Time', path: '/processing' },
      { label: 'FAQ', path: '/#faq' },
    ],
    'Legal': [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Refund Policy', path: '/refund' },
      { label: 'Contact Us', path: '/contact' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-top">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="footer-logo">
              <h3>IsraelVisa</h3>
            </div>
            <p className="footer-description">
              Your trusted partner for hassle-free Israel visa applications. 
              Fast, secure, and reliable service.
            </p>
          </motion.div>

          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              className="footer-links"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h4 className="footer-title">{title}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}        </div>

        <div className="footer-bottom">
          <motion.button
            className="btn btn-evisa footer-evisa-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEligibilityModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Check e-Visa Eligibility
          </motion.button>
          
          <p className="copyright">
            © {currentYear} IsraelVisa. All rights reserved.
          </p>
        </div>
      </div>
      
      <EligibilityModal 
        isOpen={showEligibilityModal} 
        onClose={() => setShowEligibilityModal(false)} 
      />
    </footer>
  );
};

export default Footer;
