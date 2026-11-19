// Local-first User & Session Manager (Firebase Alternative)
// Operates with zero cloud setup required, storing sessions in local browser context

export interface LocalUser {
  uid: string;
  isAnonymous: boolean;
  displayName?: string | null;
  email?: string | null;
}

const GUEST_STORAGE_KEY = 'plantguard_guest_session_v1';

function getOrCreateGuestUser(): LocalUser {
  const existing = localStorage.getItem(GUEST_STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      // Ignore parse error
    }
  }

  const newGuest: LocalUser = {
    uid: 'botanist-' + Math.random().toString(36).substring(2, 9),
    isAnonymous: true,
    displayName: 'Botanist Member (Hassan)',
    email: 'hassan@verdant.atelier',
  };

  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
  return newGuest;
}

export const isFirebaseConfigured = false;
export const isAlternativeDatabaseActive = true;

export async function loginAnonymousUser(): Promise<LocalUser> {
  return getOrCreateGuestUser();
}

export function subscribeToAuth(callback: (user: LocalUser | null) => void) {
  const user = getOrCreateGuestUser();
  callback(user);
  return () => {};
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(GUEST_STORAGE_KEY);
}

export const auth = null;
export const db = null;
export const storage = null;
