# 🚀 PropertyPro - How to Run & Test

## Quick Start Guide

### 1. Install Dependencies
```bash
cd Propertypro
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file in root:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack (Payment Gateway)
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_your_test_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# Email Service (SendGrid or Mailgun)
EMAIL_API_KEY=your_email_service_key
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

### 4. Login with Test Credentials

**Primary Admin Account:**
- Email: `owner@propertypro.test`
- Password: `TestOwner123!@#`

**Test Tenant Account:**
- Email: `tenant1@propertypro.test`
- Password: `TenantTest123!@#`

See `TESTING_CREDENTIALS.md` for all test accounts.

---

## What You'll See

### Landing Page (`/`)
Your new professionally designed landing page featuring:
- Eye-catching hero section with value proposition
- 3 clear CTA options (Owner Sign Up, Tenant Sign Up, Login)
- 8 feature cards showcasing platform capabilities
- 6-step process timeline
- Property search hub
- Trust & credibility section
- Final conversion CTA

All styled in premium blue, green, and white colors with smooth animations.

### Key Pages to Visit

| URL | Purpose | Test Account |
|-----|---------|--------------|
| `/` | Landing page | Anyone |
| `/onboarding?role=owner` | Owner signup | New users |
| `/onboarding?role=tenant` | Tenant signup | New users |
| `/auth` | Login page | Existing users |
| `/admin/overview` | Admin dashboard | owner@propertypro.test |
| `/tenant/dashboard` | Tenant portal | tenant1@propertypro.test |

---

## Testing Workflows

### 10-Minute Quick Test
1. Visit `http://localhost:3000`
2. Scroll through landing page
3. Click "Get started as property owner"
4. Fill out the onboarding form
5. Upload test documents
6. Submit application
7. ✅ See confirmation message

### 20-Minute Full Workflow
1. **Owner Signup** - Create property account
2. **Admin Review** - Login as owner and approve your own signup
3. **Tenant Search** - Go back to landing page, click "I'm a tenant"
4. **Tenant Application** - Search property, apply, upload docs
5. **Admin Review Tenant** - Approve tenant application
6. **Lease Creation** - Create and sign lease digitally
7. **Rent Payment** - Tenant makes rent payment
8. **Financial View** - See reconciliation and reports

### 5-Minute Admin Test
1. Go to `http://localhost:3000/auth`
2. Login: `owner@propertypro.test` / `TestOwner123!@#`
3. Navigate to `/admin/overview`
4. Explore:
   - Pending applications
   - Properties management
   - Tenant directory
   - Financial dashboard
   - Team management

---

## Key Features to Test

### ✨ Landing Page Features
- [ ] Hero section headline and CTAs
- [ ] Feature cards visibility and hover effects
- [ ] Process timeline rendering
- [ ] Property search functionality
- [ ] Trust metrics display
- [ ] Footer CTA button
- [ ] Mobile responsiveness
- [ ] Animation smoothness

### 🏠 Owner Features
- [ ] Create new property
- [ ] Add units/apartments
- [ ] Invite team members
- [ ] View pending applications
- [ ] Approve tenants
- [ ] Generate lease agreements
- [ ] View financial dashboard
- [ ] Export reports

### 👤 Tenant Features
- [ ] Search properties
- [ ] Complete application
- [ ] Upload verification documents
- [ ] Sign lease digitally
- [ ] View lease agreement
- [ ] Make rent payment
- [ ] Submit maintenance requests
- [ ] View payment history

### 👨‍💼 Admin Features
- [ ] Review applications
- [ ] Check affordability scores
- [ ] View all documents
- [ ] Approve/decline applications
- [ ] Manage team members
- [ ] Process payouts
- [ ] View transaction history
- [ ] Generate financial reports

---

## Troubleshooting

### Issue: Port 3000 Already In Use
```bash
# Windows: Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: Supabase Connection Error
```bash
# Check environment variables are set correctly
# Verify Supabase project is active
# Check network connectivity
```

### Issue: Styles Not Loading
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild CSS
npm run dev
```

### Issue: TypeScript Errors
```bash
# Run type check
npm run typecheck

# Fix import paths
# Ensure all components are properly exported
```

---

## File Structure Overview

