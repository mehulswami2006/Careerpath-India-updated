"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ProfileCard from "../../components/ProfileCard";
import AppointmentCard from "../../components/AppointmentCard";
import { teacherApi, getToken, getUserInfo } from "../../services/api";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name, email } = getUserInfo();

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    Promise.all([teacherApi.getDashboard(), teacherApi.getAppointments()])
      .then(([d, a]) => { setDashboard(d); setAppointments(a?.slice(0, 3) || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in">
          <div>
            <h1 className="page-title">Teacher Dashboard 🎓</h1>
            <p className="text-gray-500 mt-1">Manage your students, courses, and appointments.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Students"   value={dashboard?.activeStudents ?? 0}  icon="👥" color="bg-blue-100" />
                <StatCard label="Courses Taught"    value={dashboard?.coursesTaught ?? 0}   icon="📚" color="bg-green-100" />
                <StatCard label="Pending Requests"  value={dashboard?.pendingRequests ?? 0} icon="⏳" color="bg-amber-100" />
                <StatCard label="Avg Rating"        value={dashboard?.avgRating ? `${Number(dashboard.avgRating).toFixed(1)}★` : "N/A"} icon="⭐" color="bg-purple-100" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <ProfileCard name={name} email={email} role="TEACHER"
                  rating={dashboard?.avgRating} totalStudents={dashboard?.activeStudents} />

                <div className="card lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title">Recent Appointments</h2>
                    <button onClick={() => router.push("/appointments")} className="text-sm text-primary-600 hover:underline">View all →</button>
                  </div>
                  {appointments.length ? (
                    <div className="space-y-3">
                      {appointments.map((a) => (
                        <AppointmentCard
                          key={a.id} appt={a} role="TEACHER"
                          onAccept={handleAccept} onReject={handleReject}
                          onSendLink={handleSendLink} onFinish={handleFinish}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-6">No appointments yet.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h2 className="section-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "My Courses",        href: "/courses",      icon: "📚", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
                    { label: "Appointments",       href: "/appointments", icon: "📅", color: "bg-green-50 hover:bg-green-100 text-green-700" },
                    { label: "Create Quiz",        href: "/quiz",         icon: "📝", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
                    { label: "View Ratings",       href: "/appointments", icon: "⭐", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
                  ].map((a) => (
                    <button key={a.href} onClick={() => router.push(a.href)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-semibold transition-colors ${a.color}`}>
                      <span className="text-2xl">{a.icon}</span>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
