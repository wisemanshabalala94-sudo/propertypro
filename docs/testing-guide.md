# PropertyPro - Complete Testing Guide

## Overview

PropertyPro is a comprehensive property management platform that handles tenant onboarding, lease agreement management, rent collection, and financial reconciliation. This guide provides complete test credentials and workflows to test all major features.

---

## Quick Start Links

- **Landing Page**: `http://localhost:3000`
- **Owner Sign Up**: `http://localhost:3000/onboarding?role=owner`
- **Tenant Sign Up**: `http://localhost:3000/onboarding?role=tenant`
- **Admin/Staff Login**: `http://localhost:3000/auth`
- **Demo Setup**: `POST` to `/api/demo/setup` (optional - seeds test data)

---

## Test User Accounts

### 1. Admin/Owner Account
**Email**: `owner@propertypro.test`  
**Password**: `TestOwner123!@#`  
**Role**: Admin/Owner  
**Organization**: PropertyPro Demo Company  

**Capabilities**:
- Create and manage properties
- Invite staff and admins
- Review tenant applications
- Approve/decline onboarding applications
- Sign lease agreements
- View financial reports
- Manage bank accounts & reconciliation
- Create payout requests

**Test Flow**:
1. Go to `/auth`
2. Click "Login"
3. Enter credentials above
4. Access admin dashboard at `/admin/overview`

---

### 2. Tenant Account (Pre-Verified)
**Email**: `tenant1@propertypro.test`  
**Password**: `TenantTest123!@#`  
**Role**: Tenant  
**Organization**: PropertyPro Demo Company  
**Lease Status**: Active  

**Capabilities**:
- View lease agreement
- Make rent payments
- Submit maintenance requests
- View payment history
- Manage notification preferences
- Access tenant dashboard at `/tenant/dashboard`

---

### 3. Pending Tenant (Awaiting Approval)
**Email**: `pendingTenant@propertypro.test`  
**Password**: `PendingTest123!@#`  
**Role**: Tenant (Onboarding)  
**Status**: Awaiting admin approval  

**Test Flow**:
1. Go to `/auth` and login with these credentials
2. Owner/admin can review at `/admin/overview`
3. Admin approves or declines application
4. Upon approval, tenant gets access to tenant dashboard

---

### 4. Staff/Manager Account
**Email**: `staff@propertypro.test`  
**Password**: `StaffTest123!@#`  
**Role**: Manager  
**Organization**: PropertyPro Demo Company  

**Capabilities**:
- View assigned properties
- Review tenant applications (limited)
- Generate reports
- Process payments
- Manage team communications

---

## Test Properties

Pre-loaded test properties:

| Property | Address | Units | Status |
|----------|---------|-------|--------|
| Downtown Plaza | 123 Main St, Downtown | 5 | Active |
| Green Valley Apartments | 456 Oak Ave, Suburbs | 12 | Active |
| Skyrise Tower | 789 High St, Center | 8 | Active |

---

## Complete Testing Workflows

### Workflow 1: New Owner Sign Up → Full Setup

**Duration**: 5-10 minutes

1. **Landing Page** (`/`)
   - Click "Get started as property owner"
   - Observe hero section, features, and trust elements

2. **Owner Onboarding** (`/onboarding?role=owner`)
   - Enter new email (e.g., `newtester@test.com`)
   - Create password
   - Select "Property Owner" role
   - Complete KYC verification:
     - Upload ID document
     - Upload bank statement
     - Enter address
   - Review affordability assessment (AI-powered)
   - Click "Submit Application"

3. **Admin Review & Approval** (as `owner@propertypro.test`)
   - Go to `/admin/overview`
   - Find "Pending Applications"
   - Click on new owner application
   - Review documents and AI assessment
   - Click "Approve" or "Decline"

4. **Owner Dashboard**
   - Once approved, new owner can access properties section
   - Create first property
   - Add units/apartments
   - Invite admin(s)

---

### Workflow 2: Tenant Application & Lease Signing

**Duration**: 8-15 minutes

