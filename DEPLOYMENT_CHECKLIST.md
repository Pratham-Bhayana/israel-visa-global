# 🚀 Quick Deployment Checklist

Use this checklist to ensure smooth deployment without errors.

## Pre-Deployment Checklist

### ✅ 1. Backend Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database connection string obtained
- [ ] IP whitelist set to 0.0.0.0/0 (allow all)
- [ ] Database user created with read/write permissions

### ✅ 2. Firebase Setup
- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled
- [ ] Firebase configuration obtained
- [ ] Support email added to Google provider

### ✅ 3. Cloudinary Setup
- [ ] Cloudinary account created
- [ ] Cloud name, API key, and API secret obtained
- [ ] Upload preset created (unsigned mode)
- [ ] Upload preset name: `israel-visa-uploads`

### ✅ 4. Email Setup
- [ ] Gmail 2-Step Verification enabled
- [ ] App password generated (16 characters)
- [ ] SMTP settings ready

## Railway Deployment (Backend)

### ✅ 5. Code Preparation
- [ ] All backend code committed to Git
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.example` file is committed
- [ ] `package.json` has correct start script: `"start": "node server.js"`
- [ ] Pushed to GitHub repository

### ✅ 6. Railway Configuration
- [ ] Railway project created from GitHub repo
- [ ] All environment variables added (see below)
- [ ] Deployment successful (green checkmark)
- [ ] Railway URL obtained (e.g., `https://your-app.railway.app`)

**Required Environment Variables for Railway:**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=minimum_32_character_secure_random_string
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app-name.netlify.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Israel Visa <noreply@israelvisa.com>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### ✅ 7. Test Backend
- [ ] Visit `https://your-app.railway.app` - should see "Israel Visa Application API"
- [ ] Check Railway logs for any errors
- [ ] Database connected successfully (check logs)

## Netlify Deployment (Frontend)

### ✅ 8. Code Preparation
- [ ] Create `.env.production` with Railway backend URL
- [ ] All frontend code committed to Git
- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` file is committed
- [ ] `netlify.toml` file exists in frontend root
- [ ] Pushed to GitHub repository

### ✅ 9. Netlify Configuration
- [ ] Netlify site created from GitHub repo
- [ ] Build command: `npm run build`
- [ ] Publish directory: `build`
- [ ] All environment variables added (see below)
- [ ] Deployment successful (green checkmark)
- [ ] Netlify URL obtained (e.g., `https://your-app-name.netlify.app`)

**Required Environment Variables for Netlify:**
```
REACT_APP_API_URL=https://your-app.railway.app
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-app
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=israel-visa-uploads
```

### ✅ 10. Update Cross-References
- [ ] Update Railway `FRONTEND_URL` with Netlify URL
- [ ] Redeploy Railway backend if needed
- [ ] Add Netlify URL to Firebase authorized domains
- [ ] Add Netlify URL to Google OAuth authorized origins
- [ ] Add Netlify URL to Google OAuth redirect URIs

## Post-Deployment Testing

### ✅ 11. Frontend Testing
- [ ] Website loads without errors
- [ ] No console errors in browser
- [ ] Images and styles load correctly
- [ ] Navigation works properly

### ✅ 12. Authentication Testing
- [ ] Email/Password registration works
- [ ] Email/Password login works
- [ ] Google OAuth login works
- [ ] User profile displays correctly
- [ ] Logout works

### ✅ 13. Application Flow Testing
- [ ] Can access /apply page
- [ ] Country selection works
- [ ] Visa type selection works
- [ ] Form validation works
- [ ] File upload works (passport, documents)
- [ ] Application submission works
- [ ] Receives application number

### ✅ 14. Admin Panel Testing
- [ ] Can access /admin/login
- [ ] Admin login works
- [ ] Dashboard displays data
- [ ] Can view applications list
- [ ] Can view application details
- [ ] Can update application status
- [ ] Can add admin notes
- [ ] Can manage visa types
- [ ] Can manage blogs
- [ ] Can view users

### ✅ 15. API Testing
Test these endpoints:
- [ ] GET `https://your-app.railway.app/` → Returns API message
- [ ] GET `https://your-app.railway.app/api/visa-types?country=Israel` → Returns visa types
- [ ] POST `https://your-app.railway.app/api/auth/login` → Login works

## Common Issues & Quick Fixes

### CORS Errors
- ✅ Check `FRONTEND_URL` in Railway matches Netlify URL exactly
- ✅ No trailing slash in URLs
- ✅ Railway backend redeployed after URL update

### Firebase Auth Not Working
- ✅ Check Firebase config in Netlify env variables
- ✅ Netlify URL added to Firebase authorized domains
- ✅ Google OAuth redirect URIs updated

### Database Connection Failed
- ✅ MongoDB connection string is correct
- ✅ Database password doesn't contain special characters (or URL-encoded)
- ✅ IP whitelist is 0.0.0.0/0
- ✅ Database user has correct permissions

### Images Not Uploading
- ✅ Cloudinary credentials correct in env variables
- ✅ Upload preset is "unsigned"
- ✅ Upload preset name matches exactly

### API Requests Failing
- ✅ `REACT_APP_API_URL` points to Railway URL
- ✅ Railway backend is running (check deployment status)
- ✅ Check Railway logs for errors
- ✅ Check browser network tab for actual error

### Admin Can't Login
- ✅ Admin user exists in database
- ✅ Admin credentials match `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- ✅ Check Railway logs for authentication errors

## Deployment Success Criteria

✅ **All these should work without errors:**

1. Homepage loads with no console errors
2. User can register and login
3. Google OAuth works
4. User can start an application
5. File uploads work
6. Application can be submitted
7. Admin can login
8. Admin can view applications
9. Admin can update application status
10. Email notifications are sent (if configured)

## Final Verification Commands

```bash
# Test backend health
curl https://your-app.railway.app/

# Test visa types API
curl https://your-app.railway.app/api/visa-types?country=Israel

# Check frontend build
# Visit: https://your-app-name.netlify.app
# Open DevTools Console - should see no errors
```

## Security Final Check

- [ ] `.env` files not committed to Git
- [ ] All sensitive credentials are in environment variables
- [ ] JWT secret is strong (minimum 32 characters)
- [ ] Admin password is secure
- [ ] HTTPS is enabled (automatic on Netlify/Railway)
- [ ] CORS is properly configured
- [ ] MongoDB IP whitelist configured

---

## 🎉 If all checks pass, your deployment is successful!

**Your application is now live:**
- Frontend: https://your-app-name.netlify.app
- Backend: https://your-app.railway.app
- Admin: https://your-app-name.netlify.app/admin

---

## Need Help?

Refer to the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.
