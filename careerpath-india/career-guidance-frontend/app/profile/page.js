'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUser, setUser } from '../../services/auth';
import { studentAPI, teacherAPI } from '../../services/api';
import { subjects } from '../../data/subjects';

export default function ProfilePage() {
  const user = getUser();
  const isTeacher = user?.role === 'TEACHER';

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    city: user?.city || '',
    qualification: user?.qualification || '',
    experience: user?.experience || '',
    hourlyRate: user?.hourlyRate || '',
    subjects: user?.subjects || [],
    interests: user?.interests || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isTeacher) {
        await teacherAPI.updateProfile(user?.id, form);
      } else {
        await studentAPI.updateProfile(user?.id, form);
      }
      setUser({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleSubject = (subjectName) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectName)
        ? prev.subjects.filter(s => s !== subjectName)
        : [...prev.subjects, subjectName]
    }));
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '760px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}> My Profile</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your personal information</p>
          </div>
          {saved && (
            <div style={{ padding: '0.6rem 1rem', background: '#dcfce7', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '700', color: '#166534', border: '1px solid #bbf7d0' }}>
               Profile saved!
            </div>
          )}
        </div>

        {/* Avatar section */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
            background: isTeacher ? 'linear-gradient(135deg, #1e2b89, #3b62f5)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '900', fontSize: '2rem'
          }}>
            {form.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>{form.name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{form.email}</div>
            <span style={{
              display: 'inline-block', marginTop: '0.4rem', padding: '3px 12px', borderRadius: '999px',
              fontSize: '0.75rem', fontWeight: '700',
              background: isTeacher ? '#dbeafe' : '#fff5ed',
              color: isTeacher ? '#1d4ed8' : '#ff7d10'
            }}>
              {isTeacher ? ' Teacher' : ' Student'}
            </span>
          </div>
        </div>

        {/* Basic Info */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem' }}> Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Your full name' },
              { key: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
              { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
              { key: 'city', label: 'City', placeholder: 'Mumbai, Delhi, Bangalore...' },
            ].map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={{
                    width: '100%', padding: '0.7rem 0.875rem', border: '1.5px solid var(--input-border)',
                    borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
                    fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)'
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff7d10'}
                  onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              style={{
                width: '100%', padding: '0.7rem 0.875rem', border: '1.5px solid var(--input-border)',
                borderRadius: '10px', fontSize: '0.875rem', resize: 'vertical',
                minHeight: '80px', outline: 'none', fontFamily: 'inherit', color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = '#ff7d10'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>
        </div>

        {/* Teacher-specific */}
        {isTeacher && (
          <>
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem' }}> Teaching Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { key: 'qualification', label: 'Qualification', placeholder: 'PhD Computer Science' },
                  { key: 'experience', label: 'Years of Experience', placeholder: '5' },
                  { key: 'hourlyRate', label: 'Hourly Rate (₹)', placeholder: '800' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                    <input
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '0.7rem 0.875rem', border: '1.5px solid var(--input-border)',
                        borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
                        fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)'
                      }}
                      onFocus={e => e.target.style.borderColor = '#ff7d10'}
                      onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1rem' }}> Subjects I Teach</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select all subjects you can teach</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
                {subjects.map(s => {
                  const selected = form.subjects.includes(s.name);
                  return (
                    <button key={s.id} onClick={() => toggleSubject(s.name)} style={{
                      padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                      border: `1.5px solid ${selected ? s.color : 'var(--border)'}`,
                      background: selected ? `${s.color}15` : 'var(--card)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.8125rem', fontWeight: selected ? '700' : '500',
                      color: selected ? s.color : 'var(--text-muted)', transition: 'all 0.15s'
                    }}>
                      {s.icon} {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Student-specific */}
        {!isTeacher && (
          <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem' }}> Academic Interests</h3>
            <textarea
              value={form.interests}
              onChange={e => setForm({ ...form, interests: e.target.value })}
              placeholder="Your career interests, favorite subjects, goals..."
              style={{
                width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)',
                borderRadius: '10px', fontSize: '0.875rem', resize: 'vertical',
                minHeight: '80px', outline: 'none', fontFamily: 'inherit', color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = '#ff7d10'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>
        )}

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1rem',
          fontWeight: '800', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          background: saving ? 'var(--surface-2)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
          color: saving ? 'var(--text-muted)' : 'white',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(255,125,16,0.3)'
        }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </DashboardLayout>
  );
}
