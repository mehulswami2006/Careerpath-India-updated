'use client';
import { useState } from 'react';
import AppIcon from './AppIcon';

export default function QuizComponent({ quiz, onSubmit }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const questions = quiz?.questions || [];

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let score = 0;
    const details = questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) score++;
      return { ...q, userAnswer, isCorrect };
    });
    const result = { score, total: questions.length, percentage: Math.round((score / questions.length) * 100), details };
    setResults(result);
    setSubmitted(true);
    onSubmit?.(result);
  };

  if (submitted && results) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        {/* Score banner */}
        <div style={{
          background: results.percentage >= 70 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fef9c3, #fde68a)',
          borderRadius: '20px', padding: '2rem', textAlign: 'center', marginBottom: '2rem',
          border: `2px solid ${results.percentage >= 70 ? '#86efac' : '#fcd34d'}`
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem', display: 'inline-flex' }}>
            <AppIcon name={results.percentage >= 80 ? 'trophy' : results.percentage >= 60 ? 'career' : 'courses'} size={48} color={results.percentage >= 70 ? '#166534' : '#92400e'} />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '900', color: results.percentage >= 70 ? '#166534' : '#92400e' }}>
            {results.percentage}%
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: results.percentage >= 70 ? '#166534' : '#92400e' }}>
            {results.score}/{results.total} Correct
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {results.percentage >= 80 ? 'Excellent!' : results.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </div>
        </div>

        {/* Answer review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.details.map((q, i) => (
            <div key={q.id} style={{
              background: 'var(--card)', borderRadius: '16px', padding: '1.25rem',
              border: `1px solid ${q.isCorrect ? '#bbf7d0' : '#fecaca'}`,
              borderLeft: `4px solid ${q.isCorrect ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-muted)', minWidth: '24px' }}>Q{i + 1}.</span>
                <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text)' }}>{q.question}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginLeft: '1.5rem' }}>
                {q.options.map((opt, idx) => (
                  <div key={idx} style={{
                    padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem',
                    background: idx === q.correct ? '#dcfce7' : idx === q.userAnswer && !q.isCorrect ? '#fee2e2' : 'var(--surface)',
                    color: idx === q.correct ? '#166534' : idx === q.userAnswer && !q.isCorrect ? '#991b1b' : 'var(--text-muted)',
                    fontWeight: idx === q.correct || (idx === q.userAnswer && !q.isCorrect) ? '600' : '400'
                  }}>
                    {idx === q.correct ? ' ' : idx === q.userAnswer && !q.isCorrect ? ' ' : '  '}{opt}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  <span style={{ display: 'inline-flex', marginRight: '0.35rem', verticalAlign: 'middle' }}>
                    <AppIcon name="hint" size={14} />
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return <div>No questions available</div>;

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div>
      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <div style={{ height: '6px', background: 'var(--star-empty)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #ff7d10, #f06006)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          {quiz?.section || 'Question'}
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text)', lineHeight: 1.5 }}>
          {q.question}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {q.options.map((option, idx) => {
          const isSelected = answers[q.id] === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(q.id, idx)}
              style={{
                textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '12px',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                background: isSelected ? 'var(--sidebar-active-bg)' : 'var(--card)',
                cursor: 'pointer', fontSize: '0.9375rem',
                fontWeight: isSelected ? '700' : '500',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                background: isSelected ? 'var(--primary)' : 'var(--card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: '700',
                color: isSelected ? 'white' : 'var(--text-subtle)'
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              {option}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem',
            fontWeight: '600', border: '2px solid var(--border)', background: 'var(--card)',
            color: currentQ === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: currentQ === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>

        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem',
              fontWeight: '700', border: 'none',
              background: 'linear-gradient(135deg, #ff7d10, #f06006)',
              color: 'white', cursor: 'pointer'
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem',
              fontWeight: '700', border: 'none',
              background: Object.keys(answers).length === 0 ? 'var(--surface-2)' : 'linear-gradient(135deg, #059669, #047857)',
              color: Object.keys(answers).length === 0 ? 'var(--text-muted)' : 'white',
              cursor: Object.keys(answers).length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
