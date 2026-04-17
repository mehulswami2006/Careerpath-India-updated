'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import RatingComponent from '../../components/RatingComponent';
import { ratingAPI, appointmentAPI } from '../../services/api';
import { getUser } from '../../services/auth';
import AppIcon from '../../components/AppIcon';

const mockRatings = [
  { id: 1, teacherName: 'Dr. Priya Sharma', teacherId: 1, subject: 'Computer Science', rating: 5, feedback: 'Excellent teaching style! Concepts were explained very clearly.', date: '2026-03-10' },
  { id: 2, teacherName: 'Prof. Rajesh Kumar', teacherId: 2, subject: 'Mathematics', rating: 4, feedback: 'Very knowledgeable and patient teacher.', date: '2026-03-05' },
];

const mockReceivedRatings = [
  { id: 1, studentName: 'Arjun Mehta', rating: 5, feedback: 'Wonderful student, very attentive and hardworking!', subject: 'Computer Science', date: '2026-03-10' },
  { id: 2, studentName: 'Kavya Rao', rating: 4, feedback: 'Good student, asks great questions.', subject: 'Programming', date: '2026-03-08' },
  { id: 3, studentName: 'Ravi Teja', rating: 5, feedback: 'Excellent progress in a short time!', subject: 'AI/ML', date: '2026-03-01' },
];

const mockTeachersToRate = [
  { id: 3, name: 'Ms. Ananya Patel', subject: 'Chemistry', appointmentId: 3 },
];

export default function RatingsPage() {
  const user = getUser();
  const isTeacher = user?.role === 'TEACHER';
  const [myRatings, setMyRatings] = useState([]);
  const [receivedRatings, setReceivedRatings] = useState([]);
  const [pendingRatings, setPendingRatings] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isTeacher) {
          setMyRatings(mockRatings);
          setPendingRatings(mockTeachersToRate);
        } else {
          setReceivedRatings(mockReceivedRatings);
        }
      } catch {
        setMyRatings(mockRatings);
      }
      setLoading(false);
    };
    load();
  }, [isTeacher]);

  const handleRateTeacher = async ({ rating, feedback }, teacherId) => {
    try {
      await ratingAPI.rateTeacher(teacherId, { rating, feedback });
    } catch {}
    setPendingRatings(prev => prev.filter(t => t.id !== teacherId));
    setMyRatings(prev => [...prev, {
      id: Date.now(), teacherId, rating, feedback,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const avgRating = receivedRatings.length > 0
    ? (receivedRatings.reduce((s, r) => s + r.rating, 0) / receivedRatings.length).toFixed(1)
    : '0.0';

  const renderStars = (rating, size = '1rem') => (
    <span style={{ fontSize: size }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );

  const tabs = isTeacher
    ? [{ key: 'received', label: `Received (${receivedRatings.length})` }]
    : [
        { key: 'pending', label: `Pending (${pendingRatings.length})` },
        { key: 'given', label: `Given (${myRatings.length})` },
      ];

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '900', marginBottom: '0.25rem' }}>Ratings & Reviews</h1>
              <p style={{ opacity: 0.9 }}>
                {isTeacher ? 'See what students say about you' : 'Rate your tutors and sessions'}
              </p>
            </div>
            {isTeacher && (
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1rem 1.5rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{avgRating}</div>
                <div style={{ fontSize: '1.25rem', letterSpacing: '2px' }}>{'★'.repeat(Math.round(parseFloat(avgRating)))}{'☆'.repeat(5 - Math.round(parseFloat(avgRating)))}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{receivedRatings.length} reviews</div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem',
                fontWeight: '700', border: 'none', cursor: 'pointer',
                background: tab === t.key ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--surface)',
                color: tab === t.key ? 'white' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <>
            {/* Pending ratings (student) */}
            {tab === 'pending' && !isTeacher && (
              <div>
                {pendingRatings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="ratings" size={36} /></div>
                    <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>All caught up!</div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', marginTop: '0.5rem' }}>No pending ratings. Complete sessions to rate tutors.</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {pendingRatings.map(t => (
                      <div key={t.id} style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: '10px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b62f5, #1e2b89)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
                            {t.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text)' }}>{t.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.subject}</div>
                          </div>
                        </div>
                        <RatingComponent
                          targetName={t.name}
                          type="teacher"
                          onSubmit={(data) => handleRateTeacher(data, t.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Given ratings (student) */}
            {tab === 'given' && !isTeacher && (
              <div>
                {myRatings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="ratings" size={36} /></div>
                    <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>No ratings given yet</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myRatings.map(r => (
                      <div key={r.id} style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text)' }}>{r.teacherName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.subject}</div>
                          </div>
                          <div>
                            <span style={{ color: '#f59e0b', fontSize: '1.125rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', textAlign: 'right' }}>{r.date}</div>
                          </div>
                        </div>
                        {r.feedback && (
                          <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '8px', fontSize: '0.875rem', color: '#475569', fontStyle: 'italic' }}>
                            {`"${r.feedback}"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Received ratings (teacher) */}
            {tab === 'received' && isTeacher && (
              <div>
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = receivedRatings.filter(r => r.rating === star).length;
                    const pct = receivedRatings.length > 0 ? (count / receivedRatings.length) * 100 : 0;
                    return (
                        <div key={star} style={{ background: 'var(--card)', borderRadius: '12px', padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f59e0b' }}>{'★'.repeat(star)}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>{count}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>{Math.round(pct)}%</div>
                      </div>
                    );
                  })}
                </div>

                {receivedRatings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="ratings" size={36} /></div>
                    <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>No ratings received yet</div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Complete sessions with students to receive ratings.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {receivedRatings.map(r => (
                      <div key={r.id} style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff7d10, #f06006)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', flexShrink: 0 }}>
                            {r.studentName?.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ fontWeight: '700', color: 'var(--text)' }}>{r.studentName}</div>
                              <div style={{ color: '#f59e0b', fontSize: '1rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.subject} • {r.date}</div>
                          </div>
                        </div>
                        {r.feedback && (
                          <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '8px', fontSize: '0.875rem', color: '#92400e', borderLeft: '3px solid #f59e0b', fontStyle: 'italic' }}>
                            {`"${r.feedback}"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