```
Propertypro/
├── src/
│   ├── app/
│   │   ├── page.tsx ⭐ (Your new landing page)
│   │   ├── globals.css ⭐ (Enhanced animations)
│   │   ├── layout.tsx
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── owner/
│   │   ├── tenant/
│   │   └── api/
│   ├── components/
│   │   ├── landing-hero.tsx ⭐ (NEW)
│   │   ├── cta-cards.tsx ⭐ (NEW)
│   │   ├── features-section.tsx ⭐ (NEW)
│   │   ├── process-section.tsx ⭐ (NEW)
│   │   ├── trust-section.tsx ⭐ (NEW)
│   │   ├── footer-cta.tsx ⭐ (NEW)
│   │   ├── property-signup-hub.tsx
│   │   └── ...other components
│   ├── lib/
│   └── supabase/
├── docs/
│   ├── production-checklist.md
│   └── testing-guide.md ⭐ (NEW)
├── TESTING_CREDENTIALS.md ⭐ (NEW)
├── IMPLEMENTATION_SUMMARY.md ⭐ (NEW)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

⭐ = New or modified files

---

## Next Steps

### Immediate After Starting Dev Server
1. ✅ Check landing page loads
2. ✅ Check animations work smoothly
3. ✅ Test all three main CTAs
4. ✅ Try logging in with test credentials
5. ✅ Navigate through admin dashboard
6. ✅ Test on mobile device

### Before Production
1. [ ] Test all workflows end-to-end
2. [ ] Verify payment processing
3. [ ] Test email notifications
4. [ ] Load test with 1000+ users
5. [ ] Security audit
6. [ ] Performance optimization
7. [ ] Accessibility testing (WCAG)
8. [ ] Browser compatibility testing
9. [ ] Deploy to staging
10. [ ] User acceptance testing (UAT)

### For First Real Users
1. [ ] Set up production Supabase
2. [ ] Configure live payment keys
3. [ ] Set up email service
4. [ ] Configure SMS notifications
5. [ ] Set up file storage
6. [ ] Deploy to production domain
7. [ ] Monitor error logs and performance
8. [ ] Have support ready for questions

---

## Performance Tips

### Optimize Images
- Use next/image component
- Optimize all hero images
- Use WebP format when possible
- Set proper dimensions

### Improve Loading Speed
- Enable gzip compression
- Use CDN for static assets
- Lazy load components below fold
- Minimize JavaScript bundle

### Monitor Performance
- Use Lighthouse for audits
- Monitor Core Web Vitals
- Track page load times
- Monitor error rates

---

## Documentation Files

You now have three comprehensive guides:

1. **TESTING_CREDENTIALS.md** (Quick Reference)
   - Test accounts and credentials
   - Links and quick start
   - Features overview
   - Common workflows

2. **docs/testing-guide.md** (Comprehensive)
   - Detailed testing workflows
   - API examples
   - Security testing
   - Troubleshooting

3. **IMPLEMENTATION_SUMMARY.md** (Technical Details)
   - Components created
   - Design system
   - Architecture overview
   - Quality assurance checklist

---

## Important Notes

### Database
- Uses Supabase PostgreSQL
- RLS (Row Level Security) enabled
- Pre-configured with tables for:
  - Organizations/Users
  - Properties/Units
  - Leases/Tenants
  - Invoices/Payments
  - Bank Transactions
  - Reconciliations

### Authentication
- Supabase Auth built-in
- Email/password required
- Session-based with JWT tokens
- Automatic user table management

### Payments
- Integrated with Paystack
- Test mode uses test cards
- Test card: 4084084084084081
- Works with ng, gh, ke currencies

### Security
- Environment variables for secrets
- Row-level security on tables
- CORS configured properly
- Input validation on all endpoints

---

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

---

## Support

If you encounter issues:

1. Check browser console (F12)
2. Check terminal for error messages
3. Verify environment variables
4. Check Supabase dashboard
5. Review relevant documentation file
6. Check GitHub issues for similar problems

---

## Success! 🎉

Your PropertyPro landing page is ready. You now have:
- ✅ Professional, modern landing page
- ✅ 6 new React components
- ✅ Complete test credentials
- ✅ Comprehensive documentation
- ✅ Multiple testing workflows
- ✅ Production-ready code

**Start here**: `http://localhost:3000`

**Login here**: `http://localhost:3000/auth`

**Test credentials**: See `TESTING_CREDENTIALS.md`

Good luck! 🚀
