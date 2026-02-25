# Razorpay Integration Setup Guide

## Environment Variables Required

Add the following environment variables to your backend `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_S6rRrTChk9nKmm
RAZORPAY_KEY_SECRET=FueOCAesfJKbuVHdiTOFpPhp
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Frontend Environment Variables

Add to your frontend `.env` file (if needed):

```env
# No frontend-specific Razorpay variables needed
# The key ID is fetched from the backend during order creation for security
```

## How It Works

### Payment Flow:

1. **User Clicks "Pay" Button**
   - Frontend calls `/api/payment/create-order` endpoint
   - Backend creates a Razorpay order with amount from visa type + eSIM (if selected)

2. **Razorpay Checkout Opens**
   - User sees Razorpay payment gateway with all payment options
   - Supports: UPI, Cards, Net Banking, Wallets, etc.

3. **Payment Completion**
   - On successful payment, Razorpay calls the `handler` function
   - Frontend calls `/api/payment/verify` to verify the signature
   - Backend verifies signature using Razorpay secret

4. **Update Application**
   - Payment details stored in application
   - Application status changed to 'under-review'
   - Payment confirmation email sent
   - User redirected to profile page

### Security Features:

- ✅ Payment signature verification using SHA256 HMAC
- ✅ Server-side validation of all payments
- ✅ Razorpay Key ID fetched from backend (never exposed in frontend code)
- ✅ Amount calculated on server to prevent tampering
- ✅ 256-bit SSL encryption by Razorpay

### Webhook Setup (Optional):

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-backend-url.com/api/payment/webhook`
3. Select events: payment.captured, payment.failed, order.paid
4. Copy webhook secret and add to RAZORPAY_WEBHOOK_SECRET in .env

## Testing

### Test Mode (for development):

1. Use test API keys from Razorpay Dashboard
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=test_secret_xxxxxxxxxxxxxx
   ```

2. Test card numbers:
   - Success: 4111 1111 1111 1111
   - Failure: 4012 0010 0000 0007
   - CVV: Any 3 digits
   - Expiry: Any future date

3. Test UPI IDs:
   - Success: success@razorpay
   - Failure: failure@razorpay

### Live Mode (for production):

Use the live keys provided:
```env
RAZORPAY_KEY_ID=rzp_live_S6rRrTChk9nKmm
RAZORPAY_KEY_SECRET=FueOCAesfJKbuVHdiTOFpPhp
```

## Features Implemented:

✅ Dynamic pricing from admin panel (fetched via visa type)
✅ eSIM addon pricing support
✅ Multiple payment methods (UPI, Cards, Net Banking, Wallets)
✅ Payment verification with signature
✅ Automatic application status update
✅ Payment confirmation email
✅ Payment history stored in database
✅ Secure checkout with SSL encryption
✅ Mobile responsive payment interface

## Pricing Structure:

- **Visa Fee**: Fetched from VisaType model (admin can update)
- **eSIM Fee**: Selected by user from available plans
- **Total**: Visa Fee + eSIM Fee (if selected)

All prices are in INR and converted to paise (multiply by 100) for Razorpay API.

## Support:

For any payment-related issues:
1. Check Razorpay Dashboard > Payments for transaction status
2. Verify webhook logs if configured
3. Check application logs for any errors
4. Contact Razorpay support if needed

## Files Modified:

- ✅ `backend/services/razorpayService.js` - Razorpay service layer
- ✅ `backend/routes/payment.js` - Payment API endpoints
- ✅ `backend/models/Application.js` - Added payment field
- ✅ `backend/server.js` - Added payment route
- ✅ `frontend/src/pages/Payment.js` - Razorpay integration
- ✅ `backend/package.json` - Added razorpay dependency
- ✅ `frontend/package.json` - Added razorpay dependency