1. **Tenant Sign Up** (`/onboarding?role=tenant`)
   - Click search property bar
   - Type "Downtown" or "Green Valley"
   - Select property
   - Fill in application form:
     - Full Name
     - Email
     - Phone
     - Monthly Income (for affordability check)
   - Upload documents:
     - ID copy
     - 2 x recent bank statements
     - Proof of address
   - Review and submit

2. **Admin Reviews** (as `owner@propertypro.test`)
   - Go to `/admin/overview`
   - Find tenant in "Pending Applications"
   - Review:
     - Affordability score (automated)
     - Document quality
     - AI assessment notes
   - Click "Approve & Create Lease"

3. **Lease Agreement Creation**
   - System auto-generates lease based on property settings
   - Key fields pre-filled:
     - Tenant name
     - Property address
     - Monthly rent
     - Start date
     - Term length
   - Upload custom lease template (PDF)
   - Set signature deadline

4. **Tenant Signs Lease** (as tenant)
   - Tenant receives notification
   - Goes to dashboard
   - Clicks "Review Lease"
   - Reads agreement
   - E-signs with digital signature
   - Receives signed copy via email

5. **Lease Activation**
   - Both parties have signed
   - Status changes to "Active"
   - Tenant can now pay rent via app
   - Owner receives rent payment notifications

---

### Workflow 3: Rent Payment & Reconciliation

**Duration**: 5-8 minutes

1. **Tenant Makes Payment** (as `tenant1@propertypro.test`)
   - Go to `/tenant/dashboard`
   - Click "Pay Rent"
   - Select payment method:
     - Bank transfer
     - Debit card
     - Mobile money (region-dependent)
   - Enter amount (or accept full monthly amount)
   - Confirm and process

2. **Payment Processing**
   - System routes through Paystack/payment gateway
   - Confirmation sent to tenant
   - Receipt generated automatically
   - Payment marked as "Pending" initially

3. **Bank Reconciliation** (as owner)
   - Owner uploads bank statement via `/admin/overview`
   - System automatically matches:
     - Tenant payment reference codes
     - Bank transaction amounts
     - Payment dates
   - Reconciliation report shows:
     - Successfully matched payments
     - Unmatched transactions
     - Pending reconciliation

4. **Financial Dashboard**
   - View real-time cash flow
   - See outstanding invoices
   - Generate month-end reports
   - Export for accounting software

---

### Workflow 4: Maintenance Request & Communication

**Duration**: 5 minutes

1. **Tenant Submits Request** (as `tenant1@propertypro.test`)
   - Go to dashboard
   - Click "Maintenance"
   - Select issue type:
     - Plumbing
     - Electrical
     - General Repair
     - Other
   - Attach photos
   - Add notes
   - Submit

2. **Owner/Manager Receives**
   - Notification in inbox
   - Can view tenant's photos and description
   - Mark as "In Progress" or "Completed"
   - Add status updates
   - Tenant receives real-time notifications

---

### Workflow 5: Staff Invitation & Access Control

**Duration**: 3-5 minutes

1. **Owner Invites Manager** (as `owner@propertypro.test`)
   - Go to Team settings
   - Click "Invite Team Member"
   - Enter email: `newstaff@propertypro.test`
   - Select role: Manager
   - Set property access (which buildings they manage)
   - Send invitation

2. **Manager Confirms Access**
   - Email sent to new staff
   - Click "Accept Invitation"
   - Create password
   - Confirm email verification
   - Can now access assigned properties

---

## Testing Common Scenarios

### Scenario 1: Unverified Tenant
- **Status**: Documents rejected
- **Test**: Go to `/admin/overview` → Find tenant → Click "Decline" → Tenant sees "Application Rejected"
- **Result**: Tenant receives email with rejection reason, can re-apply

### Scenario 2: Partial Rent Payment
- **Status**: Tenant pays $800 of $1200 rent due
- **Test**: Tenant pays via app, payment processed, status = "Partial"
- **Result**: Invoice shows "Partial", owner can request remainder, tenant gets reminder

### Scenario 3: Late Payment Handling
- **Status**: Payment due on 1st, now 15th, not paid
- **Test**: Check invoice status → Shows "Overdue"
- **Result**: Tenant receives escalating reminders, owner can send notice

