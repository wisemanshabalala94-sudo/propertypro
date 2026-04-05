import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-shell">
      <app-header></app-header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <div class="app-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" />
          <p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; background: #F9FAFB; }
    .app-content { flex: 1; }
    .app-footer { padding: 1.5rem 1rem 2rem; background: white; border-top: 1px solid #E5E7EB; }
    .app-footer__inner { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .app-footer__logo { height: 2.5rem; width: auto; }
    .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
  `]
})
export class App {
  currentYear = new Date().getFullYear();
}
