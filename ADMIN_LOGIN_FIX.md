# Admin Login 500 Error - Troubleshooting Guide

## Issue
Getting 500 Internal Server Error when trying to login at `/api/auth/login`

## Changes Made

### 1. Enhanced Error Logging
- Added detailed console logging to track login attempts
- Better error messages for debugging
- Stack trace in development mode

### 2. Improved Password Handling
- Added try-catch blocks in password hashing and comparison
- Better handling of OAuth users (users without passwords)
- Added validation for missing passwords

### 3. Created Admin User Script
- New script to create/update admin user: `backend/scripts/createAdmin.js`

### 4. Added Test Endpoint
- New endpoint: `GET /api/auth/test` to check authentication system health

## How to Fix

### Step 1: Check Environment Variables on Railway

Make sure these variables are set in Railway:

```bash
JWT_SECRET=your_secure_random_string_minimum_32_characters
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/israel-visa
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
NODE_ENV=production
```

**Generate JWT_SECRET** (run this locally):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Deploy Updated Code to Railway

1. Commit these changes:
```bash
git add .
git commit -m "Fix admin login with better error handling"
git push
```

2. Railway will auto-deploy (or manually redeploy from Railway dashboard)

### Step 3: Test the Auth System

Visit: `https://israel-visa-global-production.up.railway.app/api/auth/test`

You should see:
```json
{
  "success": true,
  "status": {
    "jwtSecretConfigured": true,
    "mongodbConnected": true,
    "totalUsers": X,
    "adminUsers": X,
    "bcryptAvailable": true
  }
}
```

If `jwtSecretConfigured` is `false` or `adminUsers` is `0`, continue to next steps.

### Step 4: Create Admin User

#### Option A: Via Railway CLI (Recommended)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and run:
```bash
railway login
railway link
railway run node backend/scripts/createAdmin.js
```

#### Option B: Via Railway Web Terminal

1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Settings" → "Deploy" → "Command"
4. Temporarily change start command to:
```
node backend/scripts/createAdmin.js
```
5. Wait for deployment, check logs for admin credentials
6. Change start command back to:
```
node backend/server.js
```

#### Option C: Via MongoDB Directly

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find `users` collection
4. Click "INSERT DOCUMENT"
5. Add this document (replace email/password):
```json
{
  "email": "admin@yourdomain.com",
  "password": "$2a$12$[HASHED_PASSWORD]",
  "displayName": "Admin",
  "role": "admin",
  "authProvider": "email",
  "isActive": true,
  "createdAt": {"$date": "2026-01-02T00:00:00.000Z"},
  "updatedAt": {"$date": "2026-01-02T00:00:00.000Z"}
}
```

Note: For Option C, you'll need to hash the password first. Use this script locally:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('YourPassword123!', 12).then(hash => console.log(hash));
```

### Step 5: Check Railway Logs

1. Go to Railway dashboard
2. Click "Deployments" tab
3. Look for:
   - ✅ MongoDB Connected Successfully
   - Any login attempt logs
   - Error messages

### Step 6: Test Login

Try logging in again at your admin panel. Check browser console and network tab for details.

## Common Issues & Solutions

### Issue: "User has no password (OAuth user)"
**Solution**: The email exists but was created via Google/Firebase login. Either:
- Use a different email for admin
- Delete the user from MongoDB and recreate

### Issue: "Invalid credentials"
**Solution**: 
- Double-check email and password
- Ensure admin user exists with `role: 'admin'`
- Verify password was hashed correctly

### Issue: "JWT_SECRET not configured"
**Solution**: Set JWT_SECRET environment variable in Railway

### Issue: "MongoDB Connection Error"
**Solution**: 
- Check MONGODB_URI format
- Ensure IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- Verify database user has read/write permissions

## Debugging Steps

1. **Check Test Endpoint**:
   ```bash
   curl https://israel-visa-global-production.up.railway.app/api/auth/test
   ```

2. **Check Health Endpoint**:
   ```bash
   curl https://israel-visa-global-production.up.railway.app/api/health
   ```

3. **Test Login with curl**:
   ```bash
   curl -X POST https://israel-visa-global-production.up.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@yourdomain.com","password":"YourPassword123!"}'
   ```

4. **Check Railway Logs**: Look for detailed error messages we added

## Need More Help?

If the issue persists after following these steps:

1. Check Railway logs for the exact error message
2. Verify all environment variables are set
3. Test the `/api/auth/test` endpoint
4. Share the Railway logs output

## Files Modified

- `backend/routes/auth.js` - Enhanced login endpoint with logging
- `backend/models/User.js` - Improved password handling
- `backend/scripts/createAdmin.js` - New admin creation script
- `ADMIN_LOGIN_FIX.md` - This troubleshooting guide
