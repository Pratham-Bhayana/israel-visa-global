# Payment Management System Documentation

## Overview
Complete payment approval and management system for visa applications with eSIM integration. Admins can view, approve, and reject user payments with comprehensive statistics and filtering.

## Features

### 1. Payment Status Workflow
- **pending**: Initial status when application is created
- **processing**: User uploads payment receipt for manual verification
- **completed**: Admin approves the payment
- **failed**: Admin rejects the payment with a reason
- **refunded**: Payment has been refunded to user

### 2. User Payment Flow (Frontend)
Users can submit payments through the Payment page:
1. User fills in payment details
2. User uploads payment receipt (image/PDF)
3. User selects optional eSIM plan
4. Payment is submitted with receipt
5. Payment status becomes "processing"
6. User can view pending status in their Profile

### 3. Admin Payment Management (Backend)

#### Admin Permissions
All payment routes require:
- Valid JWT token
- Admin role (`req.user.role === 'admin'`)

#### Payment Statistics Dashboard
Shows:
- **Total Revenue**: Sum of all completed payments
- **Pending Payments**: Count and amount awaiting approval
- **Collected Payments**: Count and amount of approved payments
- **Rejected Payments**: Count and amount of rejected payments
- **Refunded Payments**: Count and amount of refunded payments

#### Payment Approval Workflow
Admin can:
1. View all pending payments with applicant details
2. Review payment receipt/proof
3. Approve payment → status changes to "completed"
4. Reject payment → status changes to "failed" + rejection reason required
5. Filter payments by status

## Technical Implementation

### Frontend Components

#### [Payments.js](frontend/src/admin/pages/Payments.js) - 421 lines
**Location**: `frontend/src/admin/pages/Payments.js`

**Features**:
- Statistics dashboard with 5 stat cards (total, pending, completed, failed, refunded)
- Filter dropdown (All, Pending, Completed, Rejected)
- Pagination (20 items per page)
- Responsive data table with columns:
  - Application ID
  - Applicant Name
  - Phone Number
  - Visa Type
  - Payment Amount (INR)
  - Payment Status (badge)
  - Payment Date
  - Actions

**State Management**:
- `payments`: Array of payment applications
- `stats`: Statistics object
- `loading`: Loading state
- `filter`: Current status filter
- `page`: Current pagination page
- `selectedPayment`: Selected payment for modal
- `showModal`: Modal visibility
- `updating`: Updating state for async operations
- `rejectionReason`: Textarea value for rejection
- `action`: Current action (approve/reject)

**API Integration**:
```javascript
// Fetch payments with filter and pagination
GET /api/admin/payments?status={status}&page={page}&limit=20

// Fetch statistics
GET /api/admin/payments/stats

// Approve/reject payment
PUT /api/admin/payments/{id}
Body: { status: 'completed' | 'failed', rejectionReason?: string }
```

