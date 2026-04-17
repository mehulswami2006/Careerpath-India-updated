'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CourseCard from '../../components/CourseCard';
import { SearchBar, FilterPanel } from '../../components/SearchBar';
import { courseAPI } from '../../services/api';
import AppIcon from '../../components/AppIcon';
import { mockCourses } from '../../data/courses';



const categories = ['All', 'Technology', 'Mathematics', 'Science', 'AI/ML', 'Languages', 'Government', 'Finance', 'Creative'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrollSuccess, setEnrollSuccess] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await courseAPI.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
          setUsingFallback(false);
        } else {
          setCourses(mockCourses);
          setUsingFallback(true);
        }
      } catch {
        setCourses(mockCourses);
        setUsingFallback(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleEnroll = async (course) => {
    try { await courseAPI.enroll(course.id); } catch {}
    setEnrolledIds(prev => new Set([...prev, course.id]));
    setEnrollSuccess(course.title);
    setTimeout(() => setEnrollSuccess(null), 3000);
  };

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    const matchDiff = difficulty === 'All' || c.difficulty === difficulty;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', color: 'white', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem', display: 'inline-flex' }}><AppIcon name="courses" size={40} color="#fff" /></div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Explore Courses</h1>
          <p style={{ opacity: 0.9, maxWidth: '480px', margin: '0 auto' }}>
            Learn from India&apos;s top educators. Courses designed for students, UPSC aspirants, and professionals.
          </p>
        </div>

        {/* Enroll success toast */}
        {enrollSuccess && (
          <div style={{
            position: 'fixed', top: '80px', right: '1.5rem', zIndex: 999,
            background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px',
            padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: '600',
            color: '#166534', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s ease'
          }}>
            {` Enrolled in "${enrollSuccess}"!`}
          </div>
        )}

        {/* Filters */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          {usingFallback && (
            <div style={{
              marginBottom: '1rem', padding: '0.7rem 0.9rem', borderRadius: '10px',
              background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412',
              fontSize: '0.8125rem', fontWeight: '600'
            }}>
              Backend courses API is unavailable. Showing demo course catalog.
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search courses or instructors..." icon="search" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <FilterPanel filters={categories} activeFilter={category} onFilterChange={setCategory} label="Category:" />
            <FilterPanel filters={difficulties} activeFilter={difficulty} onFilterChange={setDifficulty} label="Difficulty:" />
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '1rem' }}>
          <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> courses available
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="courses" size={36} /></div>
            <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>No courses found</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                enrolled={enrolledIds.has(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
