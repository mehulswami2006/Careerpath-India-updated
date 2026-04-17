'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout, getUser } from '../services/auth';
import AppIcon from './AppIcon';

export default function Navbar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setUser(getUser());

    const readTheme = () => {
      const fromDoc = document.documentElement.getAttribute('data-theme');
      if (fromDoc === 'dark' || fromDoc === 'light') return fromDoc;
      const saved = localStorage.getItem('theme');
      return saved === 'dark' ? 'dark' : 'light';
    };
    setTheme(readTheme());

    const onStorage = (e) => {
      if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)', height: '64px',
      display: 'flex', alignItems: 'center', padding: '0 1.5rem',
      justifyContent: 'space-between'
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
          className="md:hidden"
        >
          <div style={{ width: '20px', height: '2px', background: 'var(--text-secondary)', marginBottom: '4px' }}></div>
          <div style={{ width: '20px', height: '2px', background: 'var(--text-secondary)', marginBottom: '4px' }}></div>
          <div style={{ width: '20px', height: '2px', background: 'var(--text-secondary)' }}></div>
        </button>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff7d10, #1e2b89)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>
            <AppIcon name="graduate" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text)', lineHeight: 1 }}>CareerPath</div>
            <div style={{ fontSize: '0.625rem', fontWeight: '600', color: '#ff7d10', textTransform: 'uppercase', letterSpacing: '0.1em' }}>India</div>
          </div>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleTheme}
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '0.4rem 0.65rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          aria-label="Toggle theme"
          title="Toggle light/dark mode"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* India flag mini badge */}
        <div style={{
          display: 'flex', gap: '2px', padding: '3px 8px', borderRadius: '6px',
          background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.75rem'
        }}>
          <AppIcon name="india" size={12} />
          <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>India</span>
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7d10, #f06006)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '0.875rem'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} className="md:block">
              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text)' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.role || 'Student'}</div>
            </div>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-subtle)' }}>▼</span>
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: '8px',
              background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-dropdown)', padding: '0.5rem',
              minWidth: '180px', zIndex: 100
            }}>
              <Link href="/profile" onClick={() => setShowDropdown(false)} style={{
                display: 'block', padding: '0.6rem 0.75rem', borderRadius: '8px',
                fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseEnter={e => e.target.style.background = 'var(--hover-surface)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>
                My Profile
              </Link>
              <Link href={user?.role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard'}
                onClick={() => setShowDropdown(false)} style={{
                  display: 'block', padding: '0.6rem 0.75rem', borderRadius: '8px',
                  fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500'
                }}
                onMouseEnter={e => e.target.style.background = 'var(--hover-surface)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Dashboard
              </Link>
              <hr style={{ margin: '0.4rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              <button onClick={handleLogout} style={{
                width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', borderRadius: '8px',
                fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: '500'
              }}
              onMouseEnter={e => e.target.style.background = '#fef2f2'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
