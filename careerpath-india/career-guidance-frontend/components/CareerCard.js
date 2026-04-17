import Link from 'next/link';

export default function CareerCard({ career, compact = false }) {
  return (
    <Link href={`/career-details/${encodeURIComponent(career.name)}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--card)', borderRadius: '16px', padding: compact ? '1rem' : '1.5rem',
        border: '1px solid var(--border)', cursor: 'pointer',
        transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
        height: '100%', display: 'flex', flexDirection: 'column'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${career.color}25`;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = career.color;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}>
        {/* Color bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: career.color, borderRadius: '16px 16px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: `${career.color}15`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.5rem', border: `1px solid ${career.color}30`
          }}>
            {career.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text)', marginBottom: '2px' }}>
              {career.name}
            </div>
            <span style={{
              display: 'inline-block', padding: '1px 8px', borderRadius: '999px',
              fontSize: '0.6875rem', fontWeight: '600', background: `${career.color}15`,
              color: career.color
            }}>
              {career.category}
            </span>
          </div>
        </div>

        {!compact && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem', flex: 1 }}>
            {career.description}
          </p>
        )}

        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600', marginBottom: '4px' }}>SALARY RANGE</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#059669' }}>{career.salaryRange}</div>
        </div>

        {!compact && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '600', marginBottom: '6px' }}>TOP SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {career.skills.slice(0, 3).map((skill, i) => (
                <span key={i} style={{
                  padding: '2px 8px', borderRadius: '6px', fontSize: '0.6875rem',
                  background: 'var(--chip-bg)', color: 'var(--chip-text)', fontWeight: '500'
                }}>{skill}</span>
              ))}
              {career.skills.length > 3 && (
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>+{career.skills.length - 3}</span>
              )}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: career.color, fontWeight: '600' }}>View Details →</span>
          <span style={{
            fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '999px',
            background: career.jobOutlook === 'Excellent' ? '#dcfce7' : career.jobOutlook === 'Very Good' ? '#dbeafe' : '#f3f4f6',
            color: career.jobOutlook === 'Excellent' ? '#16a34a' : career.jobOutlook === 'Very Good' ? '#1d4ed8' : '#6b7280',
            fontWeight: '600'
          }}>
            {career.jobOutlook}
          </span>
        </div>
      </div>
    </Link>
  );
}
