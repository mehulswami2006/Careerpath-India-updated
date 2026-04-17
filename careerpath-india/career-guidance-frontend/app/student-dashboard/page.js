'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardCard from '../../components/DashboardCard';
import CareerCard from '../../components/CareerCard';
import StudentHireRequests from '../../components/StudentHireRequests';
import { getUser } from '../../services/auth';
import { studentAPI, aptitudeAPI, careerAPI } from '../../services/api';
import { careers as localCareers } from '../../data/careers';
import { readAptitudeResult } from '../../services/aptitudeStorage';
import AppIcon from '../../components/AppIcon';
import Link from 'next/link';

export default function StudentDashboard() {
  const user = getUser();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedCareers, setRecommendedCareers] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
  // Step 1: Read aptitude score for the currently logged-in student
  const storedAptitude = readAptitudeResult();
  const aptitudeScore = storedAptitude?.overall ?? null;

  // Step 2: Try to get rest of dashboard from backend
  try {
    const data = await studentAPI.getDashboard();
    // Merge localStorage aptitude score with backend data
    setDashData({
      ...data,
      aptitudeScore: aptitudeScore ?? data.aptitudeScore ?? '—',
    });
  } catch {
    // Backend offline — use localStorage score
    setDashData({
      aptitudeScore: aptitudeScore ?? '—',
      coursesEnrolled: 0,
      appointmentsPending: 0,
      quizCompleted: 0,
      totalPoints: 0,
    });
  }

  setRecommendedCareers(localCareers.slice(0, 6));
  setLoading(false);
};
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Welcome header */}
        <div style={{
          background: 'linear-gradient(135deg, #ff7d10, #f06006)',
          borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.9, fontWeight: '600', marginBottom: '0.25rem' }}>
              Welcome back,
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              {user?.name || 'Student'}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9375rem' }}>
              Continue your career journey - you&apos;re doing great.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/aptitude-test" style={{
              padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
              background: 'rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none',
              fontSize: '0.875rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Take Test
            </Link>
            <Link href="/career-recommendation" style={{
              padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
              background: 'var(--card)', color: '#ff7d10', textDecoration: 'none', fontSize: '0.875rem'
            }}>
              Explore Careers
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <DashboardCard title="Aptitude Score" value={dashData?.aptitudeScore || '—'} subtitle="out of 100" icon="career" color="#ff7d10" />
          <DashboardCard title="Courses Enrolled" value={dashData?.coursesEnrolled || 0} subtitle="active courses" icon="courses" color="#3b62f5" />
          <DashboardCard title="Appointments" value={dashData?.appointmentsPending || 0} subtitle="pending" icon="appointments" color="#059669" />
          <DashboardCard title="Quizzes Done" value={dashData?.quizCompleted || 0} subtitle="completed" icon="quiz" color="#7c3aed" />
          <DashboardCard title="Points Earned" value={dashData?.totalPoints || 0} subtitle="total XP" icon="ratings" color="#f59e0b" />
        </div>

        {/* Quick actions */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {[
              { href: '/aptitude-test', icon: 'test', label: 'Aptitude Test', color: '#ff7d10' },
              { href: '/career-recommendation', icon: 'ai', label: 'AI Careers', color: '#7c3aed' },
              { href: '/subjects', icon: 'teachers', label: 'Find Tutor', color: '#3b62f5' },
              { href: '/courses', icon: 'courses', label: 'Courses', color: '#059669' },
              { href: '/appointments', icon: 'appointments', label: 'Appointments', color: '#d97706' },
              { href: '/quiz/attempt', icon: 'quiz', label: 'Take Quiz', color: '#0891b2' },
            ].map(({ href, icon, label, color }) => (
              <Link key={href} href={href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 0.5rem', borderRadius: '14px', textDecoration: 'none',
                background: `${color}10`, border: `1px solid ${color}20`,
                transition: 'all 0.2s', color: color
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ display: 'inline-flex' }}>
                  <AppIcon name={icon} size={24} color={color} />
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textAlign: 'center' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tutor hire requests & booking after accept */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <StudentHireRequests />
        </div>

        {/* Recommended Careers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}>
              Recommended Careers for You
            </h2>
            <Link href="/career-recommendation" style={{ fontSize: '0.875rem', color: '#ff7d10', fontWeight: '700', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {recommendedCareers.map(career => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
