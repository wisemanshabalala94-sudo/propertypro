import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  AuthSession,
  OwnerSignupPayload,
  Profile,
  SignInPayload,
  SupabaseAuthApiResponse,
  SupabaseAuthRequest,
  TenantOnboardingPayload,
  UserRole,
  UserSession
} from '../core/models/domain.models';

interface RemoteSignupResponse {
  session?: UserSession;
  user?: UserSession;
  profile?: Profile;
  requiresApproval?: boolean;
  redirectPath?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'wiseworx-session';
  readonly user = signal<UserSession | null>(null);

  constructor(private router: Router) {
    this.loadSession();
  }

  private loadSession(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as UserSession;
      this.user.set(parsed);
    } catch {
      localStorage.removeItem(this.storageKey);
      this.user.set(null);
    }
  }

  private persist(): void {
    const session = this.user();

    if (!session) {
      localStorage.removeItem(this.storageKey);
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  private createAuthSession(partial?: Partial<AuthSession>): AuthSession {
    return {
      accessToken: partial?.accessToken ?? null,
      refreshToken: partial?.refreshToken ?? null,
      expiresAt: partial?.expiresAt ?? null
    };
  }

  private buildProfile(session: UserSession): Profile {
    return {
      id: session.id,
      email: session.email ?? '',
      role: session.role,
      fullName: session.fullName,
      organizationId: session.organizationId ?? null,
      isApproved: session.isApproved,
      onboardingComplete: session.onboardingComplete,
      createdAt: new Date().toISOString()
    };
  }

  private getDashboardPath(role: UserRole, isApproved: boolean): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'owner':
        return '/owner/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'tenant':
        return isApproved ? '/tenant/dashboard' : '/tenant/pending';
      default:
        return '/home';
    }
  }

  private createMockSession(payload: SignInPayload): UserSession {
    const isTenant = payload.role === 'tenant';
    const isOwner = payload.role === 'owner';

    const session: UserSession = {
      id: crypto.randomUUID(),
      role: payload.role,
      fullName: isTenant ? 'Tenant User' : isOwner ? 'Owner User' : 'Admin User',
      email: payload.email,
      organizationId: 'org-001',
      subscriptionPlan: isOwner ? 'Pro' : undefined,
      roomNumber: isTenant ? 'A-101' : undefined,
      isApproved: isTenant,
      onboardingComplete: !isTenant,
      auth: this.createAuthSession()
    };

    return {
      ...session,
      profile: this.buildProfile(session)
    };
  }

  private createMockTenantSession(payload: TenantOnboardingPayload): UserSession {
    const session: UserSession = {
      id: crypto.randomUUID(),
      role: 'tenant',
      fullName: payload.fullName,
      email: payload.email,
      organizationId: 'org-tenant-001',
      roomNumber: 'Pending',
      isApproved: false,
      onboardingComplete: false,
      auth: this.createAuthSession()
    };

    return {
      ...session,
      profile: this.buildProfile(session)
    };
  }

  private createMockOwnerSession(payload: OwnerSignupPayload): UserSession {
    const session: UserSession = {
      id: crypto.randomUUID(),
      role: 'owner',
      fullName: payload.companyName,
      email: `${payload.regNumber.toLowerCase()}@owner.propertypro.local`,
      organizationId: crypto.randomUUID(),
      subscriptionPlan: payload.plan,
      isApproved: true,
      onboardingComplete: true,
      auth: this.createAuthSession()
    };

    return {
      ...session,
      profile: this.buildProfile(session)
    };
  }

  private mapSupabaseAuthResponse(
    payload: SignInPayload,
    response: SupabaseAuthApiResponse
  ): UserSession {
    const userId = response.user?.id ?? crypto.randomUUID();
    const fullNameValue = response.user?.user_metadata?.['full_name'];
    const organizationValue = response.user?.user_metadata?.['organization_id'];
    const approvedValue = response.user?.user_metadata?.['is_approved'];
    const onboardingValue = response.user?.user_metadata?.['onboarding_complete'];

    const session: UserSession = {
      id: userId,
      role: payload.role,
      fullName: typeof fullNameValue === 'string' ? fullNameValue : payload.email,
      email: response.user?.email ?? payload.email,
      organizationId: typeof organizationValue === 'string' ? organizationValue : undefined,
      isApproved: typeof approvedValue === 'boolean' ? approvedValue : payload.role !== 'tenant',
      onboardingComplete: typeof onboardingValue === 'boolean' ? onboardingValue : payload.role !== 'tenant',
      roomNumber: payload.role === 'tenant' ? 'Pending' : undefined,
      auth: this.createAuthSession({
        accessToken: response.access_token ?? null,
        refreshToken: response.refresh_token ?? null,
        expiresAt: typeof response.expires_in === 'number'
          ? new Date(Date.now() + response.expires_in * 1000).toISOString()
          : null
      })
    };

    return {
      ...session,
      profile: this.buildProfile(session)
    };
  }

  private setSession(session: UserSession): UserSession {
    this.user.set(session);
    this.persist();
    return session;
  }

  private hasSupabaseCredentials(): boolean {
    return Boolean(environment.supabaseUrl && environment.supabaseAnonKey);
  }

  private hasApiUrl(): boolean {
    return Boolean(environment.apiUrl);
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  getCurrentUser(): UserSession | null {
    return this.user();
  }

  async signIn(email: string, password: string, role: UserRole): Promise<UserSession> {
    const payload: SignInPayload = { email, password, role };

    if (!this.hasSupabaseCredentials()) {
      return this.setSession(this.createMockSession(payload));
    }

    const requestBody: SupabaseAuthRequest = {
      email: payload.email,
      password: payload.password
    };

    try {
      const response = await fetch(`${environment.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: environment.supabaseAnonKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        return this.setSession(this.createMockSession(payload));
      }

      const data = (await response.json()) as SupabaseAuthApiResponse;
      return this.setSession(this.mapSupabaseAuthResponse(payload, data));
    } catch {
      return this.setSession(this.createMockSession(payload));
    }
  }

  async signUpTenant(payload: TenantOnboardingPayload): Promise<UserSession> {
    const session = this.createMockTenantSession(payload);
    return this.setSession(session);
  }

  async signUpOwner(payload: OwnerSignupPayload): Promise<UserSession> {
    const session = this.createMockOwnerSession(payload);
    return this.setSession(session);
  }

  async approveTenant(): Promise<void> {
    const current = this.user();

    if (current?.role === 'tenant') {
      const updated: UserSession = {
        ...current,
        isApproved: true,
        onboardingComplete: true,
        roomNumber: 'B-304',
        profile: current.profile
          ? {
              ...current.profile,
              isApproved: true,
              onboardingComplete: true
            }
          : this.buildProfile({
              ...current,
              isApproved: true,
              onboardingComplete: true,
              roomNumber: 'B-304'
            })
      };

      this.setSession(updated);
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    this.user.set(null);
    await this.router.navigate(['/home']);
  }

  redirectToDashboard(): void {
    const currentUser = this.user();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate([this.getDashboardPath(currentUser.role, currentUser.isApproved)]);
  }

  async sendSignupRequest(payload: TenantOnboardingPayload): Promise<AuthResponse> {
    if (!this.hasApiUrl()) {
      const session = await this.signUpTenant(payload);
      return {
        session,
        requiresApproval: !session.isApproved,
        redirectPath: this.getDashboardPath(session.role, session.isApproved)
      };
    }

    try {
      const response = await fetch(`${environment.apiUrl}/tenant/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Signup request failed with status ${response.status}`);
      }

      const result = (await response.json()) as RemoteSignupResponse;
      const remoteSession = result.session ?? result.user;

      if (!remoteSession) {
        const fallbackSession = await this.signUpTenant(payload);
        return {
          session: fallbackSession,
          requiresApproval: !fallbackSession.isApproved,
          redirectPath: this.getDashboardPath(fallbackSession.role, fallbackSession.isApproved)
        };
      }

      const normalizedSession: UserSession = {
        ...remoteSession,
        auth: remoteSession.auth ?? this.createAuthSession(),
        onboardingComplete: remoteSession.onboardingComplete ?? false,
        isApproved: remoteSession.isApproved ?? false,
        profile: remoteSession.profile ?? result.profile ?? this.buildProfile(remoteSession)
      };

      this.setSession(normalizedSession);

      return {
        session: normalizedSession,
        requiresApproval: result.requiresApproval ?? !normalizedSession.isApproved,
        redirectPath: result.redirectPath ?? this.getDashboardPath(normalizedSession.role, normalizedSession.isApproved)
      };
    } catch {
      const session = await this.signUpTenant(payload);
      return {
        session,
        requiresApproval: !session.isApproved,
        redirectPath: this.getDashboardPath(session.role, session.isApproved)
      };
    }
  }
}