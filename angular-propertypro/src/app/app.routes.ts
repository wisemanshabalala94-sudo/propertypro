import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { TenantSignupComponent } from './pages/onboarding/tenant-signup.component';
import { OwnerSignupComponent } from './pages/onboarding/owner-signup.component';
import { TenantPendingComponent } from './pages/status/pending.component';
import { TenantDashboardComponent } from './tenant-dashboard.component';
import { OwnerDashboardComponent } from './owner-dashboard.component';
import { StaffDashboardComponent } from './staff-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { PayrollSummaryComponent } from './pages/payroll/payroll-summary.component';
import { PayslipListComponent } from './pages/payroll/payslip-list.component';
import { PayslipDetailComponent } from './pages/payroll/payslip-detail.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup/tenant', component: TenantSignupComponent },
  { path: 'signup/owner', component: OwnerSignupComponent },
  { path: 'tenant/pending', component: TenantPendingComponent },
  {
    path: 'tenant/dashboard',
    component: TenantDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'tenant' }
  },
  {
    path: 'owner/dashboard',
    component: OwnerDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'owner' }
  },
  {
    path: 'owner/payslips',
    component: PayslipListComponent,
    canActivate: [roleGuard],
    data: { role: 'owner' }
  },
  {
    path: 'owner/payslips/:id',
    component: PayslipDetailComponent,
    canActivate: [roleGuard],
    data: { role: 'owner' }
  },
  {
    path: 'staff/dashboard',
    component: StaffDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'staff' }
  },
  {
    path: 'staff/payroll',
    component: PayrollSummaryComponent,
    canActivate: [roleGuard],
    data: { role: 'staff' }
  },
  {
    path: 'staff/payslips',
    component: PayslipListComponent,
    canActivate: [roleGuard],
    data: { role: 'staff' }
  },
  {
    path: 'staff/payslips/:id',
    component: PayslipDetailComponent,
    canActivate: [roleGuard],
    data: { role: 'staff' }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'admin' }
  },
  { path: '**', redirectTo: '' }
];
