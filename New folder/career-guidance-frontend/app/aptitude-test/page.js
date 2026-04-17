"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { aptitudeApi, getToken } from "../../services/api";

const DEMO_QUESTIONS = [
  { id: 1, category: "logical", question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?", options: ["True", "False", "Cannot determine", "Neither"], correctAnswer: 0 },
  { id: 2, category: "math", question: "What is 15% of 240?", options: ["36", "38", "34", "40"], correctAnswer: 0 },
  { id: 3, category: "math", question: "If a train travels 60 km/h, how far does it travel in 2.5 hours?", options: ["120 km", "130 km", "150 km", "180 km"], correctAnswer: 2 },
  { id: 4, category: "science", question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2 },
  { id: 5, category: "science", question: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Saturn", "Mars"], correctAnswer: 3 },
  { id: 6, category: "coding", question: "What does HTML stand for?", options: ["HyperText Markup Language", "HyperText Making Language", "High Transfer Markup Language", "Hyper Transfer Markup Language"], correctAnswer: 0 },
  { id: 7, category: "coding", question: "Which of the following is NOT a programming language?", options: ["Python", "Java", "HTML", "Ruby"], correctAnswer: 2 },
  { id: 8, category: "communication", question: "Which word is a synonym for 'verbose'?", options: ["Brief", "Wordy", "Quiet", "Concise"], correctAnswer: 1 },
  { id: 9, category: "logical", question: "Complete the series: 2, 6, 12, 20, 30, __", options: ["40", "42", "44", "46"], correctAnswer: 1 },
  { id: 10, category: "communication", question: "What does 'CC' stand for in an email?", options: ["Copy Content", "Carbon Copy", "Copied Content", "Cross Contact"], correctAnswer: 1 },
];

const CATEGORIES = ["All", "logical", "math", "science", "coding", "communication"];
const CATEGORY_COLORS = {
  logical:       "badge-purple",
  math:          "badge-blue",
  science:       "badge-green",
  coding:        "badge-yellow",
  communication: "badge-red",
};

export default function AptitudeTest() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    aptitudeApi.getQuestions()
      .then((qs) => setQuestions(qs?.length ? qs : DEMO_QUESTIONS))
      .catch(() => setQuestions(DEMO_QUESTIONS))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = filter === "All" ? questions : questions.filter((q) => q.category === filter);

  const handleAnswer = (qId, idx) => setAnswers((p) => ({ ...p, [qId]: idx }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { answers };
      const res = await aptitudeApi.submitTest(payload).catch(() => null);
      // Local score
      let correct = 0;
      questions.forEach((q) => { if (answers[q.id] === q.correctAnswer) correct++; });
      const total = questions.length;
      const score = Math.round((correct / total) * 100);
      setResult(res || { correct, total, score, categoryScores: computeCategoryScores() });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const computeCategoryScores = () => {
    const cats = {};
    questions.forEach((q) => {
      if (!cats[q.category]) cats[q.category] = { correct: 0, total: 0 };
      cats[q.category].total++;
      if (answers[q.id] === q.correctAnswer) cats[q.category].correct++;
    });
    return Object.entries(cats).map(([cat, s]) => ({ category: cat, score: Math.round((s.correct / s.total) * 100) }));
  };

  if (submitted && result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role="STUDENT" />
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-lg w-full animate-fade-in">
              <div className="card text-center space-y-4">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold
                  ${result.score >= 70 ? "bg-green-100 text-green-700" : result.score >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {result.score}%
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Test Complete!</h2>
                <p className="text-gray-600">{result.correct} / {result.total} questions correct</p>
                <p className={`text-lg font-semibold ${result.score >= 70 ? "text-green-600" : result.score >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                  {result.score >= 70 ? "🎉 Excellent performance!" : result.score >= 40 ? "👍 Good effort!" : "📚 Keep practicing!"}
                </p>

                {result.categoryScores?.length > 0 && (
                  <div className="text-left pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Score by Category</p>
                    {result.categoryScores.map((cs) => (
                      <div key={cs.category} className="flex items-center gap-3">
                        <span className={`badge ${CATEGORY_COLORS[cs.category] || "badge-blue"} w-28 justify-center`}>{cs.category}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${cs.score >= 70 ? "bg-green-500" : cs.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${cs.score}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8 text-right">{cs.score}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => router.push("/career-recommendation")} className="btn-primary flex-1">
                    View Career Matches →
                  </button>
                  <button onClick={() => { setSubmitted(false); setAnswers({}); setCurrent(0); }} className="btn-secondary flex-1">
                    Retake
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const q = filtered[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6">
              <h1 className="page-title">Aptitude Assessment</h1>
              <p className="text-gray-500 mt-1">Answer all questions to receive your career recommendations.</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setCurrent(0); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                    filter === cat ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No questions in this category.</p>
            ) : (
              <>
                {/* Progress */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Question {current + 1} of {filtered.length}</span>
                  <span>{answeredCount} / {questions.length} answered</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                  <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${((current + 1) / filtered.length) * 100}%` }} />
                </div>

                {q && (
                  <div className="card space-y-5">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${CATEGORY_COLORS[q.category] || "badge-blue"} capitalize`}>{q.category}</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{q.question}</p>
                    <div className="space-y-2.5">
                      {q.options?.map((opt, idx) => (
                        <button key={idx} onClick={() => handleAnswer(q.id, idx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            answers[q.id] === idx
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-100 bg-gray-50 text-gray-700 hover:border-primary-200"
                          }`}>
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2 ${
                            answers[q.id] === idx ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
                        className="btn-secondary flex-1 disabled:opacity-40">← Prev</button>
                      {current < filtered.length - 1 ? (
                        <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary flex-1">Next →</button>
                      ) : (
                        <button onClick={handleSubmit} disabled={submitting || answeredCount < questions.length}
                          className="btn-success flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                          {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                          Submit Test
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
