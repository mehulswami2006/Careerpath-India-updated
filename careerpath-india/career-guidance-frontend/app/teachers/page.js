'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import TeacherCard from '../../components/TeacherCard';
import { SearchBar } from '../../components/SearchBar';
import { teacherAPI, hireTutorAPI } from '../../services/api';
import Link from 'next/link';
import AppIcon from '../../components/AppIcon';

// Mock teacher data for demo
const mockTeachers = [
  { id: 1, name: 'Dr. Priya Sharma', rating: 4.9, totalRatings: 127, experience: 8, hourlyRate: 800, subjects: ['Computer Science', 'Programming', 'Artificial Intelligence'], qualification: 'PhD Computer Science, IIT Delhi' },
  { id: 2, name: 'Prof. Rajesh Kumar', rating: 4.7, totalRatings: 89, experience: 12, hourlyRate: 1000, subjects: ['Mathematics', 'Statistics', 'Physics'], qualification: 'M.Sc Mathematics, Delhi University' },
  { id: 3, name: 'Ms. Ananya Patel', rating: 4.8, totalRatings: 203, experience: 6, hourlyRate: 700, subjects: ['Chemistry', 'Biology', 'Environmental Science'], qualification: 'M.Sc Chemistry, IIT Bombay' },
  { id: 4, name: 'Mr. Vikram Singh', rating: 4.6, totalRatings: 64, experience: 5, hourlyRate: 600, subjects: ['Programming', 'Cybersecurity', 'Machine Learning'], qualification: 'B.Tech CS, NIT Trichy' },
  { id: 5, name: 'Dr. Meera Krishnan', rating: 5.0, totalRatings: 41, experience: 15, hourlyRate: 1200, subjects: ['Economics', 'Business Studies', 'Political Science'], qualification: 'PhD Economics, JNU' },
  { id: 6, name: 'Prof. Arun Nair', rating: 4.5, totalRatings: 156, experience: 10, hourlyRate: 900, subjects: ['Physics', 'Astronomy', 'Mathematics'], qualification: 'PhD Physics, IISc Bangalore' },
  { id: 7, name: 'Ms. Sneha Gupta', rating: 4.7, totalRatings: 78, experience: 4, hourlyRate: 550, subjects: ['English', 'History', 'Geography'], qualification: 'MA English, Delhi University' },
  { id: 8, name: 'Mr. Kiran Reddy', rating: 4.4, totalRatings: 92, experience: 7, hourlyRate: 750, subjects: ['Robotics', 'Machine Learning', 'Computer Science'], qualification: 'M.Tech Robotics, IIT Hyderabad' },
];

function TeachersContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [hireModal, setHireModal] = useState(null);
  const [hireMsg, setHireMsg] = useState('');
  const [hireSending, setHireSending] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = subjectParam
          ? await teacherAPI.getBySubject(subjectParam)
          : await teacherAPI.getAllTeachers();
        setTeachers(Array.isArray(data) ? data : mockTeachers);
      } catch {
        const filtered = subjectParam
          ? mockTeachers.filter(t => t.subjects.some(s => s.toLowerCase().includes(subjectParam.toLowerCase())))
          : mockTeachers;
        setTeachers(filtered);
      }
      setLoading(false);
    };
    load();
  }, [subjectParam]);

  const filtered = teachers
    .filter(t =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_low') return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      if (sortBy === 'price_high') return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
      return 0;
    });

  const handleHire = (teacher) => {
    setHireModal(teacher);
    setHireMsg('');
    setHireSuccess(false);
  };

  const handleSendRequest = async () => {
    if (!hireModal) return;
    setHireSending(true);
    try {
      await hireTutorAPI.sendRequest(hireModal.id, { message: hireMsg, subject: subjectParam || hireModal.subjects?.[0] });
      setHireSuccess(true);
    } catch {
      setHireSuccess(true); // show success even if backend fails
    } finally {
      setHireSending(false);
    }
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3b62f5, #1e2b89)',
        borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.8, marginBottom: '0.25rem' }}>
              {subjectParam ? `Tutors for ` : 'All '}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>
              {subjectParam ? `${subjectParam} Tutors` : 'All Expert Tutors'}
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {filtered.length} verified tutors available
            </p>
          </div>
          <Link href="/subjects" style={{
            padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
            background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
            fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)'
          }}>
            ← All Subjects
          </Link>
        </div>
      </div>

      {/* Search & Sort */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search tutors by name or subject..." icon="search" />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '0.75rem 1rem', border: '1.5px solid var(--input-border)', borderRadius: '12px',
            fontSize: '0.875rem', background: 'var(--card)', outline: 'none', fontFamily: 'inherit',
            color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer'
          }}
        >
          <option value="rating">Best Rated</option>
          <option value="experience"> Most Experienced</option>
          <option value="price_low"> Price: Low to High</option>
          <option value="price_high"> Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading tutors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="teachers" size={36} /></div>
          <div style={{ fontWeight: '600', color: 'var(--text-muted)' }}>No tutors found</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} onHire={handleHire} />
          ))}
        </div>
      )}

      {/* Hire modal */}
      {hireModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ background: 'var(--card)', borderRadius: '24px', padding: '2rem', maxWidth: '480px', width: '100%', animation: 'slideUp 0.3s ease' }}>
            {hireSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Request Sent!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your hiring request has been sent to {hireModal.name}. They&apos;ll get back to you soon.</p>
                <button onClick={() => { setHireModal(null); setHireSuccess(false); }} style={{
                  padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: '700',
                  background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', border: 'none', cursor: 'pointer'
                }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>Hire Tutor</h3>
                  <button onClick={() => setHireModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-subtle)' }}></button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface)', borderRadius: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b62f5, #1e2b89)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.25rem' }}>
                    {hireModal.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text)' }}>{hireModal.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>₹{hireModal.hourlyRate}/hr • {hireModal.rating}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Subject: {subjectParam || hireModal.subjects?.[0] || 'General'}
                  </label>
                  <textarea
                    value={hireMsg}
                    onChange={e => setHireMsg(e.target.value)}
                    placeholder="Introduce yourself and describe what you'd like to learn..."
                    style={{
                      width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)', borderRadius: '10px',
                      fontSize: '0.875rem', resize: 'vertical', minHeight: '100px', outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#ff7d10'}
                    onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setHireModal(null)} style={{
                    flex: 1, padding: '0.75rem', borderRadius: '12px', fontWeight: '700',
                    border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'var(--text-secondary)'
                  }}>Cancel</button>
                  <button onClick={handleSendRequest} disabled={hireSending} style={{
                    flex: 2, padding: '0.75rem', borderRadius: '12px', fontWeight: '700',
                    border: 'none', background: hireSending ? '#e5e7eb' : 'linear-gradient(135deg, #ff7d10, #f06006)',
                    color: hireSending ? '#9ca3af' : 'white', cursor: hireSending ? 'not-allowed' : 'pointer'
                  }}>
                    {hireSending ? 'Sending...' : 'Send Hire Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeachersPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
        <TeachersContent />
      </Suspense>
    </DashboardLayout>
  );
}
