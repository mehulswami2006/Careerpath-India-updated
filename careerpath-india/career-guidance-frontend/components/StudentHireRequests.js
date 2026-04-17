'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { hireTutorAPI, appointmentAPI, teacherAPI } from '../services/api';

function sortStudentRequests(list) {
  const rank = (s) => (s === 'PENDING' ? 0 : s === 'ACCEPTED' ? 1 : 2);
  return [...list].sort((a, b) => rank(a.status) - rank(b.status));
}

export default function StudentHireRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherNameMap, setTeacherNameMap] = useState({});
  const [bookFor, setBookFor] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookForm, setBookForm] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'Online',
    message: '',
  });

  const load = useCallback(async () => {
    try {
      const [data, teachers] = await Promise.allSettled([
        hireTutorAPI.getStudentRequests(),
        teacherAPI.getAllTeachers(),
      ]);
      // Build email → name map
      if (teachers.status === 'fulfilled' && Array.isArray(teachers.value)) {
        const map = {};
        teachers.value.forEach(t => { if (t.email && t.name) map[t.email] = t.name; });
        setTeacherNameMap(map);
      }
      setRequests(
        data.status === 'fulfilled' && Array.isArray(data.value)
          ? sortStudentRequests(data.value)
          : []
      );
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openBook = (r) => {
    setBookFor(r);
    setBookForm({
      date: r.preferredDate || '',
      time: r.preferredTime || '',
      duration: 60,
      type: r.sessionType || 'Online',
      message: r.message ? `Follow-up: ${r.message}` : '',
    });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookFor?.teacherEmail || !bookForm.date || !bookForm.time) return;
    setBooking(true);
    try {
      await appointmentAPI.create({
        teacherEmail: bookFor.teacherEmail,
        subject: bookFor.subject || 'General',
        date: bookForm.date,
        time: bookForm.time,
        duration: bookForm.duration,
        type: bookForm.type,
        message: bookForm.message || '',
      });
      setBookFor(null);
      await load();
    } catch {
      await load();
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}></div>
        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No tutor requests yet</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '0.35rem', marginBottom: '1rem' }}>
          Browse subjects and hire a tutor to get started.
        </div>
        <Link
          href="/subjects"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.875rem',
            background: 'linear-gradient(135deg, #ff7d10, #f06006)',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Find tutors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}>
         Your tutor requests
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {requests.map((r) => (
          <div
            key={r.id}
            style={{
              padding: '1rem 1.15rem',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              background: 'var(--card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Tutor · <span style={{ fontWeight: '600', color: 'var(--text)' }}>
                    {teacherNameMap[r.teacherEmail] || r.teacherEmail}
                  </span>
                </div>
                <div style={{ fontWeight: '700', color: 'var(--text)', marginTop: '6px' }}>{r.subject || 'Session'}</div>
                {r.message && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.45 }}>
                    {r.message}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background:
                    r.status === 'PENDING' ? '#fef9c3' : r.status === 'ACCEPTED' ? '#dcfce7' : '#fee2e2',
                  color:
                    r.status === 'PENDING' ? '#854d0e' : r.status === 'ACCEPTED' ? '#166534' : '#991b1b',
                }}
              >
                {r.status}
              </span>
            </div>
            {r.status === 'PENDING' && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '10px', marginBottom: 0 }}>
                Waiting for the tutor to accept your request.
              </p>
            )}
            {r.status === 'ACCEPTED' && (
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => openBook(r)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.8125rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3b62f5, #1e2b89)',
                    color: 'white',
                  }}
                >
                  Book session
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: '10px' }}>
                  Schedule a time — your tutor will confirm and share a meeting link.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {bookFor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <form
            onSubmit={submitBooking}
            style={{
              background: 'var(--card)',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.35rem' }}>Book a session</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {bookFor.subject} with {teacherNameMap[bookFor.teacherEmail] || bookFor.teacherEmail}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookForm.date}
                  onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--input-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={bookForm.time}
                  onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--input-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Duration (min)
                </label>
                <input
                  type="number"
                  min={30}
                  step={15}
                  value={bookForm.duration}
                  onChange={(e) => setBookForm({ ...bookForm, duration: Number(e.target.value) || 60 })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--input-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Type
                </label>
                <select
                  value={bookForm.type}
                  onChange={(e) => setBookForm({ ...bookForm, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--input-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                    background: 'var(--card)',
                  }}
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                Message (optional)
              </label>
              <textarea
                value={bookForm.message}
                onChange={(e) => setBookForm({ ...bookForm, message: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: '1.5px solid var(--input-border)',
                  fontSize: '0.875rem',
                  color: 'var(--text)',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setBookFor(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--border)',
                  background: 'var(--card)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={booking}
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: booking ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  background: booking ? '#e5e7eb' : 'linear-gradient(135deg, #ff7d10, #f06006)',
                  color: booking ? '#9ca3af' : 'white',
                }}
              >
                {booking ? 'Sending…' : 'Request appointment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
