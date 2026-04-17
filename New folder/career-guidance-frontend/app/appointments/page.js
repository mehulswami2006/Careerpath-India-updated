"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import AppointmentCard from "../../components/AppointmentCard";
import RatingComponent from "../../components/RatingComponent";
import { studentApi, teacherApi, ratingApi, getToken, getUserInfo } from "../../services/api";

const DEMO_STUDENT_APPTS = [
  { id: 1, teacherName: "Dr. Sarah Chen",     subject: "Python Basics",   date: "2025-07-10", time: "10:00 AM", status: "CONFIRMED",  meetingLink: "https://meet.google.com/abc-def-ghi", notes: "Bring your laptop" },
  { id: 2, teacherName: "Prof. James Wilson", subject: "React Hooks",     date: "2025-07-15", time: "2:00 PM",  status: "PENDING",                                                               notes: "Chapter 5 review" },
  { id: 3, teacherName: "Emily Roberts",      subject: "Product Strategy",date: "2025-06-28", time: "11:00 AM", status: "COMPLETED",                                                            notes: "" },
];

const DEMO_TEACHER_APPTS = [
  { id: 1, studentName: "Alice Johnson",  subject: "Python Basics",   date: "2025-07-10", time: "10:00 AM", status: "CONFIRMED",  meetingLink: "https://meet.google.com/abc-def-ghi" },
  { id: 2, studentName: "Bob Smith",      subject: "React Hooks",     date: "2025-07-15", time: "2:00 PM",  status: "PENDING" },
  { id: 3, studentName: "Carol White",    subject: "Node.js APIs",    date: "2025-07-18", time: "3:00 PM",  status: "PENDING" },
  { id: 4, studentName: "David Brown",    subject: "System Design",   date: "2025-06-30", time: "9:00 AM",  status: "COMPLETED" },
];

const STATUS_TABS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "REJECTED"];

export default function AppointmentsPage() {
  const router = useRouter();
  const { role } = getUserInfo();
  const isTeacher = role === "TEACHER";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ALL");
  const [ratingModal, setRatingModal] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    const fn = isTeacher ? teacherApi.getAppointments() : studentApi.getAppointments();
    fn
      .then((data) => setAppointments(data?.length ? data : (isTeacher ? DEMO_TEACHER_APPTS : DEMO_STUDENT_APPTS)))
      .catch(() => setAppointments(isTeacher ? DEMO_TEACHER_APPTS : DEMO_STUDENT_APPTS))
      .finally(() => setLoading(false));
  }, [isTeacher, router]);

  const handleAccept = async (id) => {
    await teacherApi.respondHiring(id, "accept").catch(() => {});
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "CONFIRMED" } : a));
  };

  const handleReject = async (id) => {
    await teacherApi.respondHiring(id, "reject").catch(() => {});
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "REJECTED" } : a));
  };

  const handleSendLink = async (id, link) => {
    await teacherApi.sendMeetingLink(id, link).catch(() => {});
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, meetingLink: link } : a));
  };

  const handleFinish = async (id) => {
    await teacherApi.finishMeeting(id).catch(() => {});
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "COMPLETED" } : a));
  };

  const handleRate = async ({ rating, feedback }) => {
    if (!ratingModal) return;
    await ratingApi.rateTeacher(ratingModal.teacherId, { rating, feedback }).catch(() => {});
    setRatingModal(null);
  };

  const filtered = tab === "ALL" ? appointments : appointments.filter((a) => a.status === tab);

  const counts = {};
  appointments.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role={role || "STUDENT"} />
        <main className="flex-1 p-6 lg:p-8 space-y-6 animate-fade-in">
          <div>
            <h1 className="page-title">Appointments</h1>
            <p className="text-gray-500 mt-1">
              {isTeacher ? "Manage student appointment requests and meetings." : "View your scheduled sessions with tutors."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  tab === t ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {t}
                {t !== "ALL" && counts[t] ? (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t ? "bg-white/20 text-white" : "bg-gray-300 text-gray-700"}`}>
                    {counts[t]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">📅</span>
              <p className="mt-3 text-gray-500">No appointments found.</p>
              {!isTeacher && (
                <button onClick={() => router.push("/hire-teacher")} className="btn-primary mt-3">Find a Tutor</button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <div key={a.id}>
                  <AppointmentCard
                    appt={a} role={role}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onSendLink={handleSendLink}
                    onFinish={handleFinish}
                  />
                  {/* Rate teacher button for student on completed */}
                  {!isTeacher && a.status === "COMPLETED" && (
                    <button onClick={() => setRatingModal(a)}
                      className="mt-2 w-full text-sm text-amber-600 hover:text-amber-800 font-medium text-center">
                      ⭐ Rate this teacher
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Rate {ratingModal.teacherName}</h2>
              <button onClick={() => setRatingModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <RatingComponent onSubmit={handleRate} label={`How was your session with ${ratingModal.teacherName}?`} />
          </div>
        </div>
      )}
    </div>
  );
}
