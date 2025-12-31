import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Israel Visa Application</title>
        <meta name="description" content="The page you are looking for could not be found" />
      </Helmet>

      <div className="notfound-page">
        <div className="notfound-container container">
          <motion.div
            className="notfound-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="notfound-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, delay: 0.2, type: 'spring' }}
            >
              404
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Page Not Found
            </motion.h1>

            <motion.p
              className="notfound-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Oops! The page you're looking for seems to have wandered off.
              <br />
              Don't worry, we'll help you find your way back.
            </motion.p>

            <motion.div
              className="notfound-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/">
                <motion.button
                  className="btn btn-primary btn-large"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go Home
                </motion.button>
              </Link>
              <Link to="/apply">
                <motion.button
                  className="btn btn-secondary btn-large"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply for Visa
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="notfound-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h3>Popular Links</h3>
              <div className="quick-links">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/profile">My Profile</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
