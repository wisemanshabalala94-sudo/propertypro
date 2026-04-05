import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tenant-pending',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pending-shell">
      <div class="pending-card">
        <h1>Application pending approval</h1>
        <p>Your tenant onboarding is complete. Our team is verifying your details now.</p>
        <ul>
          <li>Status: <strong>PENDING_APPROVAL</strong></li>
          <li>Next step: Admin approval and banking setup.</li>
        </ul>
        <a routerLink="/">Return to PropertyPro Home</a>
      </div>
    </section>
  `,
  styles: [`
    .pending-shell { min-height: 100vh; display: grid; place-items: center; padding: 2rem; background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #F9FAFB 100%); }
    .pending-card { background: white; border-radius: 1.5rem; box-shadow: 0 40px 100px rgba(124,58,237,0.12); padding: 3rem; max-width: 600px; text-align: center; }
    h1 { margin-bottom: 1rem; color: #1F2937; }
    p, li { color: #374151; line-height: 1.8; }
    ul { list-style: none; padding: 0; margin: 1.5rem 0; }
    a { display: inline-flex; padding: 1rem 1.75rem; background: #7C3AED; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; }
  `]
})
export class TenantPendingComponent {}
