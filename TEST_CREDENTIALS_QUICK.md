# 🔐 PropertyPro Test Credentials - Copy & Paste Ready

## ⭐ Use These to Test Immediately

### Admin/Owner Account (Full Access)
```
Email:    owner@propertypro.test
Password: TestOwner123!@#
```
👉 **Login at**: http://localhost:3000/auth  
📊 **Then go to**: http://localhost:3000/admin/overview

---

### Active Tenant (Approved & Can Pay Rent)
```
Email:    tenant1@propertypro.test
Password: TenantTest123!@#
```
👉 **Login at**: http://localhost:3000/auth  
🏠 **Then go to**: http://localhost:3000/tenant/dashboard

---

### Pending Tenant (Awaiting Approval)
```
Email:    pendingTenant@propertypro.test
Password: PendingTest123!@#
```
👉 **Status**: Waiting for admin approval  
📋 **Can**: View application status, upload documents

---

### Staff/Manager Accounts (Demo Data) 👤

**All use password**: `DemoStaff123!@#`

Once you generate demo data (see below), you get 5 staff accounts:
- `john.mthembu@propertypro.test` - Property Manager
- `sarah.williams@propertypro.test` - Accountant
- `michael.chen@propertypro.test` - Maintenance Supervisor
- `amara.okafor@propertypro.test` - Tenant Relations Officer
- `david.petersen@propertypro.test` - Security Chief

👉 **Access**: http://localhost:3000/staff/dashboard (view salary and payslips)

---

## 🎯 Quick Test Flows

### Test Flow 0: Generate Demo Staff Data (1 min)
```
1. Login as: owner@propertypro.test / TestOwner123!@#
2. Go to: http://localhost:3000/admin/staff
3. Look for "Generate Demo Data" button (or click manually)
4. Creates: 5 staff members with 4 months of payslips each
✅ Done! Now test staff accounts available.
```

### Test Flow 1: Landing Page Browse (2 min)
```
1. Go to: http://localhost:3000
2. Scroll through entire page
3. Click each button (should navigate correctly)
4. Check animations work smoothly
✅ Done!
```

### Test Flow 2: Owner Login & Admin Dashboard (5 min)
```
1. Go to: http://localhost:3000/auth
2. Login with owner@propertypro.test / TestOwner123!@#
3. Should redirect to: /admin/overview
4. Explore dashboard features
✅ Done!
```
### Test Flow 4: Admin Staff Management (5 min)
```
1. Login as: owner@propertypro.test / TestOwner123!@#
2. Go to: http://localhost:3000/admin/staff
3. See all staff members
4. Add new staff member
5. Create payslip for any staff
6. View payslips list
✅ Done!
```

### Test Flow 5: Staff Dashboard & Payslips (5 min)
```
1. Go to: http://localhost:3000/auth
2. Login: john.mthembu@propertypro.test / DemoStaff123!@#
3. Go to: http://localhost:3000/staff/dashboard
4. View salary overview
5. See payslip history  
6. Download a payslip as PDF
7. View salary trend chart
8. Check leave balance
✅ Done!
```

### Test Flow 6: Request Leave (3 min)
```
1. From staff dashboard (above)
2. Click "Request Leave"
3. Select leave type
4. Choose dates
5. Add reason
6. Submit
✅ Leave request created!
```
### Test Flow 7: Tenant Login & Dashboard (5 min)
```
1. Go to: http://localhost:3000/auth
2. Login with tenant1@propertypro.test / TenantTest123!@#
3. Should redirect to: /tenant/dashboard
4. View lease, payment options
✅ Done!
```

### Test Flow 4: Complete Onboarding (10 min)
```
1. Go to: http://localhost:3000
2. Click "Get started as property owner"
3. Use email: newtester+01@gmail.com (or any email)
4. Fill form with test data
5. Upload sample documents
6. Submit application
✅ Application created (awaiting admin approval)
```

### Test Flow 5: Approve New Owner (5 min)
```
1. Login as: owner@propertypro.test / TestOwner123!@#
2. Go to: /admin/overview
3. Find "Pending Applications"
4. Click new owner application
5. Click "Approve"
✅ Owner account activated!
```

---

## 📱 URLs At a Glance

