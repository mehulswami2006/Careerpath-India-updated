'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AppointmentCard from '../../components/AppointmentCard';
import { appointmentAPI } from '../../services/api';
import { getUser } from '../../services/auth';
import { FilterPanel } from '../../components/SearchBar';
import AppIcon from '../../components/AppIcon';

export default function AppointmentsPage() {
  const user = getUser();
  const isTeacher = user?.role === 'TEACHER';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [linkModal, setLinkModal] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = isTeacher
          ? await appointmentAPI.getTeacherAppointments()
          : await appointmentAPI.getStudentAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch {
        setAppointments([]);
      }
      setLoading(false);
    };
    load();
  }, [isTeacher]);

  const handleConfirm = async (id) => {
    try { await appointmentAPI.confirm(id); } catch {}
    setAppointments(prev => prev.map(a => String(a.id) === String(id) ? { ...a, status: 'CONFIRMED' } : a));
  };

  const handleCancel = async (id) => {
    try { await appointmentAPI.cancel(id); } catch {}
    setAppointments(prev => prev.map(a => String(a.id) === String(id) ? { ...a, status: isTeacher ? 'REJECTED' : 'CANCELLED' } : a));
  };

  const handleSendLink = (id) => {
    setLinkModal(id);
    setMeetingLink('');
  };

  const submitLink = async () => {
    if (!meetingLink.trim()) return;
    try { await appointmentAPI.sendMeetingLink(linkModal, meetingLink); } catch {}
    setAppointments(prev => prev.map(a => String(a.id) === String(linkModal) ? { ...a, meetingLink } : a));
    setLinkModal(null);
  };

  const statuses = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'];
  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}>
             Appointments
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isTeacher ? 'Manage student session requests and appointments' : 'Track your tutoring sessions'}
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#fef9c3', borderRadius: '14px', padding: '1rem', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#854d0e' }}>{counts.pending}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#92400e' }}>Pending</div>
          </div>
          <div style={{ background: '#dcfce7', borderRadius: '14px', padding: '1rem', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#166534' }}>{counts.confirmed}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#15803d' }}> Confirmed</div>
          </div>
          <div style={{ background: '#dbeafe', borderRadius: '14px', padding: '1rem', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e40af' }}>{counts.completed}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1d4ed8' }}> Completed</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ background: 'var(--card)', borderRadius: '14px', padding: '1rem 1.25rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <FilterPanel
            filters={statuses}
            activeFilter={filter}
            onFilterChange={setFilter}
            label="Filter by status:"
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="appointments" size={36} /></div>
            <div style={{ fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No appointments {filter !== 'All' ? `with status "${filter}"` : ''}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
              {!isTeacher && 'Go to Subjects → Find a tutor to book your first session!'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {filtered.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                userRole={user?.role}
                onConfirm={handleConfirm}
                onSendLink={handleSendLink}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Meeting link modal */}
        {linkModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', animation: 'slideUp 0.3s ease' }}>
              <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}> Send Meeting Link</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Share a Google Meet, Zoom, or Teams link</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {['https://meet.google.com/', 'https://zoom.us/j/', 'https://teams.microsoft.com/'].map(template => (
                  <button key={template} onClick={() => setMeetingLink(template)} style={{
                    padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid var(--input-border)',
                    background: 'var(--card)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'left'
                  }}>
                    {template.includes('google') ? ' Google Meet' : template.includes('zoom') ? ' Zoom' : ' Microsoft Teams'}
                  </button>
                ))}
              </div>

              <input
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                placeholder="Or paste your meeting link here..."
                style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', marginBottom: '1rem', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setLinkModal(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={submitLink} style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>
                  Send Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
