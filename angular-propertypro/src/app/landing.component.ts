import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="landing-page">
      <section class="hero">
        <div class="hero__copy">
          <span class="hero__eyebrow">PropertyPro · WiseWorx</span>
          <h1 class="hero__title">Dubai-grade property operations with one clear enterprise workspace.</h1>
          <p class="hero__description">
            Coordinate tenant onboarding, owner oversight, payment operations, approvals, and on-site execution
            through a polished platform designed for modern real estate teams.
          </p>

          <div class="hero__actions">
            <a routerLink="/signup/owner" class="button button--primary">Register as owner</a>
            <a routerLink="/signup/tenant" class="button button--secondary">Start tenant onboarding</a>
          </div>

          <div class="hero__quicklinks">
            <a routerLink="/login" class="quicklink-card">
              <span class="quicklink-card__title">Secure access</span>
              <span class="quicklink-card__text">Login for owners, staff, admins, and tenants.</span>
            </a>
            <a routerLink="/owner/dashboard" class="quicklink-card">
              <span class="quicklink-card__title">Owner visibility</span>
              <span class="quicklink-card__text">Track invoicing, approvals, and building performance.</span>
            </a>
            <a routerLink="/tenant/dashboard" class="quicklink-card">
              <span class="quicklink-card__title">Tenant experience</span>
              <span class="quicklink-card__text">Move from application to approved occupancy with clarity.</span>
            </a>
          </div>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <div class="skyline-scene">
            <div class="skyline-scene__glow skyline-scene__glow--top"></div>
            <div class="skyline-scene__glow skyline-scene__glow--mid"></div>

            <div class="skyline-layer skyline-layer--back" [style.transform]="backLayerTransform">
              <div class="tower tower--needle"></div>
              <div class="tower tower--crest"></div>
              <div class="tower tower--sail"></div>
              <div class="tower tower--spire"></div>
            </div>

            <div class="skyline-layer skyline-layer--mid" [style.transform]="midLayerTransform">
              <div class="tower tower--arc"></div>
              <div class="tower tower--stack"></div>
              <div class="tower tower--slim"></div>
              <div class="tower tower--crown"></div>
            </div>

            <div class="skyline-layer skyline-layer--front" [style.transform]="frontLayerTransform">
              <div class="tower tower--block tower--block-one"></div>
              <div class="tower tower--block tower--block-two"></div>
              <div class="tower tower--block tower--block-three"></div>
              <div class="tower tower--block tower--block-four"></div>
              <div class="shoreline"></div>
            </div>

            <div class="hero-card hero-card--float" [style.transform]="cardTransform">
              <span class="hero-card__label">Operational control</span>
              <strong>Tenant onboarding stays locked until approval is complete.</strong>
            </div>
          </div>

          <div class="metrics-grid">
            <article class="metric-card">
              <span class="metric-card__value">R100</span>
              <span class="metric-card__label">Fixed platform fee per invoice</span>
            </article>
            <article class="metric-card">
              <span class="metric-card__value">8 hrs</span>
              <span class="metric-card__label">Shift validation threshold for staff</span>
            </article>
            <article class="metric-card">
              <span class="metric-card__value">3 docs</span>
              <span class="metric-card__label">Bank statements required for tenant review</span>
            </article>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <div class="landing-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="landing-footer__logo" />
          <p class="landing-footer__text">© {{ currentYear }} WiseWorx. PropertyPro™ Platform.</p>
        </div>
      </footer>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .landing-page {
        width: min(100%, 1280px);
        margin: 0 auto;
        padding: 2rem 1.25rem 3rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
        gap: 2rem;
        align-items: center;
        min-height: calc(100vh - 11rem);
      }

      .hero__copy {
        max-width: 38rem;
      }

      .hero__eyebrow {
        display: inline-flex;
        align-items: center;
        padding: 0.55rem 0.9rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(16, 185, 129, 0.18);
        box-shadow: 0 16px 32px rgba(15, 60, 47, 0.06);
        color: #047857;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .hero__title {
        margin: 1.3rem 0 1rem;
        font-size: clamp(2.8rem, 5vw, 5rem);
        line-height: 0.96;
        letter-spacing: -0.04em;
        color: #0f172a;
      }

      .hero__description {
        margin: 0;
        color: #475569;
        font-size: 1.07rem;
        line-height: 1.8;
      }

      .hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 2rem;
      }

      .button {
        min-height: 3.75rem;
        padding: 0 1.5rem;
        border-radius: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
      }

      .button:hover {
        transform: translateY(-2px);
      }

      .button--primary {
        background: #10b981;
        color: #ffffff;
        box-shadow: 0 18px 35px rgba(16, 185, 129, 0.22);
      }

      .button--secondary {
        background: #ffffff;
        color: #047857;
        border: 1px solid rgba(16, 185, 129, 0.25);
        box-shadow: 0 18px 35px rgba(15, 60, 47, 0.08);
      }

      .hero__quicklinks {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }

      .quicklink-card {
        min-height: 10rem;
        padding: 1.2rem;
        border-radius: 1.35rem;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(16, 185, 129, 0.1);
        box-shadow: 0 22px 48px rgba(15, 60, 47, 0.08);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .quicklink-card__title {
        color: #065f46;
        font-weight: 800;
        font-size: 1rem;
      }

      .quicklink-card__text {
        color: #64748b;
        line-height: 1.6;
        font-size: 0.94rem;
      }

      .hero__visual {
        display: grid;
        gap: 1.25rem;
      }

      .skyline-scene {
        position: relative;
        min-height: 36rem;
        border-radius: 2rem;
        overflow: hidden;
        padding: 2rem;
        background:
          linear-gradient(180deg, #08111f 0%, #10233a 48%, #17334d 75%, #1b4f5b 100%);
        box-shadow: 0 40px 100px rgba(2, 12, 27, 0.28);
      }

      .skyline-scene::before {
        content: '';
        position: absolute;
        inset: auto 0 0;
        height: 42%;
        background: linear-gradient(180deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.12));
      }

      .skyline-scene__glow {
        position: absolute;
        border-radius: 999px;
        filter: blur(10px);
        opacity: 0.9;
      }

      .skyline-scene__glow--top {
        width: 14rem;
        height: 14rem;
        top: 3rem;
        right: 4rem;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.03) 70%, transparent 100%);
      }

      .skyline-scene__glow--mid {
        width: 22rem;
        height: 10rem;
        left: -3rem;
        top: 9rem;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0.04) 68%, transparent 100%);
      }

      .skyline-layer {
        position: absolute;
        inset: 0;
        transition: transform 120ms linear;
        will-change: transform;
      }

      .tower {
        position: absolute;
        bottom: 5.3rem;
        border-radius: 1rem 1rem 0.35rem 0.35rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(16, 185, 129, 0.14));
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 16px 55px rgba(0, 0, 0, 0.24);
      }

      .tower::before {
        content: '';
        position: absolute;
        inset: 0.8rem;
        border-radius: 0.7rem;
        background:
          linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0, rgba(255, 255, 255, 0.04) 18%, transparent 18%, transparent 34%, rgba(255, 255, 255, 0.06) 34%, rgba(255, 255, 255, 0.06) 52%, transparent 52%, transparent 68%, rgba(255, 255, 255, 0.05) 68%, rgba(255, 255, 255, 0.05) 86%, transparent 86%);
        opacity: 0.8;
      }

      .tower--needle {
        left: 14%;
        width: 3.8rem;
        height: 19rem;
        border-radius: 2rem 2rem 0.35rem 0.35rem;
      }

      .tower--needle::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 100%;
        width: 0.3rem;
        height: 6rem;
        transform: translateX(-50%);
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(16, 185, 129, 0.5));
      }

      .tower--crest {
        left: 28%;
        width: 6rem;
        height: 14rem;
      }

      .tower--sail {
        right: 20%;
        width: 5rem;
        height: 16rem;
        border-radius: 2rem 0.6rem 0.35rem 0.35rem;
      }

      .tower--spire {
        right: 8%;
        width: 4.2rem;
        height: 12rem;
      }

      .tower--arc {
        left: 11%;
        width: 6.5rem;
        height: 12rem;
      }

      .tower--stack {
        left: 36%;
        width: 7.5rem;
        height: 20rem;
      }

      .tower--slim {
        right: 31%;
        width: 3.2rem;
        height: 15rem;
      }

      .tower--crown {
        right: 12%;
        width: 6rem;
        height: 18rem;
      }

      .tower--block {
        bottom: 2.6rem;
        border-radius: 1rem 1rem 0 0;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(15, 23, 42, 0.92));
      }

      .tower--block::before {
        inset: 0.7rem;
      }

      .tower--block-one {
        left: -1%;
        width: 12rem;
        height: 9rem;
      }

      .tower--block-two {
        left: 20%;
        width: 9rem;
        height: 6.5rem;
      }

      .tower--block-three {
        right: 22%;
        width: 10rem;
        height: 8rem;
      }

      .tower--block-four {
        right: -1%;
        width: 12rem;
        height: 7rem;
      }

      .shoreline {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 6rem;
        background:
          linear-gradient(180deg, rgba(16, 185, 129, 0.22), rgba(7, 89, 133, 0.32)),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent 18%, rgba(255, 255, 255, 0.08) 42%, transparent 64%, rgba(255, 255, 255, 0.08));
      }

      .hero-card {
        position: absolute;
        left: 2rem;
        right: auto;
        bottom: 2rem;
        max-width: 18rem;
        padding: 1rem 1.1rem;
        border-radius: 1.25rem;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 18px 45px rgba(15, 60, 47, 0.16);
        display: grid;
        gap: 0.45rem;
        transition: transform 120ms linear;
        will-change: transform;
      }

      .hero-card__label {
        color: #047857;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .hero-card strong {
        color: #111827;
        line-height: 1.5;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      }

      .metric-card {
        padding: 1.25rem;
        border-radius: 1.25rem;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(16, 185, 129, 0.1);
        box-shadow: 0 18px 45px rgba(15, 60, 47, 0.08);
        display: grid;
        gap: 0.45rem;
      }

      .metric-card__value {
        color: #065f46;
        font-weight: 800;
        font-size: 1.7rem;
      }

      .metric-card__label {
        color: #64748b;
        line-height: 1.5;
      }

      .landing-footer {
        margin-top: 4rem;
        padding: 2rem 1rem;
      }

      .landing-footer__inner {
        max-width: 100%;
        padding: 1.5rem;
        border-radius: 1.25rem;
        background: #ffffff;
        box-shadow: 0 20px 45px rgba(15, 60, 47, 0.08);
        border: 1px solid rgba(15, 118, 110, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }

      .landing-footer__logo {
        height: 2.75rem;
        width: auto;
        display: block;
      }

      .landing-footer__text {
        margin: 0;
        color: #6b7280;
        font-size: 0.95rem;
        text-align: center;
      }

      @media (max-width: 1080px) {
        .hero {
          grid-template-columns: 1fr;
          min-height: auto;
        }

        .hero__copy {
          max-width: none;
        }

        .hero__quicklinks,
        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .skyline-scene {
          min-height: 31rem;
        }
      }

      @media (max-width: 720px) {
        .landing-page {
          padding: 1.25rem 1rem 2rem;
        }

        .hero__actions {
          flex-direction: column;
        }

        .button {
          width: 100%;
        }

        .hero__quicklinks {
          grid-template-columns: 1fr;
        }

        .skyline-scene {
          min-height: 27rem;
          padding: 1.25rem;
        }

        .hero-card {
          left: 1rem;
          bottom: 1rem;
          max-width: 14rem;
        }

        .tower--block-four,
        .tower--spire {
          display: none;
        }
      }
    `
  ]
})
export class LandingComponent {
  protected readonly currentYear = new Date().getFullYear();
  private readonly maxScroll = 700;
  protected scrollOffset = 0;

  get backLayerTransform(): string {
    return this.buildTranslate(0.14, -0.035);
  }

  get midLayerTransform(): string {
    return this.buildTranslate(0.22, -0.05);
  }

  get frontLayerTransform(): string {
    return this.buildTranslate(0.3, -0.065);
  }

  get cardTransform(): string {
    const vertical = this.scrollOffset * -0.12;
    const horizontal = this.scrollOffset * 0.02;
    return 'translate3d(' + horizontal.toFixed(2) + 'px, ' + vertical.toFixed(2) + 'px, 0)';
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentOffset = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;
    this.scrollOffset = Math.min(currentOffset, this.maxScroll);
  }

  private buildTranslate(verticalRatio: number, horizontalRatio: number): string {
    const vertical = this.scrollOffset * verticalRatio;
    const horizontal = this.scrollOffset * horizontalRatio;
    return 'translate3d(' + horizontal.toFixed(2) + 'px, ' + vertical.toFixed(2) + 'px, 0)';
  }
}