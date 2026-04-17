import AppIcon from './AppIcon';

export default function AppointmentCard({ appointment, userRole, onConfirm, onSendLink, onCancel }) {
  const statusColors = {
    PENDING: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
    CONFIRMED: { bg: '#dcfce7', color: '#166534', label: 'Confirmed' },
    COMPLETED: { bg: '#dbeafe', color: '#1e40af', label: 'Completed' },
    CANCELLED: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
    REJECTED: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
  };

  const status = statusColors[appointment.status] || statusColors.PENDING;

  return (
    <div style={{
      background: 'var(--card)', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-subtle)',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)' }}>
            {userRole === 'TEACHER' ? appointment.studentName : appointment.teacherName}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {appointment.subject}
          </div>
        </div>
        <span style={{
          padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem',
          fontWeight: '700', background: status.bg, color: status.color
        }}>
          {status.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>DATE</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            {appointment.date ? new Date(appointment.date).toLocaleDateString('en-IN') : 'TBD'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>TIME</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            {appointment.time || 'TBD'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>DURATION</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            {appointment.duration || '60'} mins
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>TYPE</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            {appointment.type || 'Online'}
          </div>
        </div>
      </div>

      {appointment.meetingLink && (
        <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1rem',
          borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe',
          color: '#1d4ed8', fontSize: '0.8125rem', fontWeight: '600', textDecoration: 'none',
          marginBottom: '0.75rem'
        }}>
          <span style={{ display: 'inline-flex' }}><AppIcon name="link" size={14} color="#1d4ed8" /></span>
          Join Meeting
        </a>
      )}

      {appointment.message && (
        <div style={{
          padding: '0.75rem', borderRadius: '10px', background: 'var(--surface)',
          fontSize: '0.8125rem', color: 'var(--chip-text)', marginBottom: '0.75rem',
          borderLeft: '3px solid var(--border)'
        }}>
          {`"${appointment.message}"`}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {userRole === 'TEACHER' && appointment.status === 'PENDING' && (
          <>
            <button onClick={() => onConfirm?.(appointment.id)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '600',
              background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', cursor: 'pointer'
            }}>
              Accept
            </button>
            <button onClick={() => onCancel?.(appointment.id)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '600',
              background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', cursor: 'pointer'
            }}>
              Reject
            </button>
          </>
        )}
        {userRole === 'TEACHER' && appointment.status === 'CONFIRMED' && !appointment.meetingLink && (
          <button onClick={() => onSendLink?.(appointment.id)} style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '600',
            background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', border: 'none', cursor: 'pointer'
          }}>
            Send Meeting Link
          </button>
        )}
        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
          <button onClick={() => onCancel?.(appointment.id)} style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '600',
            background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer'
          }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
