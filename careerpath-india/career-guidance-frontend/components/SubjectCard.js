import Link from 'next/link';

export default function SubjectCard({ subject, onClick }) {
  return (
    <div
      onClick={() => onClick ? onClick(subject) : null}
      style={{
        background: 'var(--card)', borderRadius: '16px', padding: '1.5rem',
        border: '1px solid var(--border)', cursor: 'pointer',
        transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${subject.color}25`;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = subject.color;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Top color accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: subject.color, borderRadius: '16px 16px 0 0'
      }} />

      <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 0.75rem',
          background: `${subject.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', border: `1px solid ${subject.color}30`
        }}>
          {subject.icon}
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.4rem' }}>
          {subject.name}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
          {subject.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {subject.topics?.slice(0, 3).map((t, i) => (
            <span key={i} style={{
              padding: '2px 8px', borderRadius: '6px', fontSize: '0.6875rem',
              background: `${subject.color}10`, color: subject.color, fontWeight: '500'
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8125rem',
          fontWeight: '600', background: `${subject.color}15`, color: subject.color
        }}>
          Find Tutors →
        </div>
      </div>
    </div>
  );
}
