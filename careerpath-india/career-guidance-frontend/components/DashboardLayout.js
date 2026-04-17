'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { isAuthenticated } from '../services/auth';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', paddingTop: '64px' }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main style={{
          marginLeft: '260px',
          flex: 1,
          padding: '2rem',
          minHeight: 'calc(100vh - 64px)',
          maxWidth: '100%'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
