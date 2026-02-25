import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Styles
import './App.css';

// Critical pages - load immediately
import Home from './pages/Home';

// Lazy load non-critical pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Application = lazy(() => import('./pages/Application'));
const Profile = lazy(() => import('./pages/Profile'));
const Payment = lazy(() => import('./pages/Payment'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const IndiaVisa = lazy(() => import('./pages/IndiaVisa'));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1.2rem',
    color: '#0038B8'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/apply" element={<Application />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payment/:applicationId" element={<Payment />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/india-visa" element={<IndiaVisa />} />
                <Route path="/israel-evisa" element={<Application />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <WhatsAppFloat />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
