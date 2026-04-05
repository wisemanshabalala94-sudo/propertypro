import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../core/models/domain.models';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const current = authService.getCurrentUser();

  if (!current) {
    router.navigate(['/login']);
    return false;
  }

  if (current.role === 'tenant' && !current.isApproved && state.url !== '/tenant/pending') {
    router.navigate(['/tenant/pending']);
    return false;
  }

  const requiredRole = route.data?.['role'] as UserRole | undefined;
  if (requiredRole && current.role !== requiredRole) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};