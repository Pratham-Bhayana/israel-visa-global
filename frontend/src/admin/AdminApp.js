import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';
import Users from './pages/Users';
import Blogs from './pages/Blogs';
import BlogEditor from './pages/BlogEditor';
import VisaTypes from './pages/VisaTypes';
import Esims from './pages/Esims';
import Payments from './pages/Payments';

// Components
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

import './Admin.css';

function AdminApp() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/applications" element={<Applications />} />
            <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/blogs" element={<Blogs />} />
            <Route path="/admin/blogs/create" element={<BlogEditor />} />
            <Route path="/admin/blogs/edit/:id" element={<BlogEditor />} />
            <Route path="/admin/visa-types" element={<VisaTypes />} />
            <Route path="/admin/esims" element={<Esims />} />
            <Route path="/admin/payments" element={<Payments />} />
          </Route>
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default AdminApp;
