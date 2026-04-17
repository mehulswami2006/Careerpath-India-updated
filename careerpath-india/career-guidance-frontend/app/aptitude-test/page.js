'use client';
import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { aptitudeSubjects } from '../../data/subjects';
import { aptitudeAPI } from '../../services/api';
import { saveAptitudeResult } from '../../services/aptitudeStorage';

export default function AptitudeTestPage() {
  const [phase, setPhase] = useState('intro'); // intro | test | results
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const allQuestions = aptitudeSubjects.flatMap(s => s.questions.map(q => ({ ...q, section: s.name })));
  const sections = aptitudeSubjects;

  const handleSelect = (qId, optIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let totalScore = 0;
    const sectionScores = {};
    sections.forEach(s => {
      let correct = 0;
      s.questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
      sectionScores[s.name] = Math.round((correct / s.questions.length) * 100);
      totalScore += correct;
    });
    const overall = Math.round((totalScore / allQuestions.length) * 100);
    const result = { overall, sectionScores, totalCorrect: totalScore, total: allQuestions.length, answers };
    setResults(result);
    console.log('Saving Result:', result);
    saveAptitudeResult(result);
    try { await aptitudeAPI.submitTest(result); } catch {}
    setPhase('results');
    setSubmitting(false);
  };

  const currentSectionData = sections[currentSection];
  const currentQuestion = currentSectionData?.questions[currentQ];
  const answered = Object.keys(answers).length;
  const totalQ = allQuestions.length;

  if (phase === 'intro') {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '700px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff7d10, #f06006)',
            borderRadius: '24px', padding: '3rem', textAlign: 'center', color: 'white', marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Aptitude Test</h1>
            <p style={{ opacity: 0.9, fontSize: '1rem' }}>Discover your strengths and get AI-powered career recommendations</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {sections.map(s => (
              <div key={s.name} style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', align: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text)' }}>{s.name}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.questions.length} questions</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.75rem' }}> Instructions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div> Total {totalQ} multiple choice questions</div>
              <div> 5 sections: Logical Reasoning, Math, Science, Coding, Communication</div>
              <div> No negative marking</div>
              <div> Results used for AI career recommendations</div>
              <div>Estimated time: 30-40 minutes</div>
            </div>
          </div>

          <button onClick={() => setPhase('test')} style={{
            width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1.125rem',
            fontWeight: '800', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #ff7d10, #f06006)',
            color: 'white', boxShadow: '0 4px 20px rgba(255,125,16,0.4)'
          }}>
            Start Test 
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === 'results' && results) {
    const getLabel = (score) => score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Work';
    const getColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#3b62f5' : score >= 40 ? '#f59e0b' : '#ef4444';

    return (
      <DashboardLayout>
        <div style={{ maxWidth: '700px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e2b89, #3b62f5)',
            borderRadius: '24px', padding: '2.5rem', textAlign: 'center', color: 'white', marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {results.overall >= 70 ? '' : results.overall >= 50 ? '' : ''}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '0.5rem' }}>{results.overall}%</div>
            <div style={{ fontSize: '1.125rem', fontWeight: '700', opacity: 0.9 }}>
              {results.totalCorrect}/{results.total} correct
            </div>
            <div style={{ opacity: 0.8, marginTop: '0.5rem' }}>
              {results.overall >= 80 ? 'Outstanding performance!' : results.overall >= 60 ? 'Good job! Keep improving.' : 'Practice makes perfect!'}
            </div>
          </div>

          <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}>Section Breakdown</h3>
            {sections.map(s => {
              const score = results.sectionScores[s.name] || 0;
              return (
                <div key={s.name} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{s.icon} {s.name}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: getColor(score) }}>
                      {score}% — {getLabel(score)}
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-soft)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: getColor(score), borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <a href="/career-recommendation" style={{
              padding: '1rem', borderRadius: '14px', fontWeight: '700', textDecoration: 'none',
              background: 'linear-gradient(135deg, #ff7d10, #f06006)',
              color: 'white', textAlign: 'center', fontSize: '0.9375rem'
            }}>
               View Career Recommendations
            </a>
            <button onClick={() => { setPhase('intro'); setAnswers({}); setCurrentSection(0); setCurrentQ(0); }} style={{
              padding: '1rem', borderRadius: '14px', fontWeight: '700',
              border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--text-secondary)'
            }}>
               Retake Test
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Test phase
  const sectionProgress = ((currentSection) / sections.length) * 100;
  const questionProgress = ((currentQ + 1) / currentSectionData.questions.length) * 100;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '750px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.25rem 1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontWeight: '700', color: 'var(--text)' }}>{currentSectionData.icon} {currentSectionData.name}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                Section {currentSection + 1}/{sections.length}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {answered}/{totalQ} answered
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {sections.map((s, i) => (
              <button key={i} onClick={() => { setCurrentSection(i); setCurrentQ(0); }} style={{
                padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.75rem',
                fontWeight: '700', border: 'none', cursor: 'pointer',
                background: i === currentSection ? `${s.color}20` : 'var(--border-soft)',
                color: i === currentSection ? s.color : 'var(--text-muted)',
                border: `1.5px solid ${i === currentSection ? s.color : 'transparent'}`
              }}>
                {s.icon} {s.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${questionProgress}%`, background: currentSectionData.color, borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Q{currentQ + 1} of {currentSectionData.questions.length}
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div>
            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: currentSectionData.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Question {currentQ + 1}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text)', lineHeight: 1.5 }}>
                {currentQuestion.question}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {currentQuestion.options.map((opt, idx) => {
                const selected = answers[currentQuestion.id] === idx;
                return (
                  <button key={idx} onClick={() => handleSelect(currentQuestion.id, idx)} style={{
                    textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '12px',
                    border: `2px solid ${selected ? currentSectionData.color : 'var(--border)'}`,
                    background: selected ? `${currentSectionData.color}10` : 'var(--card)',
                    cursor: 'pointer', fontSize: '0.9375rem',
                    fontWeight: selected ? '700' : '500',
                    color: selected ? currentSectionData.color : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.15s'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${selected ? currentSectionData.color : 'var(--border)'}`,
                      background: selected ? currentSectionData.color : 'var(--card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: '700',
                      color: selected ? 'white' : 'var(--text-subtle)'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  if (currentQ > 0) setCurrentQ(currentQ - 1);
                  else if (currentSection > 0) { setCurrentSection(currentSection - 1); setCurrentQ(sections[currentSection - 1].questions.length - 1); }
                }}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
              >
                Prev
              </button>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {currentSection < sections.length - 1 || currentQ < currentSectionData.questions.length - 1 ? '' :
                  <span style={{ fontWeight: '600', color: '#059669' }}>Last question!</span>
                }
              </div>

              {currentSection < sections.length - 1 || currentQ < currentSectionData.questions.length - 1 ? (
                <button onClick={() => {
                  if (currentQ < currentSectionData.questions.length - 1) setCurrentQ(currentQ + 1);
                  else { setCurrentSection(currentSection + 1); setCurrentQ(0); }
                }} style={{
                  padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                  background: `linear-gradient(135deg, ${currentSectionData.color}, ${currentSectionData.color}cc)`,
                  color: 'white', cursor: 'pointer', fontWeight: '700'
                }}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} style={{
                  padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                  background: submitting ? '#e5e7eb' : 'linear-gradient(135deg, #059669, #047857)',
                  color: submitting ? 'var(--text-muted)' : 'white', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700'
                }}>
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
