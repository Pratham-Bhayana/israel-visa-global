# CORS Issue Fix Guide

## Problem
Frontend at `https://indoisraelvisa.com` cannot access backend at `https://israel-visa-global-production.up.railway.app` due to CORS policy.

## Solution Steps

### 1. Update Railway Environment Variable

Go to Railway Dashboard → Your Project → Variables and set:

**For single domain:**
```
FRONTEND_URL=https://indoisraelvisa.com
```

**For multiple domains (www and non-www):**
```
FRONTEND_URL=https://indoisraelvisa.com,https://www.indoisraelvisa.com
```

### 2. Verify NODE_ENV

Make sure `NODE_ENV` is set to `production` in Railway:
```
NODE_ENV=production
```

### 3. Deploy Changes

1. Commit and push the updated `server.js` to your repository
2. Railway will automatically redeploy
3. Or manually redeploy from Railway dashboard

### 4. Verify Fix

After deployment, check:
1. Visit `https://indoisraelvisa.com`
2. Open browser DevTools (F12) → Network tab
3. Refresh the page
4. Check if the API requests succeed
5. Response headers should include:
   ```
   Access-Control-Allow-Origin: https://indoisraelvisa.com
   ```

## What Changed

The backend now:
- Accepts comma-separated multiple origins in `FRONTEND_URL`
- Properly configures CORS for both Express and Socket.io
- Supports both development and production environments

## Troubleshooting

If still not working:

1. **Clear browser cache** and hard refresh (Ctrl + Shift + R)
2. **Check Railway logs** for any deployment errors
3. **Verify environment variables** are saved correctly
4. **Test API directly** using Postman or curl with origin header:
   ```bash
   curl -H "Origin: https://indoisraelvisa.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://israel-visa-global-production.up.railway.app/api/visa-types
   ```

## Common Mistakes

- ❌ Using `http://` instead of `https://` for production URL
- ❌ Forgetting to include both www and non-www versions
- ❌ Not setting `NODE_ENV=production` on Railway
- ❌ Trailing slashes in URLs (use without trailing slash)
