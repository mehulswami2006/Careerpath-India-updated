'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '../services/auth';
import AppIcon from './AppIcon';

const studentNav = [
  { href: '/student-dashboard', icon: 'home', label: 'Dashboard' },
  { href: '/aptitude-test', icon: 'test', label: 'Aptitude Test' },
  { href: '/career-recommendation', icon: 'career', label: 'Career Path' },
  { href: '/courses', icon: 'courses', label: 'Courses' },
  { href: '/subjects', icon: 'subjects', label: 'Find Tutors' },
  { href: '/appointments', icon: 'appointments', label: 'Appointments' },
  { href: '/ratings', icon: 'ratings', label: 'Ratings' },
  { href: '/profile', icon: 'profile', label: 'Profile' },
];

const teacherNav = [
  { href: '/teacher-dashboard', icon: 'home', label: 'Dashboard' },
  { href: '/teacher-requests', icon: 'next', label: 'Hire Requests' },
  { href: '/subjects', icon: 'subjects', label: 'My Subjects' },
  { href: '/teachers', icon: 'teachers', label: 'Teachers' },
  { href: '/appointments', icon: 'appointments', label: 'Appointments' },
  { href: '/quiz/create', icon: 'quiz', label: 'Create Quiz' },
  { href: '/ratings', icon: 'ratings', label: 'Ratings' },
  { href: '/profile', icon: 'profile', label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const navItems = user?.role === 'TEACHER' ? teacherNav : studentNav;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 40, display: 'none'
          }}
          className="md:hidden"
        />
      )}

      <aside style={{
        position: 'fixed', top: '64px', left: 0, bottom: 0,
        width: '260px', background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto', zIndex: 40,
        display: 'flex', flexDirection: 'column',
        padding: '1.5rem 1rem',
        transform: isOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s ease'
      }}>
        {/* Role badge */}
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem',
          background: user?.role === 'TEACHER'
            ? 'linear-gradient(135deg, #1e2b89, #3b62f5)'
            : 'linear-gradient(135deg, #ff7d10, #f06006)',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role === 'TEACHER' ? 'Teacher Mode' : 'Student Mode'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '2px' }}>
            {user?.name || 'User'}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.75rem', borderRadius: '10px',
                  marginBottom: '2px', textDecoration: 'none',
                  background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--chip-text)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.875rem',
                  borderLeft: isActive ? '3px solid #ff7d10' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1rem', display: 'inline-flex' }}>
                  <AppIcon name={item.icon} size={16} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div style={{
          padding: '0.75rem', borderRadius: '12px', background: 'var(--surface)',
          border: '1px solid var(--border)', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AppIcon name="india" size={12} />
            CareerPath India
          </div>
          <div>Your AI-powered career guidance platform</div>
        </div>
      </aside>
    </>
  );
}
