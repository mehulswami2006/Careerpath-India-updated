'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CareerCard from '../../components/CareerCard';
import { SearchBar, FilterPanel } from '../../components/SearchBar';
import { careers, careerCategories, searchCareers, getCareersByCategory } from '../../data/careers';
import { getAICareerRecommendations } from '../../services/gemini';
import { readAptitudeResult } from '../../services/aptitudeStorage';
import AppIcon from '../../components/AppIcon';

export default function CareerRecommendationPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // AI state
  const [aiCareers, setAiCareers] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aptitudeScore, setAptitudeScore] = useState(null);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'browse'

  useEffect(() => {
    const parsed = readAptitudeResult();
    if (parsed) {
      setAptitudeScore(parsed);
      loadAIRecommendations(parsed);
    } else {
      setActiveTab('browse');
    }
  }, []);

  const loadAIRecommendations = async (aptitudeData) => {
    setAiLoading(true);
    setAiError('');
    try {
      const result = await getAICareerRecommendations(aptitudeData);
      setAiCareers(result);
    } catch (err) {
    console.error("Gemini Error:", err);  
    setAiError('Could not load AI recommendations. Please check your connection.');
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = search
    ? searchCareers(search)
    : getCareersByCategory(category);

  return (
    <DashboardLayout>
      <div style={{ animation: 'slideUp 0.4s ease' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #1e2b89)',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem',
          color: 'white', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem', display: 'inline-flex' }}><AppIcon name="ai" size={40} color="#fff" /></div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>
            AI Career Recommendations
          </h1>
          <p style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            {aptitudeScore
              ? `Based on your aptitude score of ${aptitudeScore.overall}%, Gemini AI has personalised these careers for you.`
              : 'Take the aptitude test first to get personalised AI career recommendations.'}
          </p>

          {aptitudeScore && (
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(aptitudeScore.sectionScores || {}).map(([section, score]) => (
                <div key={section} style={{
                  background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
                  padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: '700',
                  backdropFilter: 'blur(10px)'
                }}>
                  {section.split(' ')[0]}: {score}%
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: '10px', fontWeight: '700',
              fontSize: '0.875rem', border: 'none', cursor: 'pointer',
              background: activeTab === 'ai'
                ? 'linear-gradient(135deg, #7c3aed, #1e2b89)'
                : 'var(--surface)',
              color: activeTab === 'ai' ? 'white' : 'var(--text-muted)',
            }}
          >
             AI Picks {aptitudeScore ? `(${aptitudeScore.overall}% score)` : ''}
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: '10px', fontWeight: '700',
              fontSize: '0.875rem', border: 'none', cursor: 'pointer',
              background: activeTab === 'browse'
                ? 'linear-gradient(135deg, #ff7d10, #f06006)'
                : 'var(--surface)',
              color: activeTab === 'browse' ? 'white' : 'var(--text-muted)',
            }}
          >
             Browse All ({careers.length}+ careers)
          </button>
        </div>

        {/* ── AI TAB ── */}
        {activeTab === 'ai' && (
          <div>
            {/* No test taken */}
            {!aptitudeScore && (
              <div style={{
                textAlign: 'center', padding: '4rem', background: 'var(--card)',
                borderRadius: '20px', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
                <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Take the Aptitude Test First
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Complete the 25-question aptitude test so Gemini AI can recommend careers perfectly matched to your strengths.
                </p>
                <a href="/aptitude-test" style={{
                  display: 'inline-block', padding: '0.875rem 2rem', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white',
                  fontWeight: '700', textDecoration: 'none', fontSize: '1rem'
                }}>
                  Start Aptitude Test
                </a>
              </div>
            )}

            {/* Loading */}
            {aptitudeScore && aiLoading && (
              <div style={{
                textAlign: 'center', padding: '4rem', background: 'var(--card)',
                borderRadius: '20px', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>Loading</div>
                <h3 style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Gemini AI is Analysing Your Results...
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Finding the best career matches for your score of {aptitudeScore.overall}%
                </p>
                <div style={{
                  margin: '1.5rem auto 0', width: '200px', height: '6px',
                  background: 'var(--border)', borderRadius: '999px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: '60%',
                    background: 'linear-gradient(90deg, #7c3aed, #3b62f5)',
                    borderRadius: '999px', animation: 'pulse 1.5s infinite'
                  }} />
                </div>
              </div>
            )}

            {/* Error */}
            {aptitudeScore && aiError && !aiLoading && (
              <div style={{
                padding: '1.5rem', background: '#fee2e2', borderRadius: '16px',
                border: '1px solid #fecaca', marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '700', color: '#dc2626', marginBottom: '0.5rem' }}>
                   {aiError}
                </div>
                <button
                  onClick={() => loadAIRecommendations(aptitudeScore)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600',
                    background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* AI Career Cards */}
            {aptitudeScore && !aiLoading && aiCareers.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '1rem'
                }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                     <strong style={{ color: 'var(--text)' }}>{aiCareers.length} careers</strong> recommended by Gemini AI for your profile
                  </p>
                  <button
                    onClick={() => loadAIRecommendations(aptitudeScore)}
                    style={{
                      padding: '0.4rem 0.875rem', borderRadius: '8px', fontSize: '0.8125rem',
                      fontWeight: '600', border: '1.5px solid var(--border)', background: 'var(--card)',
                      cursor: 'pointer', color: 'var(--text-muted)'
                    }}
                  >
                     Refresh
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {aiCareers.map((career, i) => (
                    <div key={i} style={{
                      background: 'var(--card)', borderRadius: '18px', padding: '1.5rem',
                      border: '1px solid var(--border)', transition: 'all 0.2s',
                      position: 'relative', overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.15)';
                      e.currentTarget.style.borderColor = '#7c3aed';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                      {/* AI badge */}
                      <div style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'linear-gradient(135deg, #7c3aed, #1e2b89)',
                        color: 'white', fontSize: '0.6875rem', fontWeight: '700',
                        padding: '2px 8px', borderRadius: '999px'
                      }}>
                         AI Pick
                      </div>

                      {/* Match score ring */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '2.5rem' }}>{career.icon}</div>
                        <div>
                          <div style={{
                            display: 'inline-block', padding: '3px 12px', borderRadius: '999px',
                            fontSize: '0.8125rem', fontWeight: '800',
                            background: career.matchScore >= 85 ? '#dcfce7' : career.matchScore >= 70 ? '#dbeafe' : '#fef9c3',
                            color: career.matchScore >= 85 ? '#166534' : career.matchScore >= 70 ? '#1e40af' : '#854d0e',
                          }}>
                            {career.matchScore}% match
                          </div>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text)', marginBottom: '2px' }}>
                        {career.name}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: '600', marginBottom: '0.75rem' }}>
                        {career.category}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {career.reason}
                      </p>

                      {/* Top skills */}
                      {career.topSkills && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.75rem' }}>
                          {career.topSkills.map((skill, j) => (
                            <span key={j} style={{
                              padding: '2px 8px', borderRadius: '6px', fontSize: '0.6875rem',
                              background: 'var(--chip-bg)', color: 'var(--chip-text)', fontWeight: '500'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-soft)'
                      }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#059669' }}>
                          {career.salaryRange}
                        </div>
                        <a href={`/career-details/${encodeURIComponent(career.name)}`} style={{
                          fontSize: '0.8125rem', color: '#7c3aed', fontWeight: '700',
                          textDecoration: 'none'
                        }}>
                          Explore
                        </a>
                      </div>

                      {/* Top colleges */}
                      {career.topColleges && career.topColleges.length > 0 && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                           {career.topColleges.slice(0, 2).join(' • ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── BROWSE TAB ── */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and filter */}
            <div style={{
              background: 'var(--card)', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid var(--border)', marginBottom: '1.5rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search careers, skills or categories..."
                />
              </div>
              {!search && (
                <FilterPanel
                  filters={careerCategories}
                  activeFilter={category}
                  onFilterChange={setCategory}
                  label="Filter by Category:"
                />
              )}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> careers
              </div>
              {(search || category !== 'All') && (
                <button onClick={() => { setSearch(''); setCategory('All'); }} style={{
                  fontSize: '0.8125rem', color: '#ff7d10', fontWeight: '600',
                  background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  Clear 
                </button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.25rem'
            }}>
              {filtered.map(career => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}