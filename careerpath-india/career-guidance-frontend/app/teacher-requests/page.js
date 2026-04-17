'use client';
import DashboardLayout from '../../components/DashboardLayout';
import TeacherHireRequests from '../../components/TeacherHireRequests';
import Link from 'next/link';

export default function TeacherRequestsPage() {
  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}>
            Hire requests
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Accept or decline student tutoring requests. After you accept, students can book a session from their dashboard.
          </p>
          <Link
            href="/teacher-dashboard"
            style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#3b62f5', textDecoration: 'none' }}
          >
            ← Back to dashboard
          </Link>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <TeacherHireRequests showTitle={false} />
        </div>
      </div>
    </DashboardLayout>
  );
}
