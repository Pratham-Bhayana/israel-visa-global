# 🚀 Production Deployment Guide

## Complete guide to deploy Israel Visa Application to production

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account (for version control)
2. ✅ Netlify account (for frontend hosting)
3. ✅ Railway account (for backend hosting)
4. ✅ MongoDB Atlas account (for database)
5. ✅ Firebase account (for authentication)
6. ✅ Cloudinary account (for file uploads)
7. ✅ Gmail account with App Password (for email notifications)

---

## 🗄️ STEP 1: Setup MongoDB Atlas

### 1.1 Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is fine for testing)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `israel-visa`

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/israel-visa?retryWrites=true&w=majority
```

### 1.2 Configure Network Access
1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## 🔥 STEP 2: Setup Firebase

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2.2 Enable Authentication
1. Go to "Authentication" → "Get Started"
2. Enable "Email/Password" provider
3. Enable "Google" provider
   - Add your support email
   - Download the OAuth client configuration

### 2.3 Get Firebase Configuration
1. Go to Project Settings (⚙️ icon)
2. Scroll down to "Your apps"
3. Click on Web icon (</>) to add a web app
4. Copy the configuration object:

```javascript
{
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
}
```

### 2.4 Configure Authorized Domains
1. Go to "Authentication" → "Settings" → "Authorized domains"
2. Add your Netlify domain: `your-app-name.netlify.app`

---

## ☁️ STEP 3: Setup Cloudinary

### 3.1 Create Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account

### 3.2 Get Credentials
1. Go to Dashboard
2. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3.3 Create Upload Preset
1. Go to "Settings" → "Upload"
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Set Signing Mode to "Unsigned"
5. Name it: `israel-visa-uploads`
6. Save

---

## 📧 STEP 4: Setup Gmail App Password

### 4.1 Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

### 4.2 Create App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Name it "Israel Visa App"
4. Click "Generate"
5. Copy the 16-character password (no spaces)

---

## 🚂 STEP 5: Deploy Backend to Railway

### 5.1 Prepare Backend
1. Make sure all code is committed to Git
2. Push to GitHub:
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/yourusername/israel-visa-backend.git
git push -u origin main
```

### 5.2 Deploy on Railway
1. Go to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your backend repository
5. Railway will auto-detect Node.js and deploy

### 5.3 Configure Environment Variables
Click on your project → "Variables" → Add all these:

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB (from Step 1)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/israel-visa?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_very_secure_random_string_minimum_32_characters_long
JWT_EXPIRE=7d

# Frontend URL (will update after Netlify deployment)
FRONTEND_URL=https://your-app-name.netlify.app

# Email (from Step 4)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=Israel Visa Application <noreply@israelvisa.com>

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecureAdminPassword123!

# Cloudinary (from Step 3)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase (from Step 2)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"

# Google OAuth (from Step 2)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5.4 Get Railway Backend URL
1. After deployment, Railway will provide a URL
2. Copy the URL (e.g., `https://your-app.railway.app`)
3. **SAVE THIS URL** - you'll need it for frontend

### 5.5 Seed Database (Optional)
1. Go to Railway project → "Deploy" tab
2. Click on "View Logs"
3. Your backend should be running

To seed visa types, you can run scripts via Railway CLI or directly in MongoDB Atlas.

---

## 🌐 STEP 6: Deploy Frontend to Netlify

### 6.1 Prepare Frontend
1. Update `.env.production` in frontend folder:

```env
# Backend API URL (from Railway - Step 5.4)
REACT_APP_API_URL=https://your-app.railway.app

# Firebase (from Step 2.3)
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-app
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123

# Google OAuth (from Step 2.3)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Cloudinary (from Step 3.3)
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=israel-visa-uploads
```

2. Commit changes:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/israel-visa-frontend.git
git push -u origin main
```

### 6.2 Deploy on Netlify
1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your frontend repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Base directory:** (leave empty)

### 6.3 Configure Environment Variables
1. Go to Site settings → "Environment variables"
2. Add all variables from `.env.production` (Step 6.1)

### 6.4 Configure Custom Domain (Optional)
1. Go to "Domain settings"
2. Add your custom domain
3. Update DNS records as instructed

### 6.5 Get Netlify URL
1. After deployment, Netlify provides a URL
2. Copy the URL (e.g., `https://your-app-name.netlify.app`)

---

## 🔄 STEP 7: Update Cross-References

### 7.1 Update Backend FRONTEND_URL
1. Go to Railway project → Variables
2. Update `FRONTEND_URL` with your Netlify URL
3. Redeploy if needed

### 7.2 Update Firebase Authorized Domains
1. Go to Firebase Console → Authentication → Settings
2. Add your Netlify URL to authorized domains

