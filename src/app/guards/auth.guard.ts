import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  const parsed = JSON.parse(user);
  if (parsed.role !== 'ADMIN') {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};