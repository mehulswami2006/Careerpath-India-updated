'use client';

import { useState } from 'react';
import AppIcon from './AppIcon';

export default function RatingComponent({ onSubmit, targetName, type = 'teacher' }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await onSubmit?.({ rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: 'center', padding: '2rem', background: '#dcfce7',
        borderRadius: '16px', border: '1px solid #bbf7d0'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'inline-flex' }}>
          <AppIcon name="success" size={36} color="#16a34a" />
        </div>
        <div style={{ fontWeight: '700', color: '#166534', fontSize: '1rem' }}>Rating Submitted!</div>
        <div style={{ color: '#16a34a', fontSize: '0.875rem', marginTop: '4px' }}>Thank you for your feedback</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
      <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.25rem' }}>
        Rate {type === 'teacher' ? 'Teacher' : 'Student'} {targetName}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Share your experience
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '2rem', transition: 'transform 0.1s',
              transform: (hover >= star || rating >= star) ? 'scale(1.2)' : 'scale(1)',
              color: (hover >= star || rating >= star) ? '#f59e0b' : 'var(--star-empty)'
            }}
          >
            
          </button>
        ))}
      </div>

      {rating > 0 && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
        </div>
      )}

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback (optional)..."
        style={{
          width: '100%', padding: '0.75rem', border: '1.5px solid var(--input-border)',
          borderRadius: '10px', fontSize: '0.875rem', resize: 'vertical',
          minHeight: '80px', outline: 'none', fontFamily: 'inherit',
          marginBottom: '1rem', background: 'var(--input-bg)', color: 'var(--text)'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '10px', fontSize: '0.875rem',
          fontWeight: '700', border: 'none', cursor: rating === 0 ? 'not-allowed' : 'pointer',
          background: rating === 0 ? 'var(--surface-2)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
          color: rating === 0 ? 'var(--text-muted)' : 'white', transition: 'all 0.15s'
        }}
      >
        Submit Rating
      </button>
    </div>
  );
}
