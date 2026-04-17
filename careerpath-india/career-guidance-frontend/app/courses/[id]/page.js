'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import AppIcon from '../../../components/AppIcon';
import Link from 'next/link';
import { mockCourses } from '../../../data/courses';
import { courseAPI } from '../../../services/api';

const difficultyColor = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const courseId = parseInt(rawId, 10);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      // 1. Try to find in local data first — match by number OR string id
      const local = mockCourses.find(c => c.id === courseId || String(c.id) === rawId);
      if (local) { setCourse(local); setLoading(false); return; }

      // 2. Fallback to API (use raw string id in case it's a MongoDB _id)
      try {
        const data = await courseAPI.getCourseById(rawId);
        if (data) { setCourse(data); }
      } catch {
        // not found
      }
      setLoading(false);
    };
    if (rawId) load();
    else setLoading(false);
  }, [rawId]);

  const handleEnroll = async () => {
    if (enrolled || enrolling) return;
    setEnrolling(true);
    try { await courseAPI.enroll(courseId); } catch {}
    setEnrolled(true);
    setEnrollSuccess(true);
    setEnrolling(false);
    setTimeout(() => setEnrollSuccess(false), 4000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="loading-spinner" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Course Not Found</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This course doesn&apos;t exist or has been removed.</p>
          <Link href="/courses" style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
            ← Back to Courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const color = course.color || '#3b62f5';

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease', maxWidth: '860px', margin: '0 auto' }}>

        {/* Back Navigation */}
        <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.25rem' }}>
          ← Back to Courses
        </Link>

        {/* Enroll success toast */}
        {enrollSuccess && (
          <div style={{
            position: 'fixed', top: '80px', right: '1.5rem', zIndex: 999,
            background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '14px',
            padding: '0.875rem 1.5rem', fontSize: '0.875rem', fontWeight: '700',
            color: '#166534', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', animation: 'slideUp 0.3s ease'
          }}>
            ✅ Successfully enrolled in &quot;{course.title}&quot;!
          </div>
        )}

        {/* Hero Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${color}20, ${color}08)`,
          border: `1px solid ${color}30`,
          borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative bg circle */}
          <div style={{ position: 'absolute', right: '-2rem', top: '-2rem', width: '180px', height: '180px', borderRadius: '50%', background: `${color}10`, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${color}30`, flexShrink: 0
            }}>
              <AppIcon name="courses" size={32} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: '700', background: `${difficultyColor[course.difficulty] || '#94a3b8'}20`, color: difficultyColor[course.difficulty] || '#94a3b8' }}>
                  {course.difficulty}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: '700', background: `${color}15`, color: color }}>
                  {course.category}
                </span>
              </div>
              <h1 style={{ fontSize: '1.625rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.2 }}>
                {course.title}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>👨‍🏫 {course.teacher || 'Expert Instructor'}</span>
                <span>⏱ {course.duration}</span>
                {course.rating && <span>⭐ {course.rating}/5 ({course.students?.toLocaleString()} students)</span>}
              </div>
            </div>
            {/* Price + Enroll Block */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: course.price === 0 ? '#10b981' : 'var(--text)' }}>
                {course.price === 0 ? 'FREE' : `₹${course.price?.toLocaleString()}`}
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolled || enrolling}
                style={{
                  padding: '0.75rem 2rem', borderRadius: '14px', fontWeight: '800',
                  fontSize: '0.9375rem', border: 'none', cursor: (enrolled || enrolling) ? 'default' : 'pointer',
                  background: enrolled ? '#dcfce7' : `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: enrolled ? '#16a34a' : 'white',
                  boxShadow: enrolled ? 'none' : `0 4px 14px ${color}40`,
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                {enrolling ? '⏳ Enrolling...' : enrolled ? '✅ Enrolled' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>

        {/* ── YouTube Video Player ─────────────────────────────────────── */}
        {course.youtubeId && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {/* Player header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '8px', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  🎓 Crash Course Preview
                </span>
              </div>
              {/* Responsive 16:9 YouTube embed */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${course.youtubeId}?rel=0&modestbranding=1&color=white`}
                  title={`${course.title} — Crash Course`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none'
                  }}
                />
              </div>
              <div style={{ padding: '0.875rem 1.5rem', background: `${color}08`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  💡 This is a free preview. Enroll to access the full structured course with assignments, quizzes & certificate.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Topics Covered ─────────────────────────────────────────── */}
        {course.topics && course.topics.length > 0 && (
          <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}>
              📋 What You&apos;ll Learn
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.6rem' }}>
              {course.topics.map((topic, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ color: color, fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Course Info Strip ─────────────────────────────────────── */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}>
            ℹ️ Course Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Instructor', value: course.teacher || 'Expert' },
              { label: 'Duration', value: course.duration || '—' },
              { label: 'Difficulty', value: course.difficulty || '—' },
              { label: 'Category', value: course.category || '—' },
              { label: 'Total Students', value: course.students?.toLocaleString() || '—' },
              { label: 'Rating', value: course.rating ? `${course.rating} / 5 ⭐` : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '0.875rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA at bottom ─────────────────────────────────────────── */}
        <div style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}20`, borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '1rem', marginBottom: '4px' }}>
              Ready to start your journey?
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Join {course.students?.toLocaleString() || 'thousands of'} students who have already enrolled.
            </div>
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrolled || enrolling}
            style={{
              padding: '0.85rem 2.5rem', borderRadius: '14px', fontWeight: '800',
              fontSize: '1rem', border: 'none', cursor: (enrolled || enrolling) ? 'default' : 'pointer',
              background: enrolled ? '#dcfce7' : `linear-gradient(135deg, ${color}, ${color}bb)`,
              color: enrolled ? '#16a34a' : 'white',
              boxShadow: enrolled ? 'none' : `0 4px 20px ${color}40`,
              transition: 'all 0.2s'
            }}
          >
            {enrolled ? '✅ Enrolled!' : `Enroll — ${course.price === 0 ? 'FREE' : '₹' + course.price?.toLocaleString()}`}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
