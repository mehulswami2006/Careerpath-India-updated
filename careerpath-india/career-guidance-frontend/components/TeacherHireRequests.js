'use client';
import { useState, useEffect, useCallback } from 'react';
import { hireTutorAPI, appointmentAPI } from '../services/api';
import AppIcon from './AppIcon';

function sortRequests(list) {
  const rank = (s) => (s === 'PENDING' ? 0 : s === 'ACCEPTED' ? 1 : 2);
  return [...list].sort((a, b) => rank(a.status) - rank(b.status));
}

const emptyScheduleForm = () => ({
  date: '',
  time: '',
  duration: 60,
  type: 'Online',
  message: '',
  meetingLink: '',
});

export default function TeacherHireRequests({ showTitle = true }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [acceptModal, setAcceptModal] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm);

  const load = useCallback(async () => {
    try {
      const data = await hireTutorAPI.getTeacherRequests();
      setRequests(Array.isArray(data) ? sortRequests(data) : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAcceptModal = (r) => {
    setAcceptModal(r);
    setScheduleForm({
      ...emptyScheduleForm(),
      date: r.preferredDate || '',
      time: r.preferredTime || '',
      type: r.sessionType || 'Online',
      message: r.message ? `Accepted: ${r.message}` : '',
    });
  };

  const handleAcceptOnly = async () => {
    if (!acceptModal) return;
    setActingId(acceptModal.id);
    try {
      await hireTutorAPI.acceptRequest(acceptModal.id);
      setAcceptModal(null);
      await load();
    } catch {
      await load();
    } finally {
      setActingId(null);
    }
  };

  const handleAcceptAndSchedule = async (e) => {
    e.preventDefault();
    if (!acceptModal) return;
    if (!scheduleForm.date?.trim() || !scheduleForm.time?.trim()) return;
    setActingId(acceptModal.id);
    try {
      await hireTutorAPI.acceptRequest(acceptModal.id);
      await appointmentAPI.createTeacherSchedule({
        studentEmail: acceptModal.studentEmail,
        subject: acceptModal.subject || 'Session',
        date: scheduleForm.date,
        time: scheduleForm.time,
        duration: scheduleForm.duration,
        type: scheduleForm.type,
        message: scheduleForm.message || '',
        meetingLink: scheduleForm.meetingLink?.trim() || undefined,
      });
      setAcceptModal(null);
      setScheduleForm(emptyScheduleForm());
      await load();
    } catch {
      await load();
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    setActingId(id);
    try {
      await hireTutorAPI.rejectRequest(id);
      await load();
    } catch {
      await load();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}> Hire requests</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Accept and optionally schedule the first session (date, time, meeting link).
            </p>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'inline-flex' }}><AppIcon name="teachers" size={24} /></div>
          <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No hire requests yet</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            When a student sends a request from Find Tutors, it will appear here.
          </div>
        </div>
      ) : (
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
                  <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '0.95rem' }}>{r.studentName || 'Student'}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>{r.subject || '—'}</strong>
                    {r.sessionType ? ` · ${r.sessionType}` : ''}
                  </div>
                  {(r.preferredDate || r.preferredTime) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '6px' }}>
                      Preferred: {r.preferredDate || '—'} {r.preferredTime ? `· ${r.preferredTime}` : ''}
                    </div>
                  )}
                  {r.message && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.45 }}>
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.status}
                </span>
              </div>
              {r.status === 'PENDING' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={actingId === r.id}
                    onClick={() => openAcceptModal(r)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.8125rem',
                      border: 'none',
                      cursor: actingId === r.id ? 'not-allowed' : 'pointer',
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: 'white',
                      opacity: actingId === r.id ? 0.7 : 1,
                    }}
                  >
                    Accept &amp; schedule
                  </button>
                  <button
                    type="button"
                    disabled={actingId === r.id}
                    onClick={() => handleReject(r.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.8125rem',
                      border: '2px solid var(--border)',
                      background: 'var(--card)',
                      cursor: actingId === r.id ? 'not-allowed' : 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {acceptModal && (
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
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '460px',
              width: '100%',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.35rem' }}>Accept &amp; schedule session</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {acceptModal.studentName} · {acceptModal.subject || 'Session'}
            </p>

            <form onSubmit={handleAcceptAndSchedule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Session date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
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
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
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
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, duration: Number(e.target.value) || 60 })}
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
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
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
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Note to student (optional)
                </label>
                <textarea
                  value={scheduleForm.message}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                  rows={2}
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
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Online meeting link (optional)
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/..."
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={actingId === acceptModal.id}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: actingId === acceptModal.id ? 'not-allowed' : 'pointer',
                    fontWeight: '800',
                    background: actingId === acceptModal.id ? '#e5e7eb' : 'linear-gradient(135deg, #059669, #047857)',
                    color: actingId === acceptModal.id ? '#9ca3af' : 'white',
                  }}
                >
                  {actingId === acceptModal.id ? 'Saving…' : 'Accept hire & create session'}
                </button>
                <button
                  type="button"
                  disabled={actingId === acceptModal.id}
                  onClick={handleAcceptOnly}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--card)',
                    cursor: actingId === acceptModal.id ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Accept hire only (student books later)
                </button>
                <button
                  type="button"
                  onClick={() => { setAcceptModal(null); setScheduleForm(emptyScheduleForm()); }}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
