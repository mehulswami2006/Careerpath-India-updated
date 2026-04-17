import AppIcon from './AppIcon';
import Link from 'next/link';

export default function CourseCard({ course, onEnroll, enrolled = false }) {
  const difficultyColor = {
    'Beginner': '#10b981',
    'Intermediate': '#f59e0b',
    'Advanced': '#ef4444'
  };

  return (
    <div style={{
      background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)',
      overflow: 'hidden', transition: 'all 0.2s', display: 'flex', flexDirection: 'column'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        background: `linear-gradient(135deg, ${course.color || '#3b62f5'}15, ${course.color || '#3b62f5'}05)`,
        borderBottom: '1px solid var(--border-soft)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', display: 'inline-flex' }}>
            <AppIcon name="courses" size={28} color={course.color || '#3b62f5'} />
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: '700',
            background: `${difficultyColor[course.difficulty] || '#94a3b8'}20`,
            color: difficultyColor[course.difficulty] || '#94a3b8'
          }}>
            {course.difficulty || 'Beginner'}
          </span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.5rem' }}>
          {course.title}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {course.description || 'Learn the fundamentals and advanced concepts.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{course.teacher || 'Expert Instructor'}</span>
          <span>{course.duration || '4 weeks'}</span>
        </div>
        {course.rating && (
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>{'★'.repeat(Math.floor(course.rating))}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.rating}/5 ({course.students || 0} students)</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: course.price === 0 ? '#10b981' : 'var(--text)' }}>
            {course.price === 0 ? 'FREE' : `₹${course.price?.toLocaleString() || '999'}`}
          </div>
          <button
            onClick={() => !enrolled && onEnroll && onEnroll(course)}
            disabled={enrolled}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '10px', fontSize: '0.8125rem',
              fontWeight: '700', border: 'none', cursor: enrolled ? 'default' : 'pointer',
              background: enrolled ? '#dcfce7' : 'linear-gradient(135deg, #ff7d10, #f06006)',
              color: enrolled ? '#16a34a' : 'white', transition: 'all 0.15s'
            }}
          >
            {enrolled ? '✅ Enrolled' : 'Enroll Now'}
          </button>
        </div>
        {/* View Details link */}
        <Link
          href={`/courses/${course.id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            width: '100%', padding: '0.45rem', borderRadius: '10px',
            fontSize: '0.8125rem', fontWeight: '700', textDecoration: 'none',
            color: course.color || '#3b62f5',
            background: `${course.color || '#3b62f5'}10`,
            border: `1px solid ${course.color || '#3b62f5'}20`,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${course.color || '#3b62f5'}20`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${course.color || '#3b62f5'}10`; }}
        >
          View Details & Watch Crash Course →
        </Link>
      </div>
    </div>
  );
}