### Scenario 4: Multi-Unit Property Management
- **Status**: 5 units in one building
- **Test**: Create 5 leases with different tenants
- **Result**: Dashboard shows occupancy rate, revenue per unit, etc.

---

## Admin Dashboard Features to Test

### Overview Tab
- [ ] Total properties count
- [ ] Total active leases
- [ ] Outstanding rent amount
- [ ] Pending applications count

### Applications Tab
- [ ] Filter by status (pending, approved, declined)
- [ ] View applicant documents
- [ ] Read AI affordability assessment
- [ ] Approve/decline with notes

### Properties Tab
- [ ] View all properties
- [ ] Edit property details
- [ ] Add/remove units
- [ ] View unit occupancy status

### Tenants Tab
- [ ] Filter by property
- [ ] View lease details
- [ ] See payment history
- [ ] Access tenant contact info

### Financials Tab
- [ ] Monthly revenue dashboard
- [ ] Expense tracking
- [ ] Bank reconciliation status
- [ ] Generate PDF reports

### Team Tab
- [ ] Invite new members
- [ ] Manage permissions
- [ ] Assign properties
- [ ] View activity logs

---

## API Testing

### Create Property
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Property",
    "address": "123 Test St",
    "propertyType": "apartment",
    "unitCount": 5
  }'
```

### Initialize Payment  
```bash
curl -X POST http://localhost:3000/api/payments/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "INVOICE_UUID",
    "amount": 5000,
    "paymentMethod": "card"
  }'
```

### Get Bank Transactions
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Performance Testing Checklist

- [ ] Landing page loads in < 2 seconds
- [ ] Admin dashboard loads in < 3 seconds with 100+ invoices
- [ ] Search property returns results in < 1 second
- [ ] Payment processing completes in < 5 seconds
- [ ] Bank reconciliation processes 1000 transactions in < 30 seconds

---

## Security Testing Checklist

- [ ] Non-authenticated users cannot access `/admin`
- [ ] Tenant cannot view other tenant's lease
- [ ] Staff cannot approve applications without permission
- [ ] Owner can revoke staff access
- [ ] Passwords require minimum 8 characters, 1 uppercase, 1 number
- [ ] Session expires after 30 minutes of inactivity
- [ ] All sensitive data is encrypted in transit

---

## Browser Compatibility

Tested on:
- Chrome/Edge 120+
- Firefox 121+
- Safari 17+
- Mobile browsers (iOS Safari 17+, Chrome Mobile 120+)

---

## Database Seeds (Optional Demo Setup)

Run `/api/demo/setup` via POST request to populate:
- 3 sample properties
- 5 sample tenants
- 10 sample invoices
- 20 sample bank transactions
- Various payment states

```bash
curl -X POST http://localhost:3000/api/demo/setup
```

**Warning**: This will reset test data. Use only in development.

---

## Troubleshooting

**Issue**: "Unauthorized" error when logging in
- **Solution**: Verify user exists in Supabase auth
- Check email and password match exactly
- Ensure organization is set correctly

**Issue**: Payment gateway fails
- **Solution**: Verify Paystack keys in `.env.local`
- Check payment amount is valid (> 0)
- Ensure email is properly formatted

**Issue**: Document upload fails
- **Solution**: File must be < 10MB
- Supported formats: PDF, JPG, PNG only
- Ensure proper file extension

**Issue**: Lease agreement not generating
- **Solution**: Verify property details are complete
- Check tenant has passed affordability check
- Admin must have "Approve Leases" permission

---

## Support & Questions

For issues during testing:
1. Check browser console for JavaScript errors
2. Review network tab for failed requests
3. Check Supabase dashboard for database errors
4. Contact: dev@propertypro.test

---

## Next Steps After Testing

1. ✅ Verify all workflows work end-to-end
2. ✅ Test with actual property address (geolocation)
3. ✅ Configure production payment gateway
4. ✅ Set up email templates
5. ✅ Configure SMS notifications
6. ✅ Deploy to staging environment
7. ✅ Load test with realistic tenant volumes
8. ✅ Security audit and penetration testing
9. ✅ User acceptance testing with real property owners
10. ✅ Production deployment

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: ✅ Ready for Testing
