'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../services/api';
import { setToken, setUser, isAuthenticated, getUserRole } from '../../services/auth';
import AppIcon from '../../components/AppIcon';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      router.push(role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(form);
      setToken(data.token);
      // Decode role from token or fetch profile
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser({ name: payload.name || payload.sub, email: form.email, role: payload.role || 'STUDENT', id: payload.id });
        if (payload.role === 'TEACHER') router.push('/teacher-dashboard');
        else router.push('/student-dashboard');
      } catch {
        router.push('/student-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel - branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #1e2b89 0%, #ff7d10 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '3rem', color: 'white'
      }} className="hidden md:flex">
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem', display: 'inline-flex' }}><AppIcon name="graduate" size={56} color="#fff" /></div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
          CareerPath India
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9, textAlign: 'center', maxWidth: '380px', lineHeight: 1.6 }}>
          AI-powered career guidance, aptitude testing, and personalized tutor hiring for every Indian student.
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '320px' }}>
          {[' AI Career Recommendations', ' Aptitude Tests', ' Expert Tutors', ' Easy Appointments'].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '0.9375rem' }}>{feat}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.875rem', opacity: 0.7 }}>Made for India, By India</div>
      </div>

      {/* Right panel - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px', animation: 'slideUp 0.4s ease' }}>
          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="md:hidden">
            <div style={{ fontSize: '3rem', display: 'inline-flex' }}><AppIcon name="graduate" size={40} /></div>
            <div style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--text)' }}>CareerPath India</div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.5rem' }}>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--input-border)',
                  borderRadius: '12px', fontSize: '0.9375rem', outline: 'none',
                  transition: 'border-color 0.2s', background: 'var(--input-bg)', color: 'var(--text)'
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,125,16,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', border: '1.5px solid var(--input-border)',
                    borderRadius: '12px', fontSize: '0.9375rem', outline: 'none',
                    transition: 'border-color 0.2s', background: 'var(--input-bg)', color: 'var(--text)'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,125,16,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'
                }}>
                  <AppIcon name={showPwd ? 'eyeOff' : 'eye'} size={16} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '0.875rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'var(--surface-2)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
              color: loading ? 'var(--text-muted)' : 'white', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(255,125,16,0.3)'
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: 'var(--link)', fontWeight: '700', textDecoration: 'none' }}>
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