#### [Payments.css](frontend/src/admin/pages/Payments.css) - 400+ lines
**Styling Components**:
- **Stat Cards**: Blue (#0038b8) gradient for total, color-coded for status
- **Data Table**: Responsive design with hover effects
- **Badges**: Color-coded by status (yellow pending, green completed, red failed)
- **Modal**: Full payment details with action buttons
- **Buttons**: Approve (green), Reject (red), View (blue)
- **Responsive**: Mobile optimized breakpoints (768px, 480px)

### Backend Routes

#### [adminEsim.js](backend/routes/adminEsim.js) - Payment Routes Added
**Routes**:

##### GET `/api/admin/payments`
Fetch all payments with filtering and pagination
```javascript
Query Parameters:
- status: 'processing' | 'completed' | 'failed' | 'refunded' | 'all'
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  success: true,
  applications: [
    {
      _id: ObjectId,
      applicationNumber: string,
      fullName: string,
      phoneNumber: string,
      email: string,
      visaType: string,
      paymentAmount: number,
      paymentStatus: string,
      paymentDate: Date,
      paymentReceipt: string (URL),
      userId: { name, email, phoneNumber }
    }
  ],
  pagination: {
    total: number,
    page: number,
    pages: number
  }
}
```

##### GET `/api/admin/payments/stats`
Get payment statistics aggregation
```javascript
Response:
{
  success: true,
  stats: {
    totalRevenue: number,
    totalPayments: number,
    pendingCount: number,
    pendingAmount: number,
    completedCount: number,
    completedAmount: number,
    failedCount: number,
    failedAmount: number,
    refundedCount: number,
    refundedAmount: number
  }
}
```

##### PUT `/api/admin/payments/{id}`
Approve or reject a payment
```javascript
Body:
{
  status: 'completed' | 'failed' | 'refunded', // required
  rejectionReason: string // optional, used when rejecting
}

Response:
{
  success: true,
  message: string,
  application: Application object with updated fields
}

Validation:
- User must be admin
- Status must be valid ('completed', 'failed', or 'refunded')
- If status is 'failed', rejectionReason is recommended
- paymentDate automatically set to current date
```

### Database Model

#### [Application.js](backend/models/Application.js) - Updated Fields
**Payment Fields Added/Modified**:
```javascript
paymentStatus: {
  type: String,
  enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
  default: 'pending'
}

paymentAmount: {
  type: Number,
  required: true
}

paymentCurrency: {
  type: String,
  default: 'INR'
}

paymentMethod: String

paymentTransactionId: String

paymentDate: Date

paymentProof: String

paymentReceipt: String // URL to uploaded receipt

rejectionReason: String // Admin's reason for rejection
```

## Admin Panel Integration

### Menu Item
**Location**: [AdminLayout.js](frontend/src/admin/components/AdminLayout.js)
- **Path**: `/admin/payments`
- **Icon**: Credit card icon
- **Label**: "Payments"
- **Position**: After eSIM Orders in sidebar

### Route
**Location**: [AdminApp.js](frontend/src/admin/AdminApp.js)
```javascript
<Route path="/admin/payments" element={<Payments />} />
```

## User Flow

### 1. Payment Submission (User)
```
User fills Payment Page
↓
Uploads receipt image/PDF
↓
Selects optional eSIM plan
↓
Submits payment
↓
Payment Status = "processing"
```

### 2. Payment Review (Admin)
```
Admin visits /admin/payments
↓
Sees all pending payments in table
↓
Reviews payment statistics
↓
Clicks on payment to view details
↓
Reviews uploaded receipt
↓
Click "Approve" OR "Reject"
```

### 3. Payment Approval (Admin)
```
Admin clicks "Approve"
↓
Payment Status = "completed"
↓
paymentDate = current date
↓
User receives confirmation email (optional)
↓
eSIM (if ordered) can be activated
```

### 4. Payment Rejection (Admin)
```
Admin clicks "Reject"
↓
Modal shows rejection reason textarea
↓
Admin enters reason (required)
↓
Clicks "Reject" button
↓
Payment Status = "failed"
↓
Rejection Reason stored in database
↓
User receives rejection email with reason
```

## Statistics Dashboard

The statistics section displays 5 cards:

1. **Total Revenue** (Blue)
   - Sum of all completed payments
   - Shows INR value

2. **Pending Payments** (Amber)
   - Count of pending payments
   - Total pending amount below

3. **Collected Payments** (Green)
   - Count of completed payments
   - Total collected amount below

4. **Failed Payments** (Red)
   - Count of rejected/failed payments
   - Total failed amount below

5. **Refunded Payments** (if applicable)
   - Count of refunded payments
   - Total refunded amount below

## Filtering and Pagination

### Filter Options
- **All**: Show all payments regardless of status
- **Pending**: Show only "processing" status payments
- **Completed**: Show only "completed" status payments
- **Rejected**: Show only "failed" status payments

### Pagination
- **Default Limit**: 20 items per page
- **Navigation**: Previous/Next page buttons
- **Total Count**: Displays total number of payments

## API Integration with Axios

All frontend API calls include:
```javascript
Authorization: `Bearer ${localStorage.getItem('adminToken')}`
```

Base URL: `process.env.REACT_APP_API_URL` (defaults to `http://localhost:5000`)

## Error Handling

### Frontend
- Invalid status: Shows error toast
- Failed API calls: Shows error toast with message
- Missing rejection reason: Validation warning before submission

### Backend
- Non-admin user: Returns 403 Forbidden
- Invalid status value: Returns 400 Bad Request
- Application not found: Returns 404 Not Found
- Database error: Returns 500 with error message

## Currency and Formatting

- **Currency**: INR (Indian Rupees)
- **Display Format**: ₹ symbol with 2 decimal places
- **Exchange Rate Used**: 1 USD = 85 INR (for eSIM plans)

## Email Notifications (Optional Enhancement)

Recommended email triggers:
1. **Payment Approved Email**
   - To: User email
   - Subject: "Your payment has been approved"
   - Body: Includes application details, eSIM activation info (if ordered)

2. **Payment Rejected Email**
   - To: User email
   - Subject: "Your payment requires action"
   - Body: Includes rejection reason, resubmission instructions

## Security Features

1. **Authentication**: JWT token required
2. **Authorization**: Admin role validation on every request
3. **Validation**: Status values strictly validated
4. **Audit Trail**: Payment changes recorded with timestamps
5. **Data Filtering**: Populated user details for reference only

## Testing Checklist

- [ ] Admin can view all payments
- [ ] Filter by payment status works
- [ ] Pagination displays correctly
- [ ] Statistics dashboard shows correct totals
- [ ] Can approve pending payment
- [ ] Can reject payment with reason
- [ ] Rejection reason is saved
- [ ] paymentDate updates on approval/rejection
- [ ] Modal displays correct payment details
- [ ] Receipt link works (if provided)
- [ ] Responsive design on mobile
- [ ] Authorization check works (non-admin blocked)

## Related Documentation

- [eSIM System Documentation](BLOG_SYSTEM_DOCUMENTATION.md)
- [Admin Panel Documentation](ADMIN_PANEL_DOCUMENTATION.md)
- [Application Model Documentation](BACKEND_SETUP.md)

## File Locations Summary

| File | Purpose | Lines |
|------|---------|-------|
| [frontend/src/admin/pages/Payments.js](frontend/src/admin/pages/Payments.js) | Payment management component | 421 |
| [frontend/src/admin/pages/Payments.css](frontend/src/admin/pages/Payments.css) | Styling | 400+ |
| [backend/routes/adminEsim.js](backend/routes/adminEsim.js) | Payment API routes (added) | +130 |
| [backend/models/Application.js](backend/models/Application.js) | Payment fields (updated) | 1 |
| [frontend/src/admin/AdminApp.js](frontend/src/admin/AdminApp.js) | Routing (updated) | 1 |
| [frontend/src/admin/components/AdminLayout.js](frontend/src/admin/components/AdminLayout.js) | Menu (updated) | 1 |

---

**Last Updated**: Today
**Version**: 1.0
**Status**: Complete - Ready for Testing
