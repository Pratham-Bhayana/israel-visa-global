# Netlify Frontend - Environment Variables

Copy and paste these into Netlify's environment variables section.
Replace the placeholder values with your actual credentials.

---

## Backend API URL (Railway)

**IMPORTANT:** Deploy backend to Railway first, then add the Railway URL here!

```
REACT_APP_API_URL=https://your-app.railway.app
```

**Note:** Do NOT include trailing slash!

---

## Firebase Configuration

Get from: https://console.firebase.google.com → Project Settings → Your apps → Web app

```
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

**Steps:**
1. Go to Firebase Console
2. Click on Settings (⚙️) → Project Settings
3. Scroll to "Your apps" section
4. Click on Web icon (</>) if no app exists
5. Copy all the config values

---

## Google OAuth

Get from: https://console.cloud.google.com/apis/credentials

```
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Steps:**
1. Go to Google Cloud Console
2. Select your project
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Copy the Client ID

---

## Cloudinary (File Uploads)

Get from: https://cloudinary.com/console → Settings → Upload

```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=israel-visa-uploads
```

**Steps:**
1. Login to Cloudinary
2. Go to Settings → Upload tab
3. Find "Upload presets" section
4. Create new preset (if not exists):
   - Name: `israel-visa-uploads`
   - Signing Mode: Unsigned
   - Save

---

## Quick Copy Template

Copy this entire block and paste into Netlify, then replace values:

```
REACT_APP_API_URL=https://your-app.railway.app
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=israel-visa-uploads
```

---

## How to Add Variables in Netlify

### Method 1: During Initial Setup
1. When creating site from Git
2. Click "Show advanced"
3. Click "New variable"
4. Add each variable one by one

### Method 2: After Site Created
1. Go to Site Settings
2. Click "Environment variables" in sidebar
3. Click "Add a variable"
4. Add each variable one by one
5. Click "Deploy site" to rebuild with new variables

---

## Build Settings

These should be auto-detected, but verify:

```
Build command: npm run build
Publish directory: build
```

---

## After Deployment

1. **Get your Netlify URL** (e.g., https://your-app-name.netlify.app)

2. **Update Firebase Authorized Domains:**
   - Go to Firebase Console → Authentication → Settings
   - Authorized domains tab
   - Add your Netlify URL

3. **Update Google OAuth:**
   - Go to Google Cloud Console → Credentials
   - Edit OAuth 2.0 Client ID
   - Add to Authorized JavaScript origins:
     - `https://your-app-name.netlify.app`
   - Add to Authorized redirect URIs:
     - `https://your-app-name.netlify.app`

4. **Update Railway Backend:**
   - Go to Railway → Your Project → Variables
   - Update `FRONTEND_URL` with your Netlify URL
   - Redeploy if needed

---

## Testing Your Deployment

1. **Visit your Netlify URL**
   - Should load without errors

2. **Check Browser Console (F12)**
   - Should see no errors
   - If you see Firebase errors, check Firebase config

3. **Test Authentication**
   - Try to register a new account
   - Try Google OAuth login

4. **Test Application Form**
   - Go to /apply
   - Select visa type
   - Check if it loads correctly

---

## Common Issues

### Site Shows "Page Not Found"
- Check Publish directory is set to `build`
- Check build completed successfully in Deploy logs

### API Requests Failing (Network Error)
- Verify `REACT_APP_API_URL` is correct Railway URL
- No trailing slash in API URL
- Railway backend is running (check Railway dashboard)

### Firebase Auth Not Working
- Check all Firebase config values are correct
- Ensure Netlify domain is added to Firebase authorized domains
- Check Firebase console for any errors

### Google OAuth Not Working
- Ensure Netlify URL is added to Google OAuth authorized origins
- Check redirect URIs are configured
- Verify Google Client ID is correct

### Images Not Uploading
- Check Cloudinary cloud name is correct
- Verify upload preset exists and is "unsigned"
- Check browser console for Cloudinary errors

---

## Environment Variable Naming

**IMPORTANT:** All frontend environment variables MUST start with `REACT_APP_`

❌ Wrong:
```
API_URL=https://...
FIREBASE_API_KEY=AIza...
```

✅ Correct:
```
REACT_APP_API_URL=https://...
REACT_APP_FIREBASE_API_KEY=AIza...
```

---

## Redeploy After Changes

If you update environment variables:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for build to complete
4. Test the changes

---

## Custom Domain (Optional)

To use your own domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to update DNS
4. Wait for DNS propagation (can take up to 48 hours)
5. SSL certificate will be automatically provisioned

---

## Netlify CLI (Alternative Method)

You can also deploy using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

---

## Deployment Logs

If build fails:
1. Go to Deploys tab
2. Click on failed deployment
3. View "Deploy log"
4. Look for error messages
5. Common errors:
   - Missing environment variables
   - Build command failed
   - Module not found

---

## Performance Optimization

Already configured in `netlify.toml`:
- ✅ SPA redirects (/* → /index.html)
- ✅ Security headers
- ✅ Static asset caching
- ✅ Build optimizations

---

## Next Steps

After successful Netlify deployment:
1. ✅ Test all functionality
2. ✅ Update Railway `FRONTEND_URL`
3. ✅ Update Firebase authorized domains
4. ✅ Update Google OAuth URLs
5. ✅ Run Lighthouse audit
6. ✅ Test on mobile devices

---

**Netlify Documentation:** https://docs.netlify.com
