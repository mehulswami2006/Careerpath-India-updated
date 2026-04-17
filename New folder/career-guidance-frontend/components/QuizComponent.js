"use client";
import { useState } from "react";

export default function QuizComponent({ questions = [], onSubmit, title = "Quiz" }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [current, setCurrent] = useState(0);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    // Calculate local score if answers provided
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setScore({ correct, total: questions.length, pct });
    setSubmitted(true);
    onSubmit && onSubmit(answers);
  };

  const answered = Object.keys(answers).length;
  const total = questions.length;

  if (submitted && score) {
    return (
      <div className="max-w-md mx-auto text-center py-8 space-y-4 animate-fade-in">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold
          ${score.pct >= 70 ? "bg-green-100 text-green-700" : score.pct >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
          {score.pct}%
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quiz Complete!</h2>
        <p className="text-gray-600">You got <strong>{score.correct}</strong> out of <strong>{score.total}</strong> questions correct.</p>
        <p className={`text-lg font-semibold ${score.pct >= 70 ? "text-green-600" : score.pct >= 40 ? "text-yellow-600" : "text-red-600"}`}>
          {score.pct >= 70 ? "🎉 Excellent work!" : score.pct >= 40 ? "👍 Good effort!" : "📚 Keep practicing!"}
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return <p className="text-gray-500 text-center py-8">No questions available.</p>;
  }

  const q = questions[current];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Question {current + 1} of {total}</span>
        <span>{answered} answered</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <p className="font-semibold text-gray-900 text-base mb-4">{q.question}</p>
        <div className="space-y-2.5">
          {q.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(q.id, idx)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                answers[q.id] === idx
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2 ${
                answers[q.id] === idx ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-40"
        >
          ← Previous
        </button>
        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            className="btn-primary"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answered < total}
            className="btn-success disabled:opacity-50"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
