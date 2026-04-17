'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../services/api';
import AppIcon from '../../components/AppIcon';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)', maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="success" size={44} color="#16a34a" /></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Account Created!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Welcome to CareerPath India</p>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #ff7d10 0%, #1e2b89 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '3rem', color: 'white'
      }} className="hidden md:flex">
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem', display: 'inline-flex' }}><AppIcon name="graduate" size={56} color="#fff" /></div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '900', textAlign: 'center', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>
          Start Your Journey
        </h1>
        <p style={{ opacity: 0.9, textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
          Join thousands of Indian students and teachers using AI to build better careers.
        </p>
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '340px' }}>
          {[{ n: '50,000+', l: 'Students' }, { n: '2,000+', l: 'Teachers' }, { n: '100+', l: 'Careers' }, { n: '20+', l: 'Subjects' }].map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{n}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '440px', animation: 'slideUp 0.4s ease' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'inline-flex' }}><AppIcon name="graduate" size={32} /></div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)' }}>Join CareerPath India today</p>
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.5rem' }}>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Role selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                I am a...
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[{ value: 'STUDENT', icon: 'graduate', label: 'Student' }, { value: 'TEACHER', icon: 'teachers', label: 'Teacher' }].map(({ value, icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    style={{
                      padding: '1rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      border: `2px solid ${form.role === value ? 'var(--primary)' : 'var(--border)'}`,
                      background: form.role === value ? 'var(--sidebar-active-bg)' : 'var(--card)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem'
                    }}
                  >
                    <span style={{ display: 'inline-flex' }}><AppIcon name={icon} size={24} /></span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: form.role === value ? 'var(--primary)' : 'var(--text-secondary)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'rahul@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required
                  placeholder={placeholder}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--input-border)',
                    borderRadius: '12px', fontSize: '0.9375rem', outline: 'none',
                    transition: 'border-color 0.2s', background: 'var(--input-bg)', color: 'var(--text)'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,125,16,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              padding: '0.875rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
              background: loading ? 'var(--surface-2)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
              color: loading ? 'var(--text-muted)' : 'white',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(255,125,16,0.3)'
            }}>
              {loading ? 'Creating Account...' : `Create ${form.role === 'TEACHER' ? 'Teacher' : 'Student'} Account`}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--link)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
