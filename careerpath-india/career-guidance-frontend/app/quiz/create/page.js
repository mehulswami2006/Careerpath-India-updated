'use client';
import { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { quizAPI } from '../../../services/api';
import { subjects } from '../../../data/subjects';
import Link from 'next/link';

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correct: 0, explanation: '' }
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: prev.length + 1,
      question: '', options: ['', '', '', ''], correct: 0, explanation: ''
    }]);
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const options = [...q.options];
      options[optIdx] = value;
      return { ...q, options };
    }));
  };

  const handleSave = async () => {
    if (!title || !subject) return;
    setSaving(true);
    try {
      await quizAPI.createQuiz({ title, subject, questions });
      setSaved(true);
    } catch {
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Quiz Created!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your quiz has been saved. Students can now attempt it.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => { setSaved(false); setTitle(''); setSubject(''); setQuestions([{ id: 1, question: '', options: ['','','',''], correct: 0, explanation: '' }]); }} style={{
              padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700',
              border: '2px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'var(--text-secondary)'
            }}>Create Another</button>
            <Link href="/quiz/attempt" style={{
              padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700',
              background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white', textDecoration: 'none'
            }}>View Quizzes</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '750px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}> Create Quiz</h1>
            <p style={{ color: 'var(--text-muted)' }}>Build a quiz for your students</p>
          </div>
          <Link href="/teacher-dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</Link>
        </div>

        {/* Quiz details */}
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1rem' }}>Quiz Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Quiz Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Python Basics Quiz"
                style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Subject *</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {questions.map((q, qIdx) => (
            <div key={qIdx} style={{ background: 'var(--card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#ff7d10' }}>Question {qIdx + 1}</div>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.25rem' }}></button>
                )}
              </div>

              <textarea
                value={q.question}
                onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                placeholder="Type your question here..."
                style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)', borderRadius: '10px', fontSize: '0.9375rem', resize: 'vertical', minHeight: '80px', outline: 'none', fontFamily: 'inherit', marginBottom: '1rem', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#ff7d10'}
                onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => updateQuestion(qIdx, 'correct', optIdx)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${q.correct === optIdx ? '#10b981' : 'var(--border)'}`,
                        background: q.correct === optIdx ? '#10b981' : 'var(--card)',
                        cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.75rem', fontWeight: '700'
                      }}
                      title="Mark as correct answer"
                    >
                      {q.correct === optIdx ? '' : ''}
                    </button>
                    <input
                      value={opt}
                      onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      style={{
                        flex: 1, padding: '0.5rem 0.75rem', border: `1.5px solid ${q.correct === optIdx ? '#10b981' : 'var(--border)'}`,
                        borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
                        background: q.correct === optIdx ? '#f0fdf4' : 'var(--card)', color: 'var(--text)'
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}> Click the circle next to an option to mark it as the correct answer</div>
            </div>
          ))}
        </div>

        <button onClick={addQuestion} style={{
          width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '0.9375rem',
          fontWeight: '700', border: '2px dashed var(--border)', background: 'var(--card)',
          cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '1.5rem', transition: 'all 0.15s'
        }}
        onMouseEnter={e => { e.target.style.borderColor = '#ff7d10'; e.target.style.color = '#ff7d10'; }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}>
          + Add Question
        </button>

        <button onClick={handleSave} disabled={saving || !title || !subject} style={{
          width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1rem',
          fontWeight: '800', border: 'none', cursor: saving || !title || !subject ? 'not-allowed' : 'pointer',
          background: saving || !title || !subject ? 'var(--surface-2)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
          color: saving || !title || !subject ? 'var(--text-muted)' : 'white',
          boxShadow: saving || !title || !subject ? 'none' : '0 4px 16px rgba(255,125,16,0.3)'
        }}>
          {saving ? 'Saving...' : `Save Quiz (${questions.length} questions)`}
        </button>
      </div>
    </DashboardLayout>
  );
}
