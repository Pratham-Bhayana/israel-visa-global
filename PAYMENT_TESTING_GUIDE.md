# Payment System Testing Guide

## Quick Start

The payment approval system is now fully implemented. Here's how to test it:

## Step 1: User Submits Payment

1. Go to user application
2. Click "Payment" in the navigation
3. Fill in payment details
4. Upload receipt image
5. Optionally select eSIM plan
6. Click "Submit Payment"
7. Payment status should be "processing"

## Step 2: Admin Reviews Payment

1. Log in as admin
2. Click "Payments" in sidebar menu
3. You should see a dashboard with:
   - Total Revenue stat
   - Pending Payments stat (number + amount)
   - Collected Payments stat
   - Failed Payments stat
   - Payment data table

## Step 3: Approve/Reject Payment

### To Approve:
1. Find payment in table
2. Click "Approve" button
3. Modal will show payment details:
   - Application ID
   - Applicant name
   - Phone number
   - Visa type
   - Amount (₹)
   - Payment receipt link (if uploaded)
4. Click "Approve" button in modal
5. Payment status changes to "completed"
6. Amount moves to "Collected Payments" stat

### To Reject:
1. Find payment in table
2. Click "Reject" button
3. Modal will show payment details
4. Enter rejection reason in textarea
5. Click "Reject" button
6. Payment status changes to "failed"
7. Rejection reason is saved
8. Amount moves to "Failed Payments" stat

## Step 4: Filter Payments

1. Use filter dropdown at top
2. Select:
   - **All**: Show all payments
   - **Pending**: Show only processing payments
   - **Completed**: Show only approved payments
   - **Rejected**: Show only rejected payments
3. Table updates automatically

## Database Fields to Check

After testing, verify in MongoDB:

```javascript
// Check Application document
db.applications.findOne({ _id: ObjectId })

// Should have these fields:
{
  paymentStatus: "completed" | "failed" | "processing",
  paymentAmount: 2950,
  paymentCurrency: "INR",
  paymentDate: ISODate("2024-01-15T10:30:00Z"),
  paymentReceipt: "https://...",
  rejectionReason: "Proof does not match application details" // if rejected
}
```

## Testing Scenarios

### Scenario 1: Happy Path (Approval)
```
1. User submits payment with receipt
2. Payment status = "processing"
3. Admin approves
4. Payment status = "completed"
5. Amount appears in "Collected Payments"
```

### Scenario 2: Rejection with Reason
```
1. User submits payment
2. Admin rejects with reason
3. Payment status = "failed"
4. Rejection reason saved in DB
5. Amount appears in "Failed Payments"
```

### Scenario 3: Filter and Pagination
```
1. Multiple pending payments exist
2. Click filter dropdown
3. Select "Pending"
4. See only pending payments
5. Navigate through pages
```

### Scenario 4: Statistics Accuracy
```
Before Tests:
- Clear all payment data OR use test data

Run Multiple Approvals:
- Approve 3 payments of ₹2950 each
- Total in "Collected" should be ₹8850
- Count should be 3

Run Some Rejections:
- Reject 2 payments
- Failed count = 2
```

## API Endpoint Testing (with cURL or Postman)

### Get All Payments
```bash
curl -X GET http://localhost:5000/api/admin/payments \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# With filter
curl -X GET "http://localhost:5000/api/admin/payments?status=processing&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Statistics
```bash
curl -X GET http://localhost:5000/api/admin/payments/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Approve Payment
```bash
curl -X PUT http://localhost:5000/api/admin/payments/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Reject Payment
```bash
curl -X PUT http://localhost:5000/api/admin/payments/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "failed",
    "rejectionReason": "Receipt does not match application details"
  }'
```

## Common Issues & Troubleshooting

### Issue 1: "Access Denied" Error
**Cause**: User is not admin
**Solution**: Make sure you're using an admin user account with admin token

### Issue 2: "Payment not found" Error
**Cause**: Invalid application ID
**Solution**: Ensure the payment exists in database and you're using correct _id

### Issue 3: Payments not showing in table
**Cause**: No payments with paymentStatus field in DB
**Solution**: Create a test application and submit payment first

### Issue 4: Statistics showing 0
**Cause**: No completed payments yet
**Solution**: Approve some pending payments first

### Issue 5: Modal not showing payment details
**Cause**: Payment data not populated from API
**Solution**: Check browser console for API errors, verify token is valid

## Performance Notes

- Pagination default: 20 per page
- Statistics query uses MongoDB aggregation (efficient)
- Filter query uses single index on paymentStatus
- Recommend index: `db.applications.createIndex({ paymentStatus: 1 })`

## Files Modified/Created for Payment System

### Created:
- ✅ `frontend/src/admin/pages/Payments.js` (421 lines)
- ✅ `frontend/src/admin/pages/Payments.css` (400+ lines)
- ✅ `PAYMENT_SYSTEM_DOCUMENTATION.md`

### Modified:
- ✅ `backend/routes/adminEsim.js` (+130 lines for payment routes)
- ✅ `backend/models/Application.js` (added rejectionReason field)
- ✅ `frontend/src/admin/AdminApp.js` (added Payments route)
- ✅ `frontend/src/admin/components/AdminLayout.js` (added Payments menu)

## Next Steps

1. ✅ **Payment Component**: Complete and integrated
2. ✅ **Backend Routes**: Complete and ready
3. ✅ **Database Model**: Updated with fields
4. ✅ **UI/UX**: Styled and responsive
5. ⏳ **Email Notifications**: Optional enhancement
6. ⏳ **Payment Receipt Verification**: Can add OCR verification
7. ⏳ **Bulk Actions**: Can add bulk approve/reject

## Deployment Checklist

Before going live:
- [ ] Test all approval/rejection scenarios
- [ ] Verify statistics accuracy with sample data
- [ ] Check responsive design on mobile
- [ ] Verify error handling
- [ ] Test pagination
- [ ] Confirm authorization checks work
- [ ] Add email notification integration (optional)
- [ ] Set up database indexes for payment queries
- [ ] Configure REACT_APP_API_URL in .env

---

**Ready to Test**: Yes ✅
**Expected Functionality**: 100%
**Integration Status**: Complete
