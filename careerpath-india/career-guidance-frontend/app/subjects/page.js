'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import SubjectCard from '../../components/SubjectCard';
import { SearchBar } from '../../components/SearchBar';
import { subjects } from '../../data/subjects';
import AppIcon from '../../components/AppIcon';

export default function SubjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.topics.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubjectClick = (subject) => {
    router.push(`/teachers?subject=${encodeURIComponent(subject.name)}`);
  };

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b62f5, #1e2b89)',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', color: 'white', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem', display: 'inline-flex' }}><AppIcon name="subjects" size={40} color="#fff" /></div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Find Expert Tutors</h1>
          <p style={{ opacity: 0.9, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Choose a subject and get matched with the best tutors in India. Learn from certified experts.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search subjects, topics..."
            icon="search"
          />
        </div>

        {/* Count */}
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: '500' }}>
          {filtered.length} subjects available — click to find tutors
        </div>

        {/* Subjects Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {filtered.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={handleSubjectClick}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="search" size={36} /></div>
            <div style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{`No subjects found for "${search}"`}</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
