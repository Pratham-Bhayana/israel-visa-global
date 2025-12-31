# Payment System - Quick Reference Card

## For Developers

### Files to Know

```
FRONTEND:
├─ src/admin/pages/Payments.js          (Main component, 421 lines)
├─ src/admin/pages/Payments.css         (Styling, 400+ lines)
├─ src/admin/AdminApp.js                (Route integration)
└─ src/admin/components/AdminLayout.js  (Menu integration)

BACKEND:
├─ routes/adminEsim.js                  (Payment API routes)
└─ models/Application.js                (Payment fields)
```

### Key Component State

```javascript
const [payments, setPayments] = useState([]);           // Payment list
const [stats, setStats] = useState(null);               // Statistics
const [loading, setLoading] = useState(true);           // Loading state
const [filter, setFilter] = useState('all');            // Status filter
const [page, setPage] = useState(1);                    // Pagination
const [selectedPayment, setSelectedPayment] = useState(null);
const [showModal, setShowModal] = useState(false);      // Modal visibility
const [updating, setUpdating] = useState(false);        // Updating state
const [rejectionReason, setRejectionReason] = useState('');
const [action, setAction] = useState('approve');        // approve | reject
```

### API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/payments` | Fetch all payments |
| GET | `/api/admin/payments/stats` | Get statistics |
| PUT | `/api/admin/payments/{id}` | Approve/reject |

### Common Code Patterns

#### Fetch Payments
```javascript
const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/admin/payments?status=${filter}&page=${page}&limit=20`,
  { headers: { Authorization: `Bearer ${token}` } }
);
setPayments(response.data.applications);
```

#### Fetch Statistics
```javascript
const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/admin/payments/stats`,
  { headers: { Authorization: `Bearer ${token}` } }
);
setStats(response.data.stats);
```

#### Approve/Reject Payment
```javascript
const payload = {
  status: action === 'approve' ? 'completed' : 'failed',
  rejectionReason: rejectionReason // if rejecting
};

const response = await axios.put(
  `${process.env.REACT_APP_API_URL}/api/admin/payments/${selectedPayment._id}`,
  payload,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Database Fields Reference

```javascript
// Payment related fields in Application model
paymentStatus:       'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
paymentAmount:       Number (INR)
paymentCurrency:     'INR'
paymentMethod:       String
paymentTransactionId: String
paymentDate:         Date
paymentProof:        String (URL)
paymentReceipt:      String (URL)
rejectionReason:     String // NEW FIELD
```

### CSS Class Reference

```css
.payments-container      /* Main container */
.payments-header         /* Header section */
.payments-stats          /* Statistics grid */
.stat-card              /* Individual stat card */
.stat-card.total        /* Total stat (blue) */
.stat-card.pending      /* Pending stat (amber) */
.stat-card.completed    /* Completed stat (green) */
.stat-card.failed       /* Failed stat (red) */
.payments-filter        /* Filter dropdown */
.payments-table         /* Data table */
.badge-processing       /* Processing badge */
.badge-completed        /* Completed badge */
.badge-failed           /* Failed badge */
.btn-approve           /* Approve button */
.btn-reject            /* Reject button */
.btn-view              /* View button */
.modal-overlay         /* Modal background */
.modal-content         /* Modal container */
```

### Status Workflow

```
pending → processing → completed ✓
                   ↓
                  failed ✓
                   ↓
                refunded (optional)
```

### Authentication

```javascript
// All API requests require:
headers: {
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
}

// Admin check on backend:
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Access denied' });
}
```

### Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid status) |
| 403 | Forbidden (not admin) |
| 404 | Not found (payment doesn't exist) |
| 500 | Server error |

### Toast Notifications

```javascript
toast.success('Payment approved successfully');
toast.error('Failed to fetch payments');
toast.error('Please provide a rejection reason');
```

### URL Patterns

```
Admin Access: http://localhost:3000/admin/payments
API Base: http://localhost:5000/api/admin
Payments API: /api/admin/payments
Stats API: /api/admin/payments/stats
Single Payment: /api/admin/payments/{id}
```

### Responsive Breakpoints

```css
Desktop: 1024px+ → 4-column grid, full table
Tablet:  768-1024px → 2-column grid, scrollable table
Mobile:  < 768px → 1-column grid, stacked layout
```

### Performance Checklist

- [ ] Pagination limit: 20 items
- [ ] Load payments on component mount
- [ ] Load stats on component mount
- [ ] Debounce filter changes if needed
- [ ] Cache stats data
- [ ] Use React.memo for stat cards
- [ ] Lazy load modal content

### Common Issues & Quick Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Access Denied" | Not admin | Check user role in localStorage |
| Empty table | No payments | Create test payment first |
| Stats show 0 | No completed | Approve some payments |
| Modal not showing | API error | Check network tab |
| Styling broken | CSS path wrong | Ensure ./Payments.css exists |
| Route not found | Route not added | Add to AdminApp.js |
| Menu missing | Menu not updated | Add to AdminLayout.js |

### Testing with cURL

```bash
# Get payments
curl -X GET "http://localhost:5000/api/admin/payments?status=processing" \
  -H "Authorization: Bearer TOKEN"

# Get stats
curl -X GET "http://localhost:5000/api/admin/payments/stats" \
  -H "Authorization: Bearer TOKEN"

# Approve payment
curl -X PUT "http://localhost:5000/api/admin/payments/APP_ID" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Reject payment
curl -X PUT "http://localhost:5000/api/admin/payments/APP_ID" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"failed","rejectionReason":"Invalid receipt"}'
```

### Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=development
```

### Deployment Checklist

- [ ] Set correct API_URL in .env
- [ ] Test all approval/rejection scenarios
- [ ] Verify statistics calculation
- [ ] Check mobile responsiveness
- [ ] Confirm admin authorization works
- [ ] Test error handling
- [ ] Verify pagination
- [ ] Check receipt link functionality

---

**Quick Start**: Visit `/admin/payments` while logged in as admin
**Documentation**: See PAYMENT_SYSTEM_DOCUMENTATION.md
**Testing**: See PAYMENT_TESTING_GUIDE.md
