import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  FaPassport, 
  FaPlaneArrival, 
  FaFileAlt, 
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaGlobe,
  FaCalendarAlt,
  FaUsers,
  FaChevronDown,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaUserTie,
  FaHotel,
  FaMoneyBillWave
} from 'react-icons/fa';
import './IndiaVisa.css';

const IndiaVisa = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);
  const [formData, setFormData] = useState({});
  const [visaTypes, setVisaTypes] = useState([]);
  const [loadingVisas, setLoadingVisas] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVisaTypes();
  }, []);

  const fetchVisaTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/visa-types?country=India`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setVisaTypes(data.data);
      }
    } catch (error) {
      console.error('Error fetching India visa types:', error);
    } finally {
      setLoadingVisas(false);
    }
  };

  // Icon mapping helper
  const getIconComponent = (iconName) => {
    const icons = {
      FaGlobe: <FaGlobe />,
      FaUserTie: <FaUserTie />,
      FaUsers: <FaUsers />,
      FaPassport: <FaPassport />,
      FaPlaneArrival: <FaPlaneArrival />,
      FaFileAlt: <FaFileAlt />,
    };
    return icons[iconName] || <FaGlobe />;
  };

  const steps = [
    {
      id: 1,
      title: 'Complete Online Application',
      description: 'Fill out the comprehensive visa application form with accurate details',
      icon: <FaFileAlt />,
      details: [
        'Personal information',
        'Passport details',
        'Travel information',
        'Family & professional details'
      ]
    },
    {
      id: 2,
      title: 'Upload Required Documents',
      description: 'Submit digital copies of your passport, photo, and supporting documents',
      icon: <FaPassport />,
      details: [
        'Passport bio page',
        'Recent photograph',
        'Supporting documents',
        'Additional certificates if required'
      ]
    },
    {
      id: 3,
      title: 'Make Secure Payment',
      description: 'Pay the visa fee securely using credit/debit card or other payment methods',
      icon: <FaMoneyBillWave />,
      details: [
        'Multiple payment options',
        'Secure encrypted payment',
        'Instant confirmation',
        'Email receipt'
      ]
    },
    {
      id: 4,
      title: 'Receive Your e-Visa',
      description: 'Get your approved e-visa via email within 3-5 business days',
      icon: <FaCheckCircle />,
      details: [
        'Email notification',
        'PDF visa document',
        'Print and travel',
        'No embassy visit needed'
      ]
    }
  ];

  const requirements = [
    {
      category: 'Personal Information',
      icon: <FaUsers />,
      items: [
        'Full name (as per passport)',
        'Date & place of birth',
        'Nationality/Region',
        'Gender',
        'Citizenship/National ID No.',
        'Religion',
        'Visible identification marks',
        'Educational qualification'
      ]
    },
    {
      category: 'Passport Details',
      icon: <FaPassport />,
      items: [
        'Passport type',
        'Passport number',
        'Place of issue',
        'Date of issue & expiry',
        'Any other valid passport/identity certificate'
      ]
    },
    {
      category: 'Contact Information',
      icon: <FaPhone />,
      items: [
        'Email ID & Re-enter Email ID',
        'Phone number',
        'Mobile number',
        'Postal/Zip code',
        'Complete address',
        'State/Province/District'
      ]
    },
    {
      category: 'Travel Details',
      icon: <FaPlaneArrival />,
      items: [
        'Purpose of visit (detailed)',
        'Expected date of arrival',
        'Port of arrival in India',
        'Duration of visa',
        'Number of entries',
        'Places to be visited',
        'Cities previously visited in India'
      ]
    },
    {
      category: 'Family Information',
      icon: <FaUsers />,
      items: [
        'Father\'s name & nationality',
        'Mother\'s name & nationality',
        'Applicant\'s marital status',
        'Spouse details (if married)',
        'Grandparents\' nationality (if Pakistan/Afghan origin)'
      ]
    },
    {
      category: 'Professional Details',
      icon: <FaBuilding />,
      items: [
        'Present occupation',
        'Employer/business name',
        'Designation',
        'Address & phone',
        'Organization details'
      ]
    },
    {
      category: 'Accommodation',
      icon: <FaHotel />,
      items: [
        'Hotel/Resort/Tour operator details',
        'Address & phone number',
        'City/Place of accommodation',
        'Name & details of applicant company (if applicable)'
      ]
    }
  ];

  const faqs = [
    {
      question: 'What is India e-Visa?',
      answer: 'India e-Visa is an electronic travel authorization for visiting India for tourism, business, medical treatment, or conference purposes. It eliminates the need for visiting an embassy or consulate.'
    },
    {
      question: 'How long does it take to get an India e-Visa?',
      answer: 'The standard processing time is 3-5 business days. We also offer expedited processing options for urgent travel needs.'
    },
    {
      question: 'What is the validity of India e-Visa?',
      answer: 'Tourist e-Visa is valid for 1 year with multiple entries (30/90 days per stay). Business e-Visa is valid for 1 year with multiple entries. Medical e-Visa is valid for 120 days with triple entry.'
    },
    {
      question: 'Can I extend my e-Visa while in India?',
      answer: 'No, e-Visa cannot be extended. You need to apply for a new visa if you wish to stay longer than the visa validity.'
    },
    {
      question: 'Which airports accept e-Visa?',
      answer: 'India e-Visa is accepted at 28 designated airports and 5 seaports across India, including major airports like Delhi, Mumbai, Bangalore, and Chennai.'
    },
    {
      question: 'What documents do I need for India e-Visa?',
      answer: 'You need a valid passport (minimum 6 months validity), a recent passport-size photograph, and supporting documents based on your visa type (hotel bookings, invitation letters, etc.).'
    }
  ];

  const benefits = [
    {
      icon: <FaClock />,
      title: 'Fast Processing',
      description: '3-5 business days standard processing with express options available'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Safe',
      description: 'Bank-level encryption and secure document handling'
    },
    {
      icon: <FaCheckCircle />,
      title: 'High Success Rate',
      description: '99% approval rate with expert document verification'
    },
    {
      icon: <FaGlobe />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in multiple languages'
    }
  ];

  return (
    <div className="india-visa-page">
      <Helmet>
        <title>India e-Visa Online Application 2025 | Apply for Indian Visa | Tourist, Business & Medical Visa</title>
        <meta name="description" content="Apply for India e-Visa online. Get your Indian visa in 3-5 days. Tourist, Business & Medical e-Visa available. Simple application process, 24/7 support. Apply now!" />
        <meta name="keywords" content="India visa, India e-visa, Indian visa online, India tourist visa, India business visa, India medical visa, apply India visa, India visa application, India visa online, e-visa India, Indian visa for tourists, India visa requirements, India visa processing" />
        <meta property="og:title" content="India e-Visa Online Application 2025 | Apply for Indian Visa" />
        <meta property="og:description" content="Get your India e-Visa in 3-5 days. Simple online application for Tourist, Business & Medical visas. Expert support & high approval rate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/india-visa" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India e-Visa Online Application 2025" />
        <meta name="twitter:description" content="Apply for India e-Visa online. Tourist, Business & Medical visa available. Fast processing, secure payment." />
        <link rel="canonical" href="https://yourdomain.com/india-visa" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "India e-Visa Application Service",
            "description": "Online India e-Visa application service for tourists, business travelers, and medical patients",
            "provider": {
              "@type": "Organization",
              "name": "IsraelVisa"
            },
            "areaServed": "Worldwide",
            "serviceType": "Visa Application Service",
            "offers": {
              "@type": "Offer",
              "price": "80",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <motion.section 
        className="india-hero"
        style={{ opacity }}
      >
        <div className="india-hero-video-container">
          <video
            className="india-hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            loading="lazy"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%230038B8'/%3E%3C/svg%3E"
          >
            <source src="https://res.cloudinary.com/dlwn3lssr/video/upload/q_auto:low,f_auto/v1766725761/Cinematic_INdia_Evisa_video_iphhjp.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="india-hero-overlay"></div>
        </div>

        <div className="india-hero-content container">
          <motion.div
            className="india-hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Get Your India Visa Online
            </motion.h1>
            <motion.p
              className="india-hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Fast, secure, and hassle-free visa application process.
              <br />
              Get your India visa in just 3-5 business days.
            </motion.p>
            <motion.div
              className="india-hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="btn btn-primary btn-large"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 56, 184, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/apply?country=india')}
              >
                Apply for India e-Visa Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Visa Types Section */}
      <section id="visa-types" className="visa-types-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Choose Your <span className="gradient-text">India e-Visa Type</span></h2>
            <p>Select the visa category that matches your travel purpose</p>
          </motion.div>

          <div className="visa-types-grid">
            {loadingVisas ? (
              <div className="loading-message">Loading visa types...</div>
            ) : visaTypes.length === 0 ? (
              <div className="no-visas-message">No visa types available at the moment.</div>
            ) : (
              visaTypes.map((visa, index) => (
                <motion.div
                  key={visa._id || index}
                  className="visa-type-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
                >
                  <div className="visa-card-icon">{getIconComponent(visa.icon)}</div>
                  <h3>{visa.name}</h3>
                  <div className="visa-price">From ${visa.fee.usd}</div>
                  <div className="visa-details">
                    <div className="visa-detail-item">
                      <FaClock />
                      <span>Processing: {visa.processingTime}</span>
                    </div>
                    <div className="visa-detail-item">
                      <FaCalendarAlt />
                      <span>Validity: {visa.validity}</span>
                    </div>
                  </div>
                  <ul className="visa-features">
                    {visa.features && visa.features.map((feature, idx) => (
                      <li key={idx}>
                        <FaCheckCircle /> {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="btn btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Why Choose Our <span className="gradient-text">India e-Visa Service</span></h2>
            <p>Trusted by thousands of travelers worldwide</p>
          </motion.div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="how-to-apply-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>How to Apply for <span className="gradient-text">India e-Visa</span></h2>
            <p>Simple 4-step process to get your India visa online</p>
          </motion.div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`step-card ${activeStep === step.id ? 'active' : ''}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              >
                <div className="step-header">
                  <div className="step-number">{step.id}</div>
                  <h3>{step.title}</h3>
                  <FaChevronDown className={`expand-icon ${activeStep === step.id ? 'rotated' : ''}`} />
                </div>
                <div className="step-content">
                  <p>{step.description}</p>
                  {activeStep === step.id && (
                    <motion.ul
                      className="step-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {step.details.map((detail, idx) => (
                        <li key={idx}>
                          <FaCheckCircle /> {detail}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>India e-Visa <span className="gradient-text">Requirements</span></h2>
            <p>Complete list of information and documents needed for your application</p>
          </motion.div>

          <div className="requirements-grid">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                className="requirement-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="requirement-header">
                  <div className="requirement-icon">{req.icon}</div>
                  <h3>{req.category}</h3>
                </div>
                <ul className="requirement-list">
                  {req.items.map((item, idx) => (
                    <li key={idx}>
                      <FaCheckCircle /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="requirements-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <FaShieldAlt />
            <p>
              <strong>Important:</strong> All documents must be clear, legible, and in English. 
              If documents are in another language, certified translations must be provided. 
              Your passport must have at least 6 months validity and 2 blank pages.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p>Everything you need to know about India e-Visa</p>
          </motion.div>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-india">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2>Ready to Visit India?</h2>
            <p>Start your India e-Visa application now and get approved in 3-5 days</p>
            <motion.button
              className="btn-primary-india large"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 50px rgba(255, 153, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPassport /> Apply for India e-Visa Now
            </motion.button>
            <p className="cta-support">
              Need help? <a href="tel:+1234567890">Call us</a> or <a href="mailto:support@yourdomain.com">email support</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IndiaVisa;
