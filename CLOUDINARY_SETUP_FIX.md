# Cloudinary Upload Preset Setup - REQUIRED

## The Problem
❌ 400 Bad Request when uploading - Upload preset doesn't exist

## The Solution
You must create an **Unsigned Upload Preset** in your Cloudinary dashboard.

---

## Step-by-Step Setup

### 1. Go to Cloudinary Dashboard
```
https://cloudinary.com/console
```

### 2. Navigate to Upload Settings
- Left sidebar → **Settings** (gear icon)
- Look for **Upload** tab
- Find **Upload presets** section

### 3. Create New Upload Preset
- Click **Add upload preset** button
- Fill in the form:

| Field | Value |
|-------|-------|
| Preset Name | `israel_visa_documents` |
| Mode | **Unsigned** |
| Signing Mode | Unsigned |

### 4. Configure Folder Settings (Optional but Recommended)
- **Folder** → `israel-visa/payments`
- This organizes uploaded files in Cloudinary

### 5. File Settings (Optional)
- **Max file size** → 50 MB (or desired size)
- **Allowed file types** → jpg, jpeg, png, pdf
- Click **Save**

### 6. Verify It's Created
- Go back to Settings → Upload tab
- You should see `israel_visa_documents` in the list
- Status should show: **Unsigned**

---

## Why This is Required

### What is an Upload Preset?
An upload preset is a configuration that tells Cloudinary:
- What folder to store files in
- What transformations to apply
- What file types are allowed
- Maximum file sizes

### Why Unsigned?
- **Unsigned**: Anyone can upload without API secret (safe for frontend)
- **Signed**: Requires secret key on backend (for sensitive operations)

---

## What the Code Does

### Current Setup
```javascript
// cloudinary.js
const cloudinaryConfig = {
  cloudName: 'dlwn3lssr',              // Your cloud name
  uploadPreset: 'israel_visa_documents', // Must match preset name
};
```

### Upload Process
1. User selects receipt file
2. Frontend creates FormData with:
   - `file`: The receipt image
   - `upload_preset`: `israel_visa_documents` (matches preset)
   - `folder`: `israel-visa/payments` (subfolder)
3. Sends to: `https://api.cloudinary.com/v1_1/dlwn3lssr/image/upload`
4. Cloudinary validates the preset exists and settings
5. Returns `secure_url` of uploaded file

---

## Common Issues & Solutions

### Issue 1: "Invalid Upload Preset"
**Error**: 400 Bad Request
**Cause**: Preset doesn't exist in dashboard
**Solution**: Create the preset following steps above

### Issue 2: "Preset Not Found"
**Error**: 401 Unauthorized
**Cause**: Wrong preset name or cloud name
**Solution**: Verify in dashboard, check spelling

### Issue 3: "File too large"
**Error**: 413 Payload Too Large
**Cause**: File exceeds preset limit
**Solution**: In preset settings, increase max file size

### Issue 4: "Invalid file type"
**Error**: 400 Bad Request with file validation error
**Cause**: File type not allowed in preset
**Solution**: In preset settings, add file type to allowed list

---

## Testing After Setup

### 1. Navigate to Payment Page
```
http://localhost:3000/apply
→ Fill form
→ Click "Next" until payment
```

### 2. Upload Receipt
- Select image file (JPG, PNG)
- Click "Submit Payment"
- Check browser console (F12 → Console tab)

### 3. Expected Console Output
```
✅ Upload successful: https://res.cloudinary.com/dlwn3lssr/image/upload/...
✅ Payment submitted: {success: true}
✅ Application payment status: pending_approval
```

### 4. Verify in Admin Panel
```
http://localhost:3000/admin/payments
→ Should see new payment with receipt link
→ Click link to view uploaded receipt
```

---

## Cloud Name Reference

Your cloud name from config:
```
dlwn3lssr
```

This is automatically set in `cloudinary.js` file.

---

## File Size Recommendations

| File Type | Max Size |
|-----------|----------|
| Receipt Screenshot | 5 MB |
| Bank Statement PDF | 10 MB |
| Payment Proof | 50 MB |

---

## Security Notes

✅ **Safe**: Upload preset is unsigned (frontend use)
✅ **Secure**: Only preset-specified folders allowed
✅ **Validated**: Cloudinary validates file type
✅ **Private**: Files stored in secure cloud

---

## Troubleshooting Checklist

- [ ] Preset name is exactly: `israel_visa_documents`
- [ ] Preset mode is: **Unsigned**
- [ ] Cloud name is: `dlwn3lssr`
- [ ] Upload preset exists in Cloudinary dashboard
- [ ] Browser console shows upload URL (not error)
- [ ] Payment submits successfully
- [ ] Admin panel shows receipt link
- [ ] Receipt link is clickable and shows file

---

## Next Steps After Setup

1. ✅ Create upload preset in Cloudinary
2. ✅ Test payment submission
3. ✅ Verify admin panel
4. ✅ Check receipt link works
5. ✅ Test approval/rejection workflow

---

## Code Fix Applied

The Payment.js file has been updated to use the correct Cloudinary endpoint:

**Before**:
```javascript
// WRONG - /auto/upload doesn't exist
`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`
```

**After**:
```javascript
// CORRECT - /image/upload is the right endpoint
`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
```

---

## Expected Behavior After Fix

1. User selects receipt file
2. **Upload starts** → Shows loading spinner
3. **Upload completes** → File sent to Cloudinary
4. **Backend receives URL** → Saves to database
5. **Confirmation shown** → "Payment submitted successfully"
6. **Admin sees payment** → In /admin/payments with receipt link

---

## Status

✅ **Code Fixed**: Payment.js now uses correct endpoint
⏳ **Action Required**: Create upload preset in Cloudinary dashboard

**Estimated Time**: 5 minutes to complete

---

**Reference**: [Cloudinary Upload API](https://cloudinary.com/documentation/upload_widget)