### 7.3 Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add Authorized JavaScript origins:
   - `https://your-app-name.netlify.app`
5. Add Authorized redirect URIs:
   - `https://your-app-name.netlify.app`
   - `https://your-app-name.netlify.app/login`

---

## ✅ STEP 8: Verification & Testing

### 8.1 Test Backend
```bash
# Health check
curl https://your-app.railway.app/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### 8.2 Test Frontend
1. Visit your Netlify URL
2. Check browser console for errors
3. Try to:
   - ✅ Register a new account
   - ✅ Login with Google
   - ✅ Navigate to Apply page
   - ✅ Select visa type
   - ✅ Fill application form

### 8.3 Test Admin Panel
1. Go to `https://your-app-name.netlify.app/admin/login`
2. Login with admin credentials (from ADMIN_EMAIL and ADMIN_PASSWORD)
3. Check dashboard
4. View applications

### 8.4 Common Issues & Fixes

**CORS Errors:**
- Ensure FRONTEND_URL in Railway matches Netlify URL exactly
- Check Firebase authorized domains

**Database Connection:**
- Verify MongoDB connection string
- Check IP whitelist (should be 0.0.0.0/0)

**Firebase Auth Not Working:**
- Check Firebase configuration in frontend env variables
- Verify authorized domains in Firebase Console

**Images Not Uploading:**
- Check Cloudinary credentials
- Verify upload preset is "unsigned"

---

## 📊 STEP 9: Seed Initial Data

### 9.1 Create Admin User
You can create admin via Railway terminal or MongoDB directly.

**Option A: Via MongoDB Atlas**
1. Connect to your database
2. Go to Collections → `users`
3. Insert document:
```json
{
  "email": "admin@yourdomain.com",
  "password": "$2a$10$hashedpassword", // Use bcrypt to hash
  "role": "admin",
  "displayName": "Admin User",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Option B: Via Backend Script**
SSH into Railway or use their CLI to run:
```bash
node createAdmin.js
```

### 9.2 Seed Visa Types
Run the seeding scripts:
```bash
# For Israel visa types
node scripts/seedVisaTypes.js

# For India visa types  
node scripts/seedIndiaVisaTypes.js
```

---

## 🔒 STEP 10: Security Checklist

- ✅ All environment variables are set
- ✅ JWT secret is strong (minimum 32 characters)
- ✅ Admin password is secure
- ✅ MongoDB IP whitelist is configured
- ✅ Firebase security rules are set
- ✅ CORS is properly configured
- ✅ HTTPS is enabled (automatic on Netlify/Railway)
- ✅ API rate limiting is active
- ✅ Sensitive data is not in Git
- ✅ .env files are in .gitignore

---

## 📈 STEP 11: Monitoring & Maintenance

### 11.1 Setup Monitoring
- **Railway:** Built-in metrics and logs
- **Netlify:** Deploy notifications and analytics
- **MongoDB Atlas:** Performance metrics and alerts

### 11.2 Backup Strategy
- **Database:** MongoDB Atlas automatic backups
- **Code:** GitHub repository with regular commits
- **Files:** Cloudinary automatic storage

### 11.3 Updates & Maintenance
```bash
# Update backend
cd backend
git add .
git commit -m "Update description"
git push origin main
# Railway will auto-deploy

# Update frontend
cd frontend
git add .
git commit -m "Update description"
git push origin main
# Netlify will auto-deploy
```

---

## 🎉 Deployment Complete!

Your Israel Visa Application is now live in production!

- **Frontend:** https://your-app-name.netlify.app
- **Backend API:** https://your-app.railway.app
- **Admin Panel:** https://your-app-name.netlify.app/admin

---

## 📞 Support & Troubleshooting

If you encounter issues:

1. **Check Logs:**
   - Railway: Project → Deployments → View Logs
   - Netlify: Deploys → Select deployment → Deploy log

2. **Verify Environment Variables:**
   - Ensure all required variables are set
   - No typos in variable names
   - URLs don't have trailing slashes

3. **Test API Endpoints:**
   - Use Postman or curl to test backend
   - Check CORS headers in browser console

4. **Database Issues:**
   - Verify MongoDB Atlas connection
   - Check network access settings
   - Monitor connection limits

---

## 📝 Quick Reference

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-app.railway.app
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_GOOGLE_CLIENT_ID=...
REACT_APP_CLOUDINARY_CLOUD_NAME=...
REACT_APP_CLOUDINARY_UPLOAD_PRESET=...
```

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app-name.netlify.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASSWORD=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

**Last Updated:** December 30, 2025
**Version:** 1.0.0
