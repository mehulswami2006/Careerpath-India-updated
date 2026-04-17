"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import QuizComponent from "../../components/QuizComponent";
import { quizApi, teacherApi, getToken, getUserInfo } from "../../services/api";

const DEMO_QUIZZES = [
  {
    id: 1,
    title: "Python Fundamentals",
    description: "Test your knowledge of Python basics.",
    courseTitle: "Python for Data Science",
    questionCount: 5,
    questions: [
      { id: 1, question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correctAnswer: 1 },
      { id: 2, question: "What is the output of `type([])` in Python?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'array'>"], correctAnswer: 2 },
      { id: 3, question: "Which method adds an element to a list?", options: ["add()", "push()", "append()", "insert()"], correctAnswer: 2 },
      { id: 4, question: "What does `len('hello')` return?", options: ["4", "5", "6", "None"], correctAnswer: 1 },
      { id: 5, question: "Which of these is a Python dictionary?", options: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", "{'a': 1}"], correctAnswer: 3 },
    ],
  },
  {
    id: 2,
    title: "React Hooks Quiz",
    description: "Challenge yourself on React Hooks concepts.",
    courseTitle: "Full Stack Web Development",
    questionCount: 4,
    questions: [
      { id: 1, question: "Which hook is used to manage state in a functional component?", options: ["useEffect", "useState", "useContext", "useRef"], correctAnswer: 1 },
      { id: 2, question: "What is the second argument to useEffect?", options: ["A callback", "A dependency array", "A state value", "A component"], correctAnswer: 1 },
      { id: 3, question: "useCallback is primarily used to:", options: ["Manage side effects", "Memoize functions", "Create refs", "Handle context"], correctAnswer: 1 },
      { id: 4, question: "Which hook would you use to access a DOM element directly?", options: ["useState", "useReducer", "useRef", "useMemo"], correctAnswer: 2 },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const { role } = getUserInfo();
  const isTeacher = role === "TEACHER";

  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", description: "", courseId: "", questions: [] });
  const [newQ, setNewQ] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
  const [creating, setCreating] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    quizApi.getAll()
      .then((data) => setQuizzes(data?.length ? data : DEMO_QUIZZES))
      .catch(() => setQuizzes(DEMO_QUIZZES))
      .finally(() => setLoading(false));

    if (isTeacher) {
      teacherApi.getQuizResults().then(setResults).catch(() => {});
    }
  }, [isTeacher, router]);

  const handleSubmitQuiz = async (answers) => {
    try {
      await quizApi.submit(selected.id, { answers }).catch(() => {});
    } catch {}
  };

  const handleAddQuestion = () => {
    if (!newQ.question.trim()) return;
    setCreateForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...newQ, id: prev.questions.length + 1 }],
    }));
    setNewQ({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
  };

  const handleCreateQuiz = async () => {
    if (!createForm.title || createForm.questions.length === 0) return;
    setCreating(true);
    try {
      const res = await teacherApi.createQuiz(createForm).catch(() => null);
      setQuizzes((prev) => [...prev, res || { ...createForm, id: Date.now() }]);
      setShowCreate(false);
      setCreateForm({ title: "", description: "", courseId: "", questions: [] });
    } finally {
      setCreating(false);
    }
  };

  if (selected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role={role || "STUDENT"} />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-primary-600 mb-6 font-medium">← Back to quizzes</button>
              <div className="mb-6">
                <h1 className="page-title">{selected.title}</h1>
                {selected.description && <p className="text-gray-500 mt-1">{selected.description}</p>}
              </div>
              <QuizComponent questions={selected.questions || []} onSubmit={handleSubmitQuiz} title={selected.title} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role={role || "STUDENT"} />
        <main className="flex-1 p-6 lg:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">{isTeacher ? "Manage Quizzes" : "Course Quizzes"}</h1>
              <p className="text-gray-500 mt-1">{isTeacher ? "Create and manage quizzes for your students." : "Take quizzes to test your knowledge."}</p>
            </div>
            {isTeacher && (
              <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Quiz
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="card hover:shadow-md transition-shadow flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🧠</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      {quiz.courseTitle && <p className="text-xs text-primary-600 font-medium">{quiz.courseTitle}</p>}
                    </div>
                  </div>
                  {quiz.description && <p className="text-sm text-gray-500 line-clamp-2">{quiz.description}</p>}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>📝 {quiz.questions?.length || quiz.questionCount || 0} questions</span>
                  </div>
                  <button onClick={() => setSelected(quiz)} className="btn-primary text-sm w-full">
                    {isTeacher ? "Preview Quiz" : "Start Quiz →"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Quiz Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 animate-fade-in space-y-4 my-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Create New Quiz</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <input type="text" placeholder="Quiz Title *" value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="input-field" />
            <input type="text" placeholder="Description (optional)" value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} className="input-field" />

            <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Add Questions ({createForm.questions.length} added)</p>
              <input type="text" placeholder="Question text" value={newQ.question}
                onChange={(e) => setNewQ({ ...newQ, question: e.target.value })} className="input-field text-sm" />
              {newQ.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQ.correctAnswer === i}
                    onChange={() => setNewQ({ ...newQ, correctAnswer: i })} className="flex-shrink-0" />
                  <input type="text" placeholder={`Option ${String.fromCharCode(65+i)}`}
                    value={opt}
                    onChange={(e) => {
                      const opts = [...newQ.options];
                      opts[i] = e.target.value;
                      setNewQ({ ...newQ, options: opts });
                    }}
                    className="input-field text-sm" />
                </div>
              ))}
              <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
              <button onClick={handleAddQuestion} className="btn-secondary text-sm w-full">+ Add Question</button>
            </div>

            {createForm.questions.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {createForm.questions.map((q, i) => (
                  <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-700 flex items-center justify-between">
                    <span className="truncate">{i+1}. {q.question}</span>
                    <button onClick={() => setCreateForm((p) => ({ ...p, questions: p.questions.filter((_, qi) => qi !== i) }))}
                      className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleCreateQuiz} disabled={!createForm.title || createForm.questions.length === 0 || creating}
                className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
