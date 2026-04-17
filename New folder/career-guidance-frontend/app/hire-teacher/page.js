"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TeacherCard from "../../components/TeacherCard";
import { hireApi, getToken } from "../../services/api";

const DEMO_TEACHERS = [
  { id: 1, name: "Dr. Sarah Chen",     subject: "Data Science & ML",       bio: "PhD from Stanford. 8 years teaching Data Science, Python, and Machine Learning.",  rating: 4.9, totalStudents: 342, experience: "8 years",  hourlyRate: 45 },
  { id: 2, name: "Prof. James Wilson", subject: "Full Stack Development",   bio: "Ex-Google engineer. Specializes in React, Node.js and system design.",             rating: 4.8, totalStudents: 287, experience: "6 years",  hourlyRate: 55 },
  { id: 3, name: "Dr. Priya Patel",    subject: "AI & Deep Learning",       bio: "IIT graduate with industry experience at Microsoft AI Research.",                   rating: 4.7, totalStudents: 219, experience: "5 years",  hourlyRate: 60 },
  { id: 4, name: "Alex Thompson",      subject: "UI/UX Design",             bio: "Award-winning designer with 10 years of experience in product design.",            rating: 4.6, totalStudents: 178, experience: "10 years", hourlyRate: 40 },
  { id: 5, name: "Dr. Marcus Lee",     subject: "Cybersecurity",            bio: "Certified Ethical Hacker (CEH) and CISSP. Former cybersecurity consultant.",       rating: 4.8, totalStudents: 156, experience: "7 years",  hourlyRate: 65 },
  { id: 6, name: "Emily Roberts",      subject: "Product Management",       bio: "Ex-Amazon PM with a passion for teaching product strategy and execution.",         rating: 4.5, totalStudents: 203, experience: "9 years",  hourlyRate: 50 },
];

export default function HireTeacherPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [hireSent, setHireSent] = useState(new Set());
  const [modal, setModal] = useState(null); // teacher being hired
  const [hireForm, setHireForm] = useState({ subject: "", date: "", time: "", notes: "" });
  const [hireLoading, setHireLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    hireApi.searchTeachers({})
      .then((data) => setTeachers(data?.length ? data : DEMO_TEACHERS))
      .catch(() => setTeachers(DEMO_TEACHERS))
      .finally(() => setLoading(false));
  }, [router]);

  const handleHire = (teacher) => setModal(teacher);

  const handleSendRequest = async () => {
    if (!hireForm.subject || !hireForm.date) return;
    setHireLoading(true);
    try {
      await hireApi.sendRequest({ teacherId: modal.id, ...hireForm }).catch(() => {});
      setHireSent((prev) => new Set([...prev, modal.id]));
      setModal(null);
      setHireForm({ subject: "", date: "", time: "", notes: "" });
    } finally {
      setHireLoading(false);
    }
  };

  const filtered = teachers.filter((t) => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.bio?.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || t.subject?.toLowerCase().includes(subjectFilter.toLowerCase());
    return matchSearch && matchSubject;
  });

  const subjects = [...new Set(teachers.map((t) => t.subject).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8 space-y-6 animate-fade-in">
          <div>
            <h1 className="page-title">Find a Private Tutor</h1>
            <p className="text-gray-500 mt-1">Browse expert teachers and send a hiring request.</p>
          </div>

          {/* Search & filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name, subject…" value={search}
                onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
            </div>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
              className="input-field sm:w-56">
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((t) => (
                <TeacherCard
                  key={t.id}
                  teacher={{ ...t, _hired: hireSent.has(t.id) }}
                  onHire={!hireSent.has(t.id) ? handleHire : null}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Hire Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Hire {modal.name}</h2>
              <button onClick={() => setModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500">Fill in the details to send a hiring request.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Topic *</label>
                <input type="text" placeholder="e.g. Python, React, Math…"
                  value={hireForm.subject}
                  onChange={(e) => setHireForm({ ...hireForm, subject: e.target.value })}
                  className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={hireForm.date}
                    onChange={(e) => setHireForm({ ...hireForm, date: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={hireForm.time}
                    onChange={(e) => setHireForm({ ...hireForm, time: e.target.value })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea placeholder="Any specific requirements or topics…"
                  value={hireForm.notes}
                  onChange={(e) => setHireForm({ ...hireForm, notes: e.target.value })}
                  className="input-field resize-none h-20 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={handleSendRequest}
                disabled={!hireForm.subject || !hireForm.date || hireLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {hireLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
