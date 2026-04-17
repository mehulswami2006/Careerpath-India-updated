'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUserRole } from '../services/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    const role = getUserRole();
    if (role === 'TEACHER') {
      router.push('/teacher-dashboard');
    } else {
      router.push('/student-dashboard');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--surface), var(--surface-2))',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading CareerPath India...</p>
      </div>
    </div>
  );
}
