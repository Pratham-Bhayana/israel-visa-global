# 🚀 Razorpay Deployment Checklist

## Pre-Deployment Checklist

### ✅ Step 1: Add Environment Variables

Add these to your **backend environment** (Railway, Heroku, or your hosting provider):

```env
RAZORPAY_KEY_ID=rzp_live_S6rRrTChk9nKmm
RAZORPAY_KEY_SECRET=FueOCAesfJKbuVHdiTOFpPhp
```

### ✅ Step 2: Verify Dependencies

Both are already installed, but verify:

**Backend:**
```bash
cd backend
npm list razorpay
# Should show: razorpay@x.x.x
```

**Frontend:**
```bash
cd frontend
npm list razorpay
# Should show: razorpay@x.x.x
```

### ✅ Step 3: Test Locally (Optional)

Before deploying, test locally:

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend  
cd frontend
npm start
```

Then navigate to a payment page and click "Pay" to test.

### ✅ Step 4: Deploy Backend

Your backend already uses Railway. The new files will be deployed automatically:

**New/Modified Backend Files:**
- ✅ `backend/services/razorpayService.js` (NEW)
- ✅ `backend/routes/payment.js` (NEW)
- ✅ `backend/models/Application.js` (UPDATED - added payment field)
- ✅ `backend/server.js` (UPDATED - added payment route)
- ✅ `backend/package.json` (UPDATED - added razorpay)

**Important:** Make sure to add the environment variables in Railway dashboard:

1. Go to Railway Project
2. Click on your backend service
3. Go to "Variables" tab
4. Click "+ New Variable"
5. Add:
   - `RAZORPAY_KEY_ID` = `rzp_live_S6rRrTChk9nKmm`
   - `RAZORPAY_KEY_SECRET` = `FueOCAesfJKbuVHdiTOFpPhp`
6. Save and redeploy

### ✅ Step 5: Deploy Frontend

Your frontend uses Netlify. The updated files will be deployed automatically:

**Modified Frontend Files:**
- ✅ `frontend/src/pages/Payment.js` (UPDATED - Razorpay integration)
- ✅ `frontend/src/pages/Payment.css` (UPDATED - new styles)
- ✅ `frontend/package.json` (UPDATED - added razorpay)

**No frontend environment variables needed!** The Razorpay Key ID is fetched securely from the backend during order creation.

### ✅ Step 6: Verify Deployment

After deployment, check:

1. **Backend Health:**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should return: `{"success": true, "message": "Server is running"}`

2. **Test Payment Flow:**
   - Create a new visa application
   - Go to payment page
   - Click "Pay" button
   - Razorpay checkout should open
   - Complete a test payment

3. **Check Database:**
   - Verify application's `payment` field is updated
   - Verify `paymentStatus` changed to "completed"
   - Verify `status` changed to "under-review"

### ✅ Step 7: Monitor First Transaction

After first real payment:

1. Login to Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to Transactions → Payments
3. Verify payment appears with correct amount
4. Check application in your admin panel
5. Verify payment confirmation email was sent

---

## 🔍 Troubleshooting

### Issue: "Failed to create order"

**Solution:**
- Verify environment variables are set correctly in Railway
- Check backend logs for error messages
- Verify Razorpay account is active

### Issue: "Payment verification failed"

**Solution:**
- Check if `RAZORPAY_KEY_SECRET` is correct
- Verify signature verification logic
- Check backend logs for details

### Issue: Razorpay checkout doesn't open

**Solution:**
- Check browser console for errors
- Verify Razorpay script is loading (check Network tab)
- Clear browser cache and try again

---

## 📊 Monitoring

### Razorpay Dashboard

Monitor all transactions at: https://dashboard.razorpay.com

- **Payments**: View all successful/failed payments
- **Orders**: View all created orders
- **Refunds**: Issue refunds if needed
- **Settlements**: Track when money is transferred to your bank
- **Analytics**: View payment trends and statistics

### Your Application

Check in your admin panel:
- Total payments received
- Payment status of applications
- Failed payment attempts

---

## 💰 Razorpay Fees & Settlement

- **Transaction Fee**: 2% + GST (negotiable for higher volumes)
- **Settlement**: T+3 days (can upgrade to instant for additional fee)
- **Minimum Settlement**: None
- **Refund Fee**: Free

---

## 🎯 Quick Test Payment

Use these test details in **test mode** only:

**Test Card:**
- Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date
- Name: Test User

**Test UPI:**
- UPI ID: `success@razorpay`

**Test Net Banking:**
- Select any bank → Success

---

## ✅ Final Checklist

Before going live with real payments:

- [ ] Environment variables added in Railway
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Test payment completed successfully
- [ ] Payment verification working
- [ ] Application status updating correctly
- [ ] Payment confirmation email sending
- [ ] Razorpay Dashboard showing transaction
- [ ] Admin panel showing payment details
- [ ] Mobile responsive payment page tested

---

## 🎉 You're Ready!

Your Razorpay integration is complete and ready for production!

**Current Status:** ✅ READY FOR DEPLOYMENT

**Next Actions:**
1. Add environment variables to Railway
2. Deploy (push to main branch)
3. Test with a small transaction
4. Monitor first few payments closely
5. Enjoy automated payments! 🚀

---

## 📞 Support

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: 1800-120-020-020
- Dashboard: https://dashboard.razorpay.com

**For Integration Issues:**
- Check: `RAZORPAY_SETUP_GUIDE.md`
- Review: `PAYMENT_FLOW_DIAGRAM.md`
- Test: Run `node test-razorpay.js`

Good luck! 🎉
