'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardCard from '../../components/DashboardCard';
import TeacherHireRequests from '../../components/TeacherHireRequests';
import { getUser } from '../../services/auth';
import { teacherAPI, appointmentAPI } from '../../services/api';
import { subjects } from '../../data/subjects';
import Link from 'next/link';
import AppIcon from '../../components/AppIcon';

export default function TeacherDashboard() {
  const user = getUser();
  const [dashData, setDashData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teacherAPI.getDashboard();
        setDashData(data);
        setSelectedSubjects(data.subjects || []);
      } catch {
        setDashData({ totalStudents: 12, totalAppointments: 8, pendingRequests: 3, rating: 4.5, totalEarnings: 15000 });
      }
      try {
        const appts = await appointmentAPI.getTeacherAppointments();
        setAppointments(Array.isArray(appts) ? appts.slice(0, 5) : []);
      } catch {
        setAppointments([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggleSubject = async (subjectName) => {
    const updated = selectedSubjects.includes(subjectName)
      ? selectedSubjects.filter(s => s !== subjectName)
      : [...selectedSubjects, subjectName];
    setSelectedSubjects(updated);
    try { await teacherAPI.updateSubjects(updated); } catch {}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, #1e2b89, #3b62f5)',
          borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.9, fontWeight: '600', marginBottom: '0.25rem' }}> Teacher Dashboard</div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              Hello, {user?.name || 'Teacher'}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9375rem' }}>Manage your students, classes, and appointments</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/teacher-requests" style={{
              padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
              background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
              fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)'
            }}> Hire requests</Link>
            <Link href="/appointments" style={{
              padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
              background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
              fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)'
            }}> Appointments</Link>
            <Link href="/quiz/create" style={{
              padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700',
              background: 'var(--card)', color: '#1e2b89', textDecoration: 'none', fontSize: '0.875rem'
            }}> Create Quiz</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <DashboardCard title="Total Students" value={dashData?.totalStudents || 0} icon="teachers" color="#3b62f5" />
          <DashboardCard title="Appointments" value={dashData?.totalAppointments || 0} subtitle="all time" icon="appointments" color="#059669" />
          <DashboardCard title="Pending Requests" value={dashData?.pendingRequests || 0} icon="clock" color="#f59e0b" />
          <DashboardCard title="Rating" value={`${dashData?.rating?.toFixed(1) || '0.0'}`} icon="ratings" color="#d97706" />
          <DashboardCard title="Total Earnings" value={`₹${(dashData?.totalEarnings || 0).toLocaleString()}`} icon="career" color="#7c3aed" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Quick actions */}
          <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/appointments', icon: 'appointments', label: 'View All Appointments' },
                { href: '/quiz/create', icon: 'quiz', label: 'Create New Quiz' },
                { href: '/teachers', icon: 'teachers', label: 'Browse Teachers' },
                { href: '/ratings', icon: 'ratings', label: 'View My Ratings' },
                { href: '/profile', icon: 'profile', label: 'Edit Profile' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                  borderRadius: '10px', textDecoration: 'none', color: 'var(--text-secondary)',
                  fontSize: '0.875rem', fontWeight: '500', transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ display: 'inline-flex' }}><AppIcon name={icon} size={18} /></span>
                  {label}
                  <span style={{ marginLeft: 'auto', color: 'var(--text-subtle)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent appointments */}
          <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}> Recent Appointments</h2>
              <Link href="/appointments" style={{ fontSize: '0.8125rem', color: '#3b62f5', fontWeight: '600', textDecoration: 'none' }}>View All</Link>
            </div>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'inline-flex' }}><AppIcon name="appointments" size={28} /></div>
                <div style={{ fontSize: '0.875rem' }}>No appointments yet</div>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--surface)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text)' }}>{apt.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.subject} • {apt.date}</div>
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: '700', padding: '2px 8px', borderRadius: '999px',
                    background: apt.status === 'CONFIRMED' ? '#dcfce7' : '#fef9c3',
                    color: apt.status === 'CONFIRMED' ? '#166534' : '#854d0e'
                  }}>{apt.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hire requests from students */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <TeacherHireRequests />
        </div>

        {/* Subjects management */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}> Subjects I Teach</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>Click to toggle subjects you offer tutoring for</p>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#3b62f5' }}>
              {selectedSubjects.length} selected
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {subjects.map((s) => {
              const selected = selectedSubjects.includes(s.name);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSubject(s.name)}
                  style={{
                    padding: '0.65rem 0.75rem', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${selected ? s.color : 'var(--border)'}`,
                    background: selected ? `${s.color}15` : 'var(--card)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.8125rem', fontWeight: selected ? '700' : '500',
                    color: selected ? s.color : 'var(--text-muted)', transition: 'all 0.15s'
                  }}
                >
                  <span>{s.icon}</span>
                  {s.name}
                  {selected && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Selected</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
