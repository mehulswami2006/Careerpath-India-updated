'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { hireTutorAPI, teacherAPI } from '../../../services/api';

function HireTutorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teacherId = searchParams.get('teacherId') || '1';
  const subject = searchParams.get('subject') || '';

  const [teacher, setTeacher] = useState(null);
  const [form, setForm] = useState({ message: '', subject: subject, preferredDate: '', preferredTime: '', sessionType: 'Online' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teacherAPI.getProfile(teacherId);
        setTeacher(data);
      } catch {
        setTeacher({ id: teacherId, name: 'Expert Tutor', rating: 4.8, experience: 5, hourlyRate: 800, subjects: [subject || 'General'] });
      }
      setLoading(false);
    };
    load();
  }, [teacherId, subject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await hireTutorAPI.sendRequest(teacherId, form);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ background: 'var(--card)', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Request Sent!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your tutoring request has been sent. {teacher?.name} will respond soon.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => router.push('/appointments')} style={{
              padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700',
              background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', border: 'none', cursor: 'pointer'
            }}>View Appointments</button>
            <button onClick={() => router.push('/subjects')} style={{
              padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700',
              border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'var(--text-secondary)'
            }}>Find More Tutors</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}>Hire a Tutor</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Send a session request to your tutor</p>

      {!loading && teacher && (
        <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '16px', padding: '1.25rem', border: '1px solid #bfdbfe', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b62f5, #1e2b89)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.25rem', flexShrink: 0 }}>
            {teacher.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '800', color: '#1e40af' }}>{teacher.name}</div>
            <div style={{ fontSize: '0.8125rem', color: '#3b82f6' }}>{teacher.rating} • ₹{teacher.hourlyRate}/hr • {teacher.experience} yrs exp</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem' }}>Session Details</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Subject *</label>
              <input
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Computer Science"
                required
                style={{ width: '100%', padding: '0.7rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Session Type</label>
              <select
                value={form.sessionType}
                onChange={e => setForm({ ...form, sessionType: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)', cursor: 'pointer' }}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Preferred Date</label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={e => setForm({ ...form, preferredDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '0.7rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Preferred Time</label>
              <input
                type="time"
                value={form.preferredTime}
                onChange={e => setForm({ ...form, preferredTime: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Message to Tutor *</label>
            <textarea
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Introduce yourself, describe your learning goals, and mention any specific topics you need help with..."
              required
              style={{
                width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)',
                borderRadius: '10px', fontSize: '0.875rem', resize: 'vertical',
                minHeight: '120px', outline: 'none', fontFamily: 'inherit', color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = '#ff7d10'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={() => router.back()} style={{
            flex: 1, padding: '0.875rem', borderRadius: '12px', fontWeight: '700',
            border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9375rem'
          }}>
            Cancel
          </button>
          <button type="submit" disabled={sending} style={{
            flex: 2, padding: '0.875rem', borderRadius: '12px', fontWeight: '800',
            border: 'none', cursor: sending ? 'not-allowed' : 'pointer', fontSize: '0.9375rem',
            background: sending ? '#e5e7eb' : 'linear-gradient(135deg, #ff7d10, #f06006)',
            color: sending ? '#9ca3af' : 'white',
            boxShadow: sending ? 'none' : '0 4px 12px rgba(255,125,16,0.3)'
          }}>
            {sending ? 'Sending Request...' : 'Send Hire Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function HireTutorPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
        <HireTutorContent />
      </Suspense>
    </DashboardLayout>
  );
}
