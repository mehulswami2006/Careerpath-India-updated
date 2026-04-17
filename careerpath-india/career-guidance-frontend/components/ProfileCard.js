export default function ProfileCard({ user, compact = false }) {
  if (!user) return null;
  const isTeacher = user.role === 'TEACHER';

  return (
    <div style={{
      background: 'var(--card)', borderRadius: '20px',
      border: '1px solid var(--border)', overflow: 'hidden'
    }}>
      {/* Header gradient */}
      <div style={{
        height: compact ? '60px' : '80px',
        background: isTeacher
          ? 'linear-gradient(135deg, #1e2b89, #3b62f5)'
          : 'linear-gradient(135deg, #ff7d10, #f06006)',
        position: 'relative'
      }} />

      <div style={{ padding: compact ? '0 1.25rem 1.25rem' : '0 1.5rem 1.5rem', textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{
          width: compact ? '64px' : '80px', height: compact ? '64px' : '80px',
          borderRadius: '50%', margin: '-32px auto 0',
          background: isTeacher ? 'linear-gradient(135deg, #1e2b89, #3b62f5)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
          border: '4px solid var(--card)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: '800',
          fontSize: compact ? '1.5rem' : '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: compact ? '1rem' : '1.25rem', fontWeight: '800', color: 'var(--text)' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {user.email}
          </div>
          <span style={{
            display: 'inline-block', marginTop: '0.5rem', padding: '3px 12px',
            borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
            background: isTeacher ? '#dbeafe' : '#fff5ed',
            color: isTeacher ? '#1d4ed8' : '#ff7d10'
          }}>
            {isTeacher ? 'Teacher' : 'Student'}
          </span>
        </div>

        {!compact && (
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
            {isTeacher ? (
              <>
                <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1d4ed8' }}>{user.totalStudents || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Students</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f59e0b' }}>{user.rating?.toFixed(1) || '0.0'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Rating</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ff7d10' }}>{user.aptitudeScore || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Aptitude Score</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>{user.coursesEnrolled || 0}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Courses</div>
                </div>
              </>
            )}
          </div>
        )}

        {user.bio && !compact && (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem', background: 'var(--surface)',
            borderRadius: '12px', fontSize: '0.8125rem', color: 'var(--text-muted)',
            textAlign: 'left', lineHeight: 1.5
          }}>
            {user.bio}
          </div>
        )}
      </div>
    </div>
  );
}
