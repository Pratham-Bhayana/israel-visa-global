# Railway Backend - Environment Variables

Copy and paste these into Railway's environment variables section.
Replace the placeholder values with your actual credentials.

---

## Server Configuration

```
PORT=5000
NODE_ENV=production
```

---

## Database (MongoDB Atlas)

Get this from: https://cloud.mongodb.com → Connect → Connect your application

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/israel-visa?retryWrites=true&w=majority
```

**Important:** Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster0.xxxxx` with your actual cluster URL

---

## JWT Authentication

Generate a secure random string (minimum 32 characters):

```
JWT_SECRET=use_a_very_secure_random_string_minimum_32_characters_long_abcdef123456
JWT_EXPIRE=7d
```

To generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend URL

**IMPORTANT:** After deploying to Netlify, come back and update this!

```
FRONTEND_URL=https://your-app-name.netlify.app
```

---

## Email Configuration (Gmail)

Get App Password from: https://myaccount.google.com/apppasswords

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-without-spaces
EMAIL_FROM=Israel Visa Application <noreply@israelvisa.com>
```

**Steps to get Gmail App Password:**
1. Enable 2-Step Verification on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Name it "Israel Visa Backend"
5. Copy the 16-character password (remove spaces)

---

## Admin Configuration

Set your admin credentials (used for /admin/login):

```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChooseAVerySecurePassword123!@#
```

**Note:** Make sure to remember these credentials!

---

## Cloudinary (File Uploads)

Get from: https://cloudinary.com/console

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key_numbers
CLOUDINARY_API_SECRET=your_api_secret_alphanumeric
```

**Steps:**
1. Login to Cloudinary
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

---

## Google OAuth

Get from: https://console.cloud.google.com/apis/credentials

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_alphanumeric
```

**Steps:**
1. Go to Google Cloud Console
2. Create/Select project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Copy Client ID and Client Secret

---

## Firebase Admin (Optional)

Get from: https://console.firebase.google.com → Project Settings → Service Accounts

```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Note:** Keep quotes around FIREBASE_PRIVATE_KEY and include \n for line breaks

---

## Optional: Payment Gateway

Only if you're implementing payment gateway:

```
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET=your_payment_secret_key
```

---

## Quick Copy Template

Copy this entire block and paste into Railway, then replace values:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/israel-visa?retryWrites=true&w=majority
JWT_SECRET=generate_secure_random_32_character_minimum_string_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app-name.netlify.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Israel Visa <noreply@israelvisa.com>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

## After Adding Variables

1. Click "Deploy" or wait for auto-deploy
2. Check "Deployments" tab for logs
3. Look for "MongoDB Connected Successfully" message
4. Copy your Railway URL (e.g., https://your-app.railway.app)
5. Test: `curl https://your-app.railway.app` should return API message

---

## Troubleshooting

### Deployment Failed
- Check Railway logs for specific error
- Ensure all required variables are set
- Check MongoDB connection string format

### MongoDB Connection Error
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Ensure database user has correct permissions

### Port Already in Use
- Don't set PORT manually, Railway assigns it automatically
- If you must set it, use PORT=5000

---

## Next Steps

After Railway deployment is successful:
1. Copy your Railway URL
2. Go to Netlify and add it as `REACT_APP_API_URL`
3. Come back to Railway and update `FRONTEND_URL` with Netlify URL
4. Redeploy if needed

---

**Railway Documentation:** https://docs.railway.app
