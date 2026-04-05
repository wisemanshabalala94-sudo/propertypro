import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="landing">
      <!-- Hero with Dubai Skyline -->
      <section class="hero">
        <div class="hero__bg" [style.transform]="'translateY(' + bgOffset + 'px)'">
          <img src="/dubai-skyline.jpg" alt="Dubai Skyline" class="hero__image" />
          <div class="hero__overlay"></div>
        </div>
        <div class="hero__content" [style.transform]="'translateY(' + contentOffset + 'px)'">
          <div class="hero__card">
            <div class="hero__badge">Enterprise Property Management</div>
            <h1 class="hero__title">PropertyPro</h1>
            <p class="hero__subtitle">Enterprise Property Management by WiseWorx</p>
            <p class="hero__desc">Built for owners, tenants, staff, and admin teams.</p>
            <div class="hero__actions">
              <a routerLink="/signup/owner" class="btn btn-primary btn-lg">Get Started</a>
              <a routerLink="/login" class="btn btn-secondary btn-lg">Sign In</a>
            </div>
            <div class="role-cards">
              <a routerLink="/signup/owner" class="role-card">
                <div class="role-card__icon"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                <div class="role-card__title">I am an Owner</div>
                <div class="role-card__desc">Manage properties &amp; tenants</div>
              </a>
              <a routerLink="/signup/tenant" class="role-card">
                <div class="role-card__icon"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div class="role-card__title">I am a Tenant</div>
                <div class="role-card__desc">Pay rent &amp; submit requests</div>
              </a>
              <a routerLink="/login" class="role-card">
                <div class="role-card__icon"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div>
                <div class="role-card__title">I am Staff</div>
                <div class="role-card__desc">Track shifts &amp; tasks</div>
              </a>
              <a routerLink="/login" class="role-card">
                <div class="role-card__icon"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></div>
                <div class="role-card__title">I am Admin</div>
                <div class="role-card__desc">Manage the platform</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <h2 class="features__title">Everything you need to run your portfolio</h2>
        <div class="features__grid">
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--purple"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div><h3>Automated Invoicing</h3><p>Generate rent invoices automatically with Paystack integration.</p></div>
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--blue"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div><h3>Maintenance Tracking</h3><p>Tenants submit requests, staff get assigned and close jobs.</p></div>
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--green"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div><h3>Tenant Onboarding</h3><p>Full application flow with ID verification and approval.</p></div>
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--amber"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><h3>Financial Reports</h3><p>Cash flow, occupancy rates, and expense tracking.</p></div>
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--red"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><h3>Staff Shift Management</h3><p>Clock in/out with 8-hour validation and task queues.</p></div>
          <div class="feature-card"><div class="feature-card__icon feature-card__icon--indigo"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>Audit &amp; Compliance</h3><p>Full audit trail of every action with RLS policies.</p></div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="pricing">
        <h2 class="pricing__title">Simple, transparent pricing</h2>
        <div class="pricing__grid">
          <div class="pricing-card"><div class="pricing-card__tier">Entry</div><div class="pricing-card__price">R299<span>/mo</span></div><ul class="pricing-card__features"><li>1 Property</li><li>Up to 5 Units</li><li>Basic Invoicing</li><li>Tenant Portal</li></ul><a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Start Free Trial</a></div>
          <div class="pricing-card pricing-card--popular"><div class="pricing-card__badge">Most Popular</div><div class="pricing-card__tier">Basic</div><div class="pricing-card__price">R599<span>/mo</span></div><ul class="pricing-card__features"><li>3 Properties</li><li>Up to 20 Units</li><li>Maintenance Tracking</li><li>Staff Shifts</li></ul><a routerLink="/signup/owner" class="btn btn-primary" style="width:100%">Start Free Trial</a></div>
          <div class="pricing-card"><div class="pricing-card__tier">Pro</div><div class="pricing-card__price">R999<span>/mo</span></div><ul class="pricing-card__features"><li>10 Properties</li><li>Up to 50 Units</li><li>Financial Reports</li><li>Bank Reconciliation</li></ul><a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Start Free Trial</a></div>
          <div class="pricing-card"><div class="pricing-card__tier">Unlimited</div><div class="pricing-card__price">R1,999<span>/mo</span></div><ul class="pricing-card__features"><li>Unlimited Properties</li><li>Unlimited Units</li><li>API Access</li><li>White-Label</li></ul><a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Contact Sales</a></div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .landing { min-height: 100vh; }
    .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .hero__bg { position: absolute; inset: 0; will-change: transform; }
    .hero__image { width: 100%; height: 100%; object-fit: cover; }
    .hero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(124,58,237,0.4) 0%, rgba(31,41,55,0.7) 100%); }
    .hero__content { position: relative; z-index: 2; width: 100%; max-width: 1100px; padding: 2rem; will-change: transform; }
    .hero__card { background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); border-radius: 1.5rem; padding: 3rem; box-shadow: 0 25px 60px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.5); text-align: center; }
    .hero__badge { display: inline-block; padding: 0.5rem 1rem; background: #F5F3FF; border: 1px solid #EDE9FE; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: #7C3AED; text-transform: uppercase; margin-bottom: 1.5rem; }
    .hero__title { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; color: #1F2937; margin: 0 0 0.5rem; }
    .hero__subtitle { font-size: 1.125rem; font-weight: 600; color: #7C3AED; margin: 0 0 0.5rem; }
    .hero__desc { font-size: 1rem; color: #4B5563; margin: 0 0 2rem; }
    .hero__actions { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: 1px solid transparent; text-decoration: none; transition: all 0.2s ease; }
    .btn-primary { background: #7C3AED; color: white; border-color: #7C3AED; } .btn-primary:hover { background: #6D28D9; }
    .btn-secondary { background: white; color: #374151; border-color: #D1D5DB; } .btn-secondary:hover { background: #F9FAFB; }
    .btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }
    .role-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .role-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.25rem 0.75rem; border-radius: 0.75rem; background: #F9FAFB; border: 1px solid #E5E7EB; text-decoration: none; transition: all 0.2s ease; }
    .role-card:hover { border-color: #7C3AED; background: #F5F3FF; transform: translateY(-2px); }
    .role-card__icon { width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; background: #EDE9FE; color: #7C3AED; border-radius: 0.5rem; margin-bottom: 0.75rem; }
    .role-card__title { font-size: 0.875rem; font-weight: 600; color: #1F2937; margin-bottom: 0.25rem; }
    .role-card__desc { font-size: 0.75rem; color: #6B7280; }
    .features { padding: 6rem 2rem; background: white; }
    .features__title { text-align: center; font-size: 2rem; font-weight: 700; color: #1F2937; margin: 0 0 3rem; }
    .features__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
    .feature-card { padding: 2rem; border-radius: 0.75rem; border: 1px solid #E5E7EB; transition: all 0.2s ease; }
    .feature-card:hover { border-color: #C4B5FD; box-shadow: 0 4px 12px rgba(124,58,237,0.08); transform: translateY(-2px); }
    .feature-card__icon { width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; margin-bottom: 1rem; }
    .feature-card__icon--purple { background: #F5F3FF; color: #7C3AED; } .feature-card__icon--blue { background: #DBEAFE; color: #3B82F6; } .feature-card__icon--green { background: #D1FAE5; color: #10B981; } .feature-card__icon--amber { background: #FEF3C7; color: #F59E0B; } .feature-card__icon--red { background: #FEE2E2; color: #EF4444; } .feature-card__icon--indigo { background: #E0E7FF; color: #6366F1; }
    .feature-card h3 { font-size: 1rem; font-weight: 600; color: #1F2937; margin: 0 0 0.5rem; }
    .feature-card p { font-size: 0.875rem; color: #6B7280; line-height: 1.6; margin: 0; }
    .pricing { padding: 6rem 2rem; background: #F9FAFB; }
    .pricing__title { text-align: center; font-size: 2rem; font-weight: 700; color: #1F2937; margin: 0 0 3rem; }
    .pricing__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
    .pricing-card { background: white; border-radius: 0.75rem; padding: 2rem; border: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 1rem; position: relative; transition: all 0.2s ease; }
    .pricing-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
    .pricing-card--popular { border-color: #7C3AED; box-shadow: 0 8px 24px rgba(124,58,237,0.12); }
    .pricing-card__badge { position: absolute; top: -0.75rem; left: 50%; transform: translateX(-50%); background: #7C3AED; color: white; font-size: 0.625rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 9999px; }
    .pricing-card__tier { font-size: 0.875rem; font-weight: 600; color: #7C3AED; text-transform: uppercase; }
    .pricing-card__price { font-size: 2.25rem; font-weight: 800; color: #1F2937; }
    .pricing-card__price span { font-size: 0.875rem; font-weight: 500; color: #6B7280; }
    .pricing-card__features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
    .pricing-card__features li { font-size: 0.875rem; color: #4B5563; display: flex; align-items: center; gap: 0.5rem; }
    .pricing-card__features li::before { content: '✓'; color: #7C3AED; font-weight: 700; }
    @media (max-width: 1024px) { .role-cards { grid-template-columns: repeat(2, 1fr); } .features__grid { grid-template-columns: repeat(2, 1fr); } .pricing__grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .hero__card { padding: 1.5rem; } .role-cards { grid-template-columns: repeat(2, 1fr); } .features__grid { grid-template-columns: 1fr; } .pricing__grid { grid-template-columns: 1fr; } .hero__actions { flex-direction: column; } .hero__actions .btn { width: 100%; } }
  `]
})
export class LandingComponent {
  protected scrollY = 0;
  get bgOffset(): string { return (this.scrollY * 0.2).toFixed(1); }
  get contentOffset(): string { return (this.scrollY * -0.3).toFixed(1); }
  @HostListener('window:scroll') onScroll(): void { this.scrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0; }
}
