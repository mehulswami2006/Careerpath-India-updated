const TOKEN_KEY = 'careerpath_token';
const USER_KEY = 'careerpath_user';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export function getUserRole() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    try { return JSON.parse(user).role; } catch { return null; }
  }
  const payload = getUserFromToken();
  return payload?.role || null;
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try { return JSON.parse(user); } catch { return null; }
}

export function logout() {
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