| Page | URL |
|------|-----|
| **Landing** | http://localhost:3000 |
| **Login** | http://localhost:3000/auth |
| **Owner Signup** | http://localhost:3000/onboarding?role=owner |
| **Tenant Signup** | http://localhost:3000/onboarding?role=tenant |
| **Admin Dashboard** | http://localhost:3000/admin/overview |
| **Tenant Portal** | http://localhost:3000/tenant/dashboard |
| **Owner Dashboard** | http://localhost:3000/owner/dashboard |

---

## 🧪 What to Test

### Landing Page (/ )
- [ ] Page loads beautifully
- [ ] Hero section has animations
- [ ] All 3 buttons clickable
- [ ] Feature cards visible
- [ ] Process timeline shows
- [ ] Mobile looks good

### Login (/auth)
- [ ] Form renders
- [ ] Can switch Login/Signup tabs
- [ ] Email/password fields work
- [ ] Submit button responsive

### Admin Dashboard (/admin/overview)
- [ ] Loads after login
- [ ] Shows properties
- [ ] Shows pending applications
- [ ] Can view tenants
- [ ] Financial dashboard works
- [ ] Can access different tabs

### Tenant Dashboard (/tenant/dashboard)
- [ ] Loads after tenant login
- [ ] Shows lease agreement
- [ ] Shows payment button
- [ ] Shows payment history
- [ ] Can submit support requests

---

## 🎨 Visual Design Check

### Landing Page Elements
- [ ] Hero title bright and readable
- [ ] CTA buttons have blue gradient
- [ ] Feature cards have nice spacing
- [ ] Process timeline shows numbers
- [ ] Trust stats clearly visible
- [ ] All text readable (contrast good)
- [ ] No broken layouts on mobile
- [ ] Smooth scrolling experience

### Color Check
- [ ] Primary blue (#3b82f6) used correctly
- [ ] Emerald green (#10b981) accents
- [ ] White backgrounds clean
- [ ] Text contrast sufficient
- [ ] Hover states visible

### Animation Check
- [ ] Hero background elements float
- [ ] Buttons scale on hover
- [ ] Cards have smooth transitions
- [ ] No jumping or jitter
- [ ] Animations feel premium

---

## ✅ Test Data Available

### Test Properties (Pre-loaded)
1. **Downtown Plaza** - 123 Main St, 5 units
2. **Green Valley Apartments** - 456 Oak Ave, 12 units
3. **Skyrise Tower** - 789 High St, 8 units

### Test Leases
- Tenant1 has active lease on Downtown Plaza Unit 1
- Monthly rent: $1,200
- Payment due: 1st of each month

### Test Invoices
- Multiple unpaid invoices available
- Various payment amounts
- Different due dates for testing

---

## 🚀 If Something Breaks

### Landing Page Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check console for errors (F12 → Console)

### Login Issues
- Verify email exactly as written
- Check password case-sensitive
- Ensure Supabase is running
- Check .env.local has correct keys

### Dashboard Issues
- Try refreshing page (F5)
- Clear cookies and sign back in
- Check user role is correct
- Verify organization is set

---

## 💾 Remember These

### Admin Email
```
owner@propertypro.test
```

### Admin Password
```
TestOwner123!@#
```

### Tenant Email
```
tenant1@propertypro.test
```

### Tenant Password
```
TenantTest123!@#
```

---

## 🎯 Next Actions

**First time?**
1. Read `SETUP_AND_RUN.md` (setup instructions)
2. Start dev server: `npm run dev`
3. Visit: http://localhost:3000
4. Login: See credentials above
5. Explore the app!

**Want detailed testing?**
- Read `TESTING_CREDENTIALS.md` (comprehensive guide)
- Read `docs/testing-guide.md` (detailed workflows)

**Want technical details?**
- Read `IMPLEMENTATION_SUMMARY.md` (what was built)

---

## 📞 Quick Help

**Q: Where's the dev server?**
A: Run `npm run dev` then visit http://localhost:3000

**Q: What's my password?**
A: Check the grey box with email/password at top of this file

**Q: Where do I login?**
A: http://localhost:3000/auth

**Q: Where's the admin panel?**
A: http://localhost:3000/admin/overview (after login)

**Q: Where's the new landing page?**
A: http://localhost:3000 (it's the home page!)

**Q: Can I create a new test account?**
A: Yes! On /auth page, click "Sign up" and use a new email

---

## 🎉 That's It!

You're ready to test PropertyPro. All accounts are pre-configured and ready to use.

**Start Here**: http://localhost:3000

Good luck! 🚀
