'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import QuizComponent from '../../../components/QuizComponent';
import { quizAPI } from '../../../services/api';
import { getUser } from '../../../services/auth';
import Link from 'next/link';
import AppIcon from '../../../components/AppIcon';

const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    subject: 'Programming',
    teacher: 'Dr. Priya Sharma',
    questions: [
      { id: 1, question: 'Which keyword declares a variable in modern JavaScript?', options: ['var', 'let', 'both var and let', 'declare'], correct: 1 },
      { id: 2, question: 'What is the output of: typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correct: 2 },
      { id: 3, question: 'Which method adds an element to the END of an array?', options: ['unshift()', 'push()', 'append()', 'add()'], correct: 1 },
      { id: 4, question: 'What does "===" check?', options: ['Only value', 'Only type', 'Both value and type', 'Neither'], correct: 2 },
      { id: 5, question: 'Which is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Float', 'Symbol'], correct: 2 },
    ]
  },
  {
    id: 2,
    title: 'Python Basics Quiz',
    subject: 'Programming',
    teacher: 'Mr. Kiran Reddy',
    questions: [
      { id: 6, question: 'What is used to define a function in Python?', options: ['function', 'def', 'fun', 'define'], correct: 1 },
      { id: 7, question: 'Which data structure stores key-value pairs in Python?', options: ['List', 'Tuple', 'Dictionary', 'Set'], correct: 2 },
      { id: 8, question: 'What is the output of: print(2**3)?', options: ['6', '8', '9', '5'], correct: 1 },
      { id: 9, question: 'Which method removes the last element from a list?', options: ['remove()', 'delete()', 'pop()', 'clear()'], correct: 2 },
      { id: 10, question: 'What keyword is used for a loop in Python?', options: ['loop', 'repeat', 'for', 'each'], correct: 2 },
    ]
  },
];

function QuizContent() {
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get('id');
  const user = getUser();
  const isTeacher = user?.role === 'TEACHER';

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = isTeacher ? await quizAPI.getByTeacher() : await quizAPI.getByStudent();
        setQuizzes(Array.isArray(data) && data.length > 0 ? data : mockQuizzes);
        if (quizIdParam) {
          const q = mockQuizzes.find(q => q.id === parseInt(quizIdParam));
          if (q) setSelectedQuiz(q);
        }
      } catch {
        setQuizzes(mockQuizzes);
        if (quizIdParam) {
          const q = mockQuizzes.find(q => q.id === parseInt(quizIdParam));
          if (q) setSelectedQuiz(q);
        }
      }
      setLoading(false);
    };
    load();
  }, [isTeacher, quizIdParam]);

  const handleSubmit = async (result) => {
    try { await quizAPI.submitQuiz(selectedQuiz.id, result.answers); } catch {}
  };

  if (selectedQuiz) {
    return (
      <div>
        <button onClick={() => setSelectedQuiz(null)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '1.5rem'
        }}>
          ← Back to Quizzes
        </button>
        <div style={{ background: 'var(--card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}>{selectedQuiz.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {selectedQuiz.subject} • {selectedQuiz.questions?.length} questions • By {selectedQuiz.teacher}
          </p>
          <QuizComponent quiz={selectedQuiz} onSubmit={handleSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem' }}> Quizzes</h1>
          <p style={{ color: 'var(--text-muted)' }}>{isTeacher ? 'Your created quizzes' : 'Available quizzes from your tutors'}</p>
        </div>
        {isTeacher && (
          <Link href="/quiz/create" style={{
            padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700',
            background: 'linear-gradient(135deg, #ff7d10, #f06006)', color: 'white',
            textDecoration: 'none', fontSize: '0.875rem'
          }}>
            + Create Quiz
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-flex' }}><AppIcon name="quiz" size={36} /></div>
          <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>No quizzes available yet</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={{
              background: 'var(--card)', borderRadius: '20px', padding: '1.5rem',
              border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem', display: 'inline-flex' }}><AppIcon name="quiz" size={28} /></span>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700', background: '#dbeafe', color: '#1d4ed8' }}>
                  {quiz.questions?.length || 0} Qs
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem' }}>{quiz.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {quiz.subject} • By {quiz.teacher}
              </p>
              <button onClick={() => setSelectedQuiz(quiz)} style={{
                width: '100%', padding: '0.65rem', borderRadius: '10px', fontSize: '0.875rem',
                fontWeight: '700', border: 'none', cursor: 'pointer',
                background: isTeacher ? 'var(--surface)' : 'linear-gradient(135deg, #ff7d10, #f06006)',
                color: isTeacher ? 'var(--text-secondary)' : 'white'
              }}>
                {isTeacher ? ' Preview Quiz' : ' Start Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
        <QuizContent />
      </Suspense>
    </DashboardLayout>
  );
}
