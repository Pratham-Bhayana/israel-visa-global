import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './admin/AdminApp';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from './reportWebVitals';

// Determine which app to render based on the URL path
const isAdminRoute = window.location.pathname.startsWith('/admin');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {isAdminRoute ? <AdminApp /> : <App />}
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
