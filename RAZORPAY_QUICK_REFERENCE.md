# 🎯 Razorpay Integration - Quick Reference

## 🔑 API Credentials

```
Live Key ID:     rzp_live_S6rRrTChk9nKmm
Live Key Secret: FueOCAesfJKbuVHdiTOFpPhp
```

## 📝 Environment Variables

**Backend (.env):**
```env
RAZORPAY_KEY_ID=rzp_live_S6rRrTChk9nKmm
RAZORPAY_KEY_SECRET=FueOCAesfJKbuVHdiTOFpPhp
```

**Frontend:**
No environment variables needed (key fetched from backend)

## 🛠️ Quick Commands

```bash
# Install dependencies (already done)
cd backend && npm install razorpay
cd frontend && npm install razorpay

# Test integration
node test-razorpay.js

# Deploy
git add .
git commit -m "Integrate Razorpay payment gateway"
git push
```

## 🚀 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payment/create-order` | POST | Create payment order |
| `/api/payment/verify` | POST | Verify payment signature |
| `/api/payment/webhook` | POST | Razorpay webhooks |

## 💳 Payment Flow (30 seconds)

1. User clicks **"Pay"** button
2. Razorpay checkout opens
3. User completes payment
4. Payment verified automatically
5. Application status → "Under Review"
6. User redirected to profile

## 📁 Files to Know

**Backend:**
- `services/razorpayService.js` - Core payment logic
- `routes/payment.js` - API endpoints
- `models/Application.js` - Payment data structure

**Frontend:**
- `pages/Payment.js` - Payment UI & integration
- `pages/Payment.css` - Payment styles

## 🎨 Payment Methods Supported

✅ Credit/Debit Cards  
✅ UPI (Google Pay, PhonePe, Paytm)  
✅ Net Banking (50+ banks)  
✅ Wallets (Paytm, Mobikwik, etc.)  
✅ EMI Options

## 💰 Pricing Calculation

```javascript
Total Amount = Visa Fee + eSIM Price (if selected)
```

- **Visa Fee**: From `VisaType` model (admin controlled)
- **eSIM Fee**: Selected by user on payment page
- **Currency**: INR (Indian Rupees)

## 🔒 Security

✅ SHA256 HMAC signature verification  
✅ Server-side amount validation  
✅ Firebase auth required  
✅ 256-bit SSL encryption  
✅ PCI DSS compliant

## 📊 Dashboard Access

**Razorpay Dashboard:**
https://dashboard.razorpay.com

Monitor:
- All payments
- Successful/Failed transactions
- Refunds
- Settlement status
- Analytics

## ⚡ Quick Test

**Test in Live Mode:**
- Use real card/UPI
- Small amount (₹1-10)
- Verify in dashboard

**Test in Test Mode:**
- Change keys to test keys
- Card: 4111 1111 1111 1111
- UPI: success@razorpay

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Order creation fails | Check environment variables |
| Checkout doesn't open | Verify script loaded |
| Signature verification fails | Check secret key |
| Payment not updating | Check backend logs |

## 📞 Quick Support

**Razorpay:**
- 📧 support@razorpay.com
- 📱 1800-120-020-020
- 🌐 https://razorpay.com/support

## ✅ Deployment Steps

1. Add env vars to Railway → `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
2. Push to Git → Auto-deploys backend & frontend
3. Test payment → Create app → Go to payment → Pay
4. Verify → Check dashboard & application status
5. Done! 🎉

## 📚 Documentation

- **Setup Guide**: `RAZORPAY_SETUP_GUIDE.md`
- **Integration Summary**: `RAZORPAY_INTEGRATION_COMPLETE.md`
- **Payment Flow**: `PAYMENT_FLOW_DIAGRAM.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`

## 💡 Pro Tips

- Always test with small amounts first
- Monitor first 10-20 transactions closely
- Keep API keys secure (never commit to Git)
- Setup webhooks for redundancy
- Enable 2FA on Razorpay account

---

**Status**: ✅ Integration Complete - Ready for Production

**Last Updated**: January 22, 2026
