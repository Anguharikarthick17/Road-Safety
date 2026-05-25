export type Role = 'public' | 'officer' | 'government';

export function login(role: Role): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('roadsos_role', role);
  localStorage.setItem('roadsos_token', `tok_${role}_${Date.now()}`);
  localStorage.setItem('roadsos_login_time', Date.now().toString());
}

export function getRole(): Role | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('roadsos_role') as Role | null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('roadsos_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('roadsos_role');
  localStorage.removeItem('roadsos_token');
  localStorage.removeItem('roadsos_login_time');
}

export function requireRole(expected: Role): boolean {
  return getRole() === expected;
}
