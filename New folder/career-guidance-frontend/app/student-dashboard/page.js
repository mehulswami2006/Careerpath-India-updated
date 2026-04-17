"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ProfileCard from "../../components/ProfileCard";
import { studentApi, getToken, getUserInfo } from "../../services/api";

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

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { name, email } = getUserInfo();

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    studentApi.getDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="page-title">Welcome back, {name?.split(" ")[0] || "Student"} 👋</h1>
            <p className="text-gray-500 mt-1">Here's your learning overview for today.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Enrolled Courses"  value={data?.enrolledCourses ?? 0}     icon="📚" color="bg-blue-100" />
                <StatCard label="Quiz Score Avg"    value={data?.avgQuizScore ? `${data.avgQuizScore}%` : "N/A"} icon="📝" color="bg-green-100" />
                <StatCard label="Appointments"      value={data?.appointments ?? 0}         icon="📅" color="bg-amber-100" />
                <StatCard label="Career Matches"    value={data?.careerMatches ?? 0}        icon="🎯" color="bg-purple-100" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile */}
                <ProfileCard name={name} email={email} role="STUDENT" />

                {/* Recent courses */}
                <div className="card lg:col-span-2">
                  <h2 className="section-title mb-4">Recent Courses</h2>
                  {data?.recentCourses?.length ? (
                    <div className="space-y-3">
                      {data.recentCourses.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                            <p className="text-xs text-gray-500">{c.teacherName}</p>
                          </div>
                          <span className="badge badge-blue">{c.difficulty || "—"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No courses enrolled yet.</p>
                      <button onClick={() => router.push("/courses")} className="btn-primary mt-3 text-sm">Browse Courses</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="card">
                <h2 className="section-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Take Aptitude Test", href: "/aptitude-test",        icon: "📋", color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
                    { label: "View Career Paths",  href: "/career-recommendation", icon: "🚀", color: "bg-green-50 hover:bg-green-100 text-green-700" },
                    { label: "Find a Tutor",       href: "/hire-teacher",          icon: "👨‍🏫", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
                    { label: "Take a Quiz",        href: "/quiz",                  icon: "🧠", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
                  ].map((a) => (
                    <button
                      key={a.href}
                      onClick={() => router.push(a.href)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-semibold transition-colors ${a.color}`}
                    >
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
