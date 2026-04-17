import Link from 'next/link';

export default function TeacherCard({ teacher, onHire }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f59e0b' : 'var(--star-empty)', fontSize: '0.875rem' }}></span>
    ));
  };

  return (
    <div style={{
      background: 'var(--card)', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-subtle)',
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #3b62f5, #1e2b89)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '800', fontSize: '1.25rem'
        }}>
          {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)' }}>{teacher.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {renderStars(teacher.rating || 0)}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              {teacher.rating?.toFixed(1) || '0.0'} ({teacher.totalRatings || 0} reviews)
            </span>
          </div>
        </div>

        <div style={{
          padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem',
          fontWeight: '700', background: '#dcfce7', color: '#16a34a'
        }}>
          Available
        </div>
      </div>

      {/* Details */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>EXPERIENCE</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{teacher.experience || 'N/A'} years</div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600' }}>HOURLY PRICE</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)' }}>₹{teacher.hourlyRate || 500}/hr</div>
        </div>
      </div>

      {/* Subjects */}
      {teacher.subjects && teacher.subjects.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600', marginBottom: '6px' }}>SUBJECTS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {teacher.subjects.slice(0, 4).map((s, i) => (
              <span key={i} style={{
                padding: '2px 8px', borderRadius: '6px', fontSize: '0.6875rem',
                background: '#eff6ff', color: '#1d4ed8', fontWeight: '500'
              }}>{s}</span>
            ))}
            {teacher.subjects.length > 4 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>+{teacher.subjects.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Link href={`/profile?id=${teacher.id}&type=teacher`} style={{
          flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.8125rem',
          fontWeight: '600', border: '2px solid var(--border)', color: 'var(--text-secondary)',
          textDecoration: 'none', textAlign: 'center',
          transition: 'all 0.15s'
        }}>
          View Profile
        </Link>
        <button
          onClick={() => onHire && onHire(teacher)}
          style={{
            flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.8125rem',
            fontWeight: '600', background: 'linear-gradient(135deg, #ff7d10, #f06006)',
            color: 'white', border: 'none', cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Hire Tutor
        </button>
      </div>
    </div>
  );
}
