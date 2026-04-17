'use client';

import { useEffect } from 'react';

function resolveTheme() {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Sets `data-theme` on `<html>` on every route before dashboard UI mounts. */
export default function ThemeInit() {
  useEffect(() => {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    };

    applyTheme(resolveTheme());

    const onStorage = (e) => {
      if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
