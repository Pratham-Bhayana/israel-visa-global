const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure allowed origins
const getAllowedOrigins = () => {
  // Always include production domains as fallback
  const productionDomains = [
    'https://indoisraelvisa.com',
    'https://www.indoisraelvisa.com'
  ];
  
  if (process.env.NODE_ENV === 'production') {
    // Support comma-separated multiple origins in production
    let origins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')) // Remove trailing slashes
      : [];
    
    // Combine with production domains and remove duplicates
    const allOrigins = [...new Set([...origins, ...productionDomains])];
    
    console.log('Allowed origins in production:', allOrigins);
    return allOrigins;
  }
  
  // Development mode
  const devOrigins = [
    process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:3000',
    'http://localhost:3001',
    ...productionDomains // Also allow production domains in dev for testing
  ];
  
  console.log('Allowed origins in development:', devOrigins);
  return devOrigins;
};

const allowedOrigins = getAllowedOrigins();

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
})); // Security headers
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-user-name', 'x-user-uid'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Make io accessible to routes
app.set('io', io);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/adminEsim'));
app.use('/api/content', require('./routes/content'));
app.use('/api/visa-types', require('./routes/visaTypes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/admin/blogs', require('./routes/adminBlogs'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// CORS debug endpoint
app.get('/api/cors-debug', (req, res) => {
  res.status(200).json({
    success: true,
    allowedOrigins: allowedOrigins,
    requestOrigin: req.headers.origin,
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
  });
});

// 404 handler (returns 200 as per requirements)
app.use('*', (req, res) => {
  res.status(200).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const BASE_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_RETRIES = 10;
let activePort = BASE_PORT;

const startServer = () => {
  server.listen(activePort, () => {
    console.log(`🚀 Server running on port ${activePort}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 Socket.io enabled`);
  });
};

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    const nextPort = activePort + 1;

    if (nextPort > BASE_PORT + MAX_PORT_RETRIES) {
      console.error(`❌ Ports ${BASE_PORT}-${BASE_PORT + MAX_PORT_RETRIES} are all in use. Please free a port or set PORT.`);
      process.exit(1);
    }

    console.warn(`⚠️ Port ${activePort} is in use. Retrying on port ${nextPort}...`);
    activePort = nextPort;
    setTimeout(startServer, 200);
    return;
  }

  throw error;
});

startServer();

module.exports = { app, io };
