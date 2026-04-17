import { getUser, getUserFromToken } from './auth';

const APTITUDE_KEY_PREFIX = 'careerpath_aptitude';

function getCurrentUserIdentifier() {
  const user = getUser();
  const email = user?.email || getUserFromToken()?.sub;
  return email ? String(email).toLowerCase() : 'anonymous';
}

export function getAptitudeStorageKey() {
  return `${APTITUDE_KEY_PREFIX}_${getCurrentUserIdentifier()}`;
}

export function saveAptitudeResult(result) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getAptitudeStorageKey(), JSON.stringify(result));
}

export function readAptitudeResult() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(getAptitudeStorageKey());
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
