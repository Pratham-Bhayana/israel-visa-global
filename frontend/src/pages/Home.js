import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import EligibilityModal from '../components/EligibilityModal';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [visaTypes, setVisaTypes] = useState([]);
  const [loadingVisas, setLoadingVisas] = useState(true);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(() => {
    // Optimize video loading
    const video = document.querySelector('.hero-video');
    if (video) {
      video.playbackRate = 1.0;
    }

    // Fetch visa types from database
    fetchVisaTypes();
  }, []);

  const fetchVisaTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/visa-types?country=Israel`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setVisaTypes(data.data);
      }
    } catch (error) {
      console.error('Error fetching visa types:', error);
    } finally {
      setLoadingVisas(false);
    }
  };

  const handleApplyClick = () => {
    if (currentUser) {
      navigate('/apply');
    } else {
      navigate('/login', { state: { from: '/apply' } });
    }
  };

  // const handleEVisaClick = () => {
  //   setShowEligibilityModal(true);
  // };

  const features = [
    {
      title: 'Fast Processing',
      description: 'Get your visa application processed within 3-5 business days',
    },
    {
      title: 'Secure & Safe',
      description: 'Bank-level encryption to protect your personal information',
    },
    {
      title: 'Track Anytime',
      description: 'Real-time updates on your application status',
    },
    {
      title: '24/7 Support',
      description: 'Expert assistance whenever you need help',
    },
  ];

  const steps = [
    { number: '01', title: 'Create Account', description: 'Sign up with email or mobile number' },
    { number: '02', title: 'Fill Application', description: 'Complete the visa application form' },
    { number: '03', title: 'Upload Documents', description: 'Submit required documents securely' },
    { number: '04', title: 'Track Status', description: 'Monitor your application in real-time' },
  ];

  const faqs = [
    {
      question: 'How long does visa processing take?',
      answer: 'Standard Israel visa processing typically takes 3-5 business days from the date of submission. However, processing times may vary depending on the visa type and individual circumstances. For urgent travel needs, we offer express processing services that can expedite your application within 24-48 hours (additional fees apply). Tourist visas generally have faster processing times compared to work or student visas. We recommend applying at least 2-3 weeks before your planned travel date to ensure sufficient time for processing and any potential additional document requests. Our team monitors your application throughout the process and will notify you immediately of any status changes or required actions.',
    },
    {
      question: 'What documents do I need?',
      answer: 'For a complete Israel visa application, you will need the following documents: (1) A valid passport with at least 6 months validity beyond your intended stay and at least 2 blank pages for visa stamps. (2) Recent passport-size photographs with white background (5.5cm x 5.5cm). (3) Completed visa application form with accurate information. (4) Detailed travel itinerary including flight bookings and accommodation confirmations. (5) Proof of financial means such as bank statements for the last 6 months showing sufficient funds. (6) Travel insurance covering medical emergencies and repatriation. (7) Employment letter or business registration documents. (8) Hotel reservations or invitation letter from Israel if visiting family/friends. Additional documents may be required based on your specific visa type - business visas require company documents, student visas need admission letters, and work visas require employment contracts.',
    },
    {
      question: 'Can I track my application status?',
      answer: 'Yes, absolutely! We provide a comprehensive real-time application tracking system accessible through your personal profile dashboard 24/7. Once you submit your visa application, you will receive a unique tracking number via email and SMS. Simply log into your account on our website to view the current status of your application, including processing stage, document verification status, and estimated completion date. Our tracking system provides detailed updates at each stage: submission received, documents under review, embassy processing, decision made, and visa ready for collection. You will also receive automated email and SMS notifications whenever there is a status update or if any additional documents are required. Our customer support team is available to answer any questions about your application status during business hours.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Data security and privacy protection are our top priorities. We implement bank-level 256-bit SSL encryption technology to protect all your personal information, passport details, and payment data during transmission and storage. Our platform complies with international data protection standards including GDPR (General Data Protection Regulation) and PCI DSS (Payment Card Industry Data Security Standard) for secure payment processing. All sensitive documents are stored on secure, encrypted servers with restricted access limited to authorized personnel only. We never share, sell, or distribute your personal information to third parties without your explicit consent. Regular security audits and penetration testing ensure our systems remain secure against emerging threats. Your passport information and application data are automatically deleted after visa processing completion (unless you choose to save them for future applications). We maintain comprehensive data backup systems to prevent any data loss.',
    },
    {
      question: 'What if my visa gets rejected?',
      answer: 'While our success rate exceeds 98%, in the rare event of a visa rejection, we provide comprehensive support and guidance for reapplication. First, we will help you understand the specific reasons for rejection by liaising with the embassy or consulate. Common rejection reasons include incomplete documentation, insufficient financial proof, or previous immigration violations - all of which can typically be addressed in a reapplication. Our experienced visa consultants will review your case, identify areas for improvement, and help you prepare a stronger application with proper documentation. We offer discounted rates for reapplications and can expedite the process where possible. If the rejection was due to administrative errors or missing documents, we often achieve approval on the second attempt within 1-2 weeks. Additionally, we provide guidance on appeal processes if applicable and can connect you with immigration lawyers for complex cases. Our team remains committed to helping you achieve your travel goals.',
    },
    {
      question: 'Can I apply for multiple visa types?',
      answer: 'Yes, you can apply for different types of Israel visas based on your specific travel purposes and needs. Israel offers various visa categories including tourist visas (B/2) for leisure travel and sightseeing, business visas (B/1) for attending meetings and conferences, student visas (A/2) for academic programs, work visas (B/1) for employment purposes, medical visas for receiving medical treatment, and transit visas for passing through Israel. Each visa type has specific requirements, validity periods, and permitted activities. For example, if you plan to attend a business conference and then tour the country, you might need a business visa that also allows tourism. Some travelers may require multiple-entry visas if they plan to visit Israel several times within a year. Our visa experts can advise you on the most appropriate visa type for your situation and help you understand the differences in processing times, costs, and documentation requirements for each category. You can also apply for visa extensions while in Israel if your travel plans change.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods for your convenience and security. You can pay using international credit cards (Visa, Mastercard, American Express), debit cards, UPI (Unified Payments Interface) for Indian customers, net banking from major Indian and international banks, digital wallets including PayPal, Google Pay, and Paytm, and bank transfers for larger transactions. All payments are processed through secure, PCI-compliant payment gateways with 3D Secure authentication for added security. We also offer installment payment options for visa fees exceeding certain amounts. Payment receipts and invoices are automatically generated and sent to your registered email address for your records. In case of visa rejection, our refund policy ensures that the visa processing fee (excluding government fees and service charges) is refunded according to our terms and conditions.',
    },
    {
      question: 'Do I need travel insurance for Israel visa?',
      answer: 'Yes, travel insurance is mandatory for Israel visa applications and must cover the entire duration of your stay in Israel. The insurance policy must provide minimum coverage of at least $30,000 USD (or equivalent) for medical emergencies, hospitalization, emergency medical evacuation, and repatriation of remains. Your travel insurance should specifically cover medical expenses, emergency dental treatment, trip cancellation or interruption, lost baggage, and personal liability. The insurance certificate must clearly state the coverage period matching your travel dates and the coverage amount. We recommend purchasing comprehensive travel insurance that includes COVID-19 coverage, as this may be required depending on current health regulations. Many insurance providers offer specialized visa insurance packages designed specifically for Israeli visa requirements. We can help you obtain suitable travel insurance if needed, or you may purchase it independently from reputable insurance companies. The insurance certificate must be submitted along with your visa application documents.',
    },
  ];

  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Israel Visa Application - Official Online Portal | Apply Now</title>
        <meta
          name="description"
          content="Apply for your Israel visa online. Fast, secure, and hassle-free visa application process. Track your application status in real-time. 24/7 support available."
        />
        <meta name="keywords" content="Israel visa, visa application, Israel travel, tourist visa, business visa, student visa" />
        <link rel="canonical" href="https://yourdomain.com/" />
        
        {/* Schema.org markup for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Israel Visa Application",
            "url": "https://yourdomain.com",
            "logo": "https://yourdomain.com/logo.png",
            "description": "Official Israel visa application portal",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IL"
            }
          })}
        </script>

        {/* Schema.org markup for FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="home-page">
        {/* Hero Section with Video */}
        <section className="hero-section">
          <div className="hero-video-container">
            <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%230038B8'/%3E%3C/svg%3E"
            >
              <source src="https://res.cloudinary.com/dlwn3lssr/video/upload/v1766214858/Israel_Visa_qxhftz.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content container">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Get Your Israel Visa Online 
                <br />
                {/* <span className="highlight">Fast & Secure Application Process</span> */}
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Fast, secure, and hassle-free visa application process.
                <br />
                Get your Israel visa in just 3-5 business days.
              </motion.p>
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  className="btn btn-primary btn-large"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 56, 184, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyClick}
                >
                  Apply for Israel Visa
                </motion.button>
                <Link to="/india-visa">
                  <motion.button
                    className="btn btn-secondary btn-large"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply for India Visa
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <motion.div
              className="features-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -10, boxShadow: 'var(--shadow-xl)' }}
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Visa Types Section */}
        <section className="visa-types-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Choose Your Visa Type</h2>
              <p>Select the visa that best suits your travel needs</p>
            </motion.div>

            <motion.div
              className="visa-types-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              {loadingVisas ? (
                <div className="loading-message">Loading visa types...</div>
              ) : visaTypes.length > 0 ? (
                visaTypes.map((visa, index) => (
                  <motion.div
                    key={visa._id || index}
                    className={`visa-card ${visa.popular ? 'popular' : ''}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ y: -10 }}
                  >
                    {visa.popular && <div className="popular-badge">Most Popular</div>}
                    <h3>{visa.name}</h3>
                    <div className="visa-duration">{visa.validity}</div>
                    <div className="visa-price">₹{visa.fee.inr.toLocaleString('en-IN')}</div>
                    <ul className="visa-features">
                      {visa.features && visa.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                    <button 
                      className={`btn ${visa.popular ? 'btn-primary' : 'btn-secondary'} btn-full-width`}
                      onClick={handleApplyClick}
                    >
                      Apply Now
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="no-visas-message">No visa types available at the moment.</div>
              )}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section" id="how-it-works">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>How It Works</h2>
              <p>Simple 4-step process to get your visa</p>
            </motion.div>

            <motion.div
              className="steps-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="step-card"
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about Israel visa applications</p>
            </motion.div>

            <motion.div
              className="faq-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={`faq-item ${openFaq === index ? 'active' : ''}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="faq-question">
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
                  </div>
                  <motion.div
                    className="faq-answer"
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Ready to Start Your Journey?</h2>
              <p>Join thousands of satisfied travelers who trusted us with their visa applications</p>
              <Link to="/apply">
                <motion.button
                  className="btn btn-primary btn-large"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply for Visa Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Eligibility Modal */}
      <EligibilityModal 
        isOpen={showEligibilityModal} 
        onClose={() => setShowEligibilityModal(false)} 
      />
    </>
  );
};

export default Home;
