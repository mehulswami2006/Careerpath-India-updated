'use client';
import { use } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { getCareerByName, careers } from '../../../data/careers';
import { courses as localCourses } from '../../../data/subjects';
import Link from 'next/link';
import AppIcon from '../../../components/AppIcon';

export default function CareerDetailsPage({ params }) {
  const { career: careerParam } = params;
  const careerName = decodeURIComponent(careerParam);
  const career = getCareerByName(careerName);

  if (!career) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="career" size={36} /></div>
          <h2 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Career Not Found</h2>
          <Link href="/career-recommendation" style={{ color: '#ff7d10', fontWeight: '700', textDecoration: 'none' }}>
            ← Browse All Careers
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const relatedCareers = careers.filter(c => c.category === career.category && c.id !== career.id).slice(0, 3);

  const roadmap = career.roadmap || [
    { step: '10th Grade', desc: 'Focus on Science/Maths fundamentals', link: 'https://cbse.gov.in' },
    { step: '12th Grade', desc: `Take ${career.degrees[0]?.includes('Science') ? 'Science' : 'relevant'} stream`, link: 'https://cbse.gov.in' },
    { step: 'Entrance Exam', desc: career.degrees[0]?.includes('MBBS') ? 'NEET' : career.degrees[0]?.includes('B.Tech') ? 'JEE/State CET' : 'Relevant entrance exams', link: 'https://www.nta.ac.in' },
    { step: 'Degree', desc: career.degrees[0] || 'Bachelor\'s degree', link: 'https://www.nirfindia.org' },
    { step: 'Internship', desc: 'Gain practical experience', link: 'https://internshala.com' },
    { step: 'First Job', desc: `Entry-level ${career.name} position`, link: 'https://www.linkedin.com/jobs/' },
    { step: 'Career Growth', desc: 'Specialize and advance your career', link: 'https://www.coursera.org' },
  ];

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>
        {/* Back button */}
        <Link href="/career-recommendation" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
          marginBottom: '1.5rem'
        }}>
          ← Back to Careers
        </Link>

        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${career.color}20, ${career.color}05)`,
          borderRadius: '24px', padding: '2.5rem', border: `1px solid ${career.color}30`,
          marginBottom: '2rem', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
            borderRadius: '50%', background: career.color, opacity: 0.08
          }} />
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0,
              background: `${career.color}20`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2.5rem', border: `2px solid ${career.color}40`
            }}>
              {career.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', background: `${career.color}20`, color: career.color }}>
                  {career.category}
                </span>
                <span style={{
                  padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                  background: career.jobOutlook === 'Excellent' ? '#dcfce7' : '#dbeafe',
                  color: career.jobOutlook === 'Excellent' ? '#166534' : '#1d4ed8'
                }}>
                  {career.jobOutlook} Outlook
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.5rem' }}>
                {career.name}
              </h1>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>{career.description}</p>
            </div>
          </div>

          {/* Key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '700', marginBottom: '4px' }}>SALARY RANGE</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#059669' }}>{career.salaryRange}</div>
            </div>
            <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '700', marginBottom: '4px' }}>JOB OUTLOOK</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: career.color }}>{career.jobOutlook}</div>
            </div>
            <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: '700', marginBottom: '4px' }}>SKILLS NEEDED</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text)' }}>{career.skills.length}+ skills</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Skills */}
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Required Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {career.skills.map((skill, i) => (
                  <span key={i} style={{
                    padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.875rem',
                    fontWeight: '600', background: `${career.color}10`,
                    color: career.color, border: `1px solid ${career.color}25`
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Degrees */}
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Required Degrees</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {career.degrees.map((deg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: 'var(--surface)' }}>
                    <span style={{ fontSize: '1.25rem', display: 'inline-flex' }}><AppIcon name="graduate" size={18} /></span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{deg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Universities */}
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Top Universities in India</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {career.topUniversities.map((uni, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: 'var(--surface)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#1d4ed8' }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{uni}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Roadmap */}
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem' }}> Career Roadmap</h2>
              <div style={{ position: 'relative' }}>
                {roadmap.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: i < roadmap.length - 1 ? '1rem' : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${career.color}, ${career.color}cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '800', fontSize: '0.75rem'
                      }}>{i + 1}</div>
                      {i < roadmap.length - 1 && <div style={{ width: '2px', flex: 1, background: `${career.color}30`, marginTop: '4px' }} />}
                    </div>
                    <div style={{ paddingBottom: i < roadmap.length - 1 ? '1rem' : 0 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text)' }}>{item.step}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            marginTop: '6px', fontSize: '0.75rem', fontWeight: '700',
                            color: career.color, textDecoration: 'none',
                            padding: '3px 10px', borderRadius: '6px',
                            background: `${career.color}15`,
                            border: `1px solid ${career.color}30`,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${career.color}25`; e.currentTarget.style.borderColor = `${career.color}60`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${career.color}15`; e.currentTarget.style.borderColor = `${career.color}30`; }}
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Get Started</h3>
              <Link href="/courses" style={{
                display: 'block', padding: '0.875rem', borderRadius: '12px', fontWeight: '700',
                background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white',
                textDecoration: 'none', textAlign: 'center', fontSize: '0.875rem', marginBottom: '0.75rem'
              }}>
                 Browse Related Courses
              </Link>
              <Link href="/subjects" style={{
                display: 'block', padding: '0.875rem', borderRadius: '12px', fontWeight: '700',
                border: '2px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none',
                textAlign: 'center', fontSize: '0.875rem'
              }}>
                 Find a Tutor
              </Link>
            </div>

            {/* Related careers */}
            {relatedCareers.length > 0 && (
              <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}> Related Careers</h3>
                {relatedCareers.map(rc => (
                  <Link key={rc.id} href={`/career-details/${encodeURIComponent(rc.name)}`} style={{
                    display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px',
                    textDecoration: 'none', transition: 'background 0.15s', marginBottom: '0.5rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: '1.5rem' }}>{rc.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text)' }}>{rc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>{rc.salaryRange}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
