import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="landing-page">

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__bg" [style.transform]="'translateY(' + bgOffset + 'px)'">
          <img src="/dubai-skyline.jpg" alt="Dubai Skyline" class="hero__image" />
          <div class="hero__overlay"></div>
        </div>

        <div class="hero__content" [style.transform]="'translateY(' + contentOffset + 'px)'">
          <div class="hero__card">
            <div class="hero__badge">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 8.5h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3a.5.5 0 011 0v3h3a.5.5 0 010 1z" fill="#7C3AED"/></svg>
              Enterprise Property Management
            </div>

            <h1 class="hero__title">PropertyPro</h1>
            <p class="hero__subtitle">Enterprise Property Management by WiseWorx</p>
            <p class="hero__description">
              Built for owners, tenants, staff, and admin teams. Manage properties, collect rent,
              track maintenance, and run your entire portfolio from one platform.
            </p>

            <div class="hero__actions">
              <a routerLink="/signup/owner" class="btn btn-primary btn-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Get Started
              </a>
              <a routerLink="/login" class="btn btn-secondary btn-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </a>
            </div>

            <!-- Role Selection Cards -->
            <div class="role-cards">
              <a routerLink="/signup/owner" class="role-card">
                <div class="role-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div class="role-card__title">I am an Owner</div>
                <div class="role-card__desc">Manage properties &amp; tenants</div>
              </a>
              <a routerLink="/signup/tenant" class="role-card">
                <div class="role-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="role-card__title">I am a Tenant</div>
                <div class="role-card__desc">Pay rent &amp; submit requests</div>
              </a>
              <a routerLink="/login" class="role-card">
                <div class="role-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                </div>
                <div class="role-card__title">I am Staff</div>
                <div class="role-card__desc">Track shifts &amp; tasks</div>
              </a>
              <a routerLink="/login" class="role-card">
                <div class="role-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
                <div class="role-card__title">I am Admin</div>
                <div class="role-card__desc">Manage the platform</div>
              </a>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="scroll-indicator" [style.opacity]="scrollIndicatorOpacity">
          <div class="scroll-indicator__mouse">
            <div class="scroll-indicator__wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="features__header">
          <h2 class="features__title">Everything you need to run your portfolio</h2>
          <p class="features__subtitle">From tenant onboarding to financial reporting, PropertyPro handles it all.</p>
        </div>

        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--purple">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3>Automated Invoicing</h3>
            <p>Generate and send rent invoices automatically. Track payments in real-time with Paystack integration.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3>Maintenance Tracking</h3>
            <p>Tenants submit requests with photos. Staff get assigned, track progress, and close jobs.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--green">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3>Tenant Onboarding</h3>
            <p>Full application flow: ID verification, bank statements, credit checks, and approval workflows.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--amber">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3>Financial Reports</h3>
            <p>Cash flow, occupancy rates, expense tracking, and bank reconciliation in one dashboard.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--red">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Staff Shift Management</h3>
            <p>Clock in/out with 8-hour validation. Task queues, leave requests, and payslip generation.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--indigo">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Audit &amp; Compliance</h3>
            <p>Full audit trail of every action. RLS policies, document verification, and data access logs.</p>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pricing">
        <div class="pricing__header">
          <h2 class="pricing__title">Simple, transparent pricing</h2>
          <p class="pricing__subtitle">Choose the plan that fits your portfolio. All plans include a 14-day free trial.</p>
        </div>

        <div class="pricing__grid">
          <div class="pricing-card">
            <div class="pricing-card__tier">Entry</div>
            <div class="pricing-card__price">R299<span>/month</span></div>
            <ul class="pricing-card__features">
              <li>1 Property</li>
              <li>Up to 5 Units</li>
              <li>Basic Invoicing</li>
              <li>Tenant Portal</li>
            </ul>
            <a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Start Free Trial</a>
          </div>

          <div class="pricing-card pricing-card--popular">
            <div class="pricing-card__popular-badge">Most Popular</div>
            <div class="pricing-card__tier">Basic</div>
            <div class="pricing-card__price">R599<span>/month</span></div>
            <ul class="pricing-card__features">
              <li>3 Properties</li>
              <li>Up to 20 Units</li>
              <li>Maintenance Tracking</li>
              <li>Staff Shifts</li>
              <li>Payment Processing</li>
            </ul>
            <a routerLink="/signup/owner" class="btn btn-primary" style="width:100%">Start Free Trial</a>
          </div>

          <div class="pricing-card">
            <div class="pricing-card__tier">Pro</div>
            <div class="pricing-card__price">R999<span>/month</span></div>
            <ul class="pricing-card__features">
              <li>10 Properties</li>
              <li>Up to 50 Units</li>
              <li>Financial Reports</li>
              <li>Bank Reconciliation</li>
              <li>Priority Support</li>
            </ul>
            <a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Start Free Trial</a>
          </div>

          <div class="pricing-card">
            <div class="pricing-card__tier">Unlimited</div>
            <div class="pricing-card__price">R1,999<span>/month</span></div>
            <ul class="pricing-card__features">
              <li>Unlimited Properties</li>
              <li>Unlimited Units</li>
              <li>API Access</li>
              <li>White-Label</li>
              <li>Dedicated Account Manager</li>
            </ul>
            <a routerLink="/signup/owner" class="btn btn-secondary" style="width:100%">Contact Sales</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="landing-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="landing-footer__logo" />
          <p class="landing-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>
    </main>
  `,
  styles: [`
    :host { display: block; }

    .landing-page { min-height: 100vh; }

    /* ===== HERO ===== */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero__bg {
      position: absolute;
      inset: 0;
      will-change: transform;
      z-index: 0;
    }

    .hero__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 20%;
    }

    .hero__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(124,58,237,0.4) 0%, rgba(31,41,55,0.7) 100%);
    }

    .hero__content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1100px;
      padding: 2rem;
      will-change: transform;
    }

    .hero__card {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .hero__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #F5F3FF;
      border: 1px solid #EDE9FE;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #7C3AED;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
    }

    .hero__title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      color: #1F2937;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
    }

    .hero__subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      color: #7C3AED;
      margin: 0 0 1rem;
    }

    .hero__description {
      font-size: 1rem;
      color: #4B5563;
      line-height: 1.7;
      max-width: 540px;
      margin: 0 0 2rem;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    /* Role Cards */
    .role-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .role-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.25rem 0.75rem;
      border-radius: 0.75rem;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .role-card:hover {
      border-color: #7C3AED;
      background: #F5F3FF;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
    }

    .role-card__icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #EDE9FE;
      color: #7C3AED;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .role-card__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 0.25rem;
    }

    .role-card__desc {
      font-size: 0.75rem;
      color: #6B7280;
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      z-index: 3;
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .scroll-indicator__mouse {
      width: 24px;
      height: 38px;
      border: 2px solid rgba(255,255,255,0.5);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      padding-top: 8px;
    }

    .scroll-indicator__wheel {
      width: 3px;
      height: 8px;
      background: white;
      border-radius: 2px;
      animation: scrollWheel 1.5s ease-in-out infinite;
    }

    @keyframes scrollWheel {
      0%, 100% { opacity: 1; transform: translateY(0); }
      50% { opacity: 0.3; transform: translateY(6px); }
    }

    /* ===== FEATURES ===== */
    .features {
      padding: 6rem 2rem;
      background: white;
    }

    .features__header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 4rem;
    }

    .features__title {
      font-size: 2rem;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 1rem;
    }

    .features__subtitle {
      font-size: 1rem;
      color: #6B7280;
      line-height: 1.7;
    }

    .features__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .feature-card {
      padding: 2rem;
      border-radius: 0.75rem;
      border: 1px solid #E5E7EB;
      background: white;
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      border-color: #C4B5FD;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
      transform: translateY(-2px);
    }

    .feature-card__icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .feature-card__icon--purple { background: #F5F3FF; color: #7C3AED; }
    .feature-card__icon--blue { background: #DBEAFE; color: #3B82F6; }
    .feature-card__icon--green { background: #D1FAE5; color: #10B981; }
    .feature-card__icon--amber { background: #FEF3C7; color: #F59E0B; }
    .feature-card__icon--red { background: #FEE2E2; color: #EF4444; }
    .feature-card__icon--indigo { background: #E0E7FF; color: #6366F1; }

    .feature-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      font-size: 0.875rem;
      color: #6B7280;
      line-height: 1.6;
    }

    /* ===== PRICING ===== */
    .pricing {
      padding: 6rem 2rem;
      background: #F9FAFB;
    }

    .pricing__header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 4rem;
    }

    .pricing__title {
      font-size: 2rem;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 1rem;
    }

    .pricing__subtitle {
      font-size: 1rem;
      color: #6B7280;
      line-height: 1.7;
    }

    .pricing__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .pricing-card {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      border: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.2s ease;
      position: relative;
    }

    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .pricing-card--popular {
      border-color: #7C3AED;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12);
    }

    .pricing-card__popular-badge {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      background: #7C3AED;
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .pricing-card__tier {
      font-size: 0.875rem;
      font-weight: 600;
      color: #7C3AED;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pricing-card__price {
      font-size: 2.25rem;
      font-weight: 800;
      color: #1F2937;
    }

    .pricing-card__price span {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6B7280;
    }

    .pricing-card__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .pricing-card__features li {
      font-size: 0.875rem;
      color: #4B5563;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pricing-card__features li::before {
      content: '✓';
      color: #7C3AED;
      font-weight: 700;
      font-size: 0.75rem;
    }

    /* ===== FOOTER ===== */
    .landing-footer {
      padding: 2rem;
      background: white;
      border-top: 1px solid #E5E7EB;
    }

    .landing-footer__inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
      border-radius: 1rem;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      border: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .landing-footer__logo {
      height: 2.5rem;
      width: auto;
    }

    .landing-footer__text {
      font-size: 0.875rem;
      color: #6B7280;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .role-cards { grid-template-columns: repeat(2, 1fr); }
      .features__grid { grid-template-columns: repeat(2, 1fr); }
      .pricing__grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .hero__card { padding: 1.5rem; }
      .role-cards { grid-template-columns: repeat(2, 1fr); }
      .features__grid { grid-template-columns: 1fr; }
      .pricing__grid { grid-template-columns: 1fr; }
      .hero__actions { flex-direction: column; }
      .hero__actions .btn { width: 100%; }
    }
  `]
})
export class LandingComponent {
  protected readonly currentYear = new Date().getFullYear();
  protected scrollY = 0;

  get bgOffset(): string {
    return (this.scrollY * 0.2).toFixed(1);
  }

  get contentOffset(): string {
    return (this.scrollY * -0.3).toFixed(1);
  }

  get scrollIndicatorOpacity(): string {
    return Math.max(0, 1 - this.scrollY / 400).toFixed(2);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  }
}
