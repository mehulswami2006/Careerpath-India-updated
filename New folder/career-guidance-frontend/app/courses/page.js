"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import CourseCard from "../../components/CourseCard";
import { courseApi, studentApi, getToken, getUserInfo } from "../../services/api";

const DEMO_COURSES = [
  { id: 1, title: "Python for Data Science", description: "Learn Python fundamentals and data science libraries including NumPy, Pandas, and Matplotlib.", difficulty: "BEGINNER", teacherName: "Dr. Sarah Chen", duration: "8 weeks", category: "Data Science" },
  { id: 2, title: "Full Stack Web Development", description: "Build modern web apps with React, Node.js, and MongoDB from scratch.", difficulty: "INTERMEDIATE", teacherName: "Prof. James Wilson", duration: "12 weeks", category: "Software Engineering" },
  { id: 3, title: "Machine Learning Fundamentals", description: "Understand core ML algorithms including regression, classification, and clustering.", difficulty: "INTERMEDIATE", teacherName: "Dr. Priya Patel", duration: "10 weeks", category: "Data Science" },
  { id: 4, title: "UI/UX Design Essentials", description: "Master design principles, wireframing, and prototyping with Figma.", difficulty: "BEGINNER", teacherName: "Alex Thompson", duration: "6 weeks", category: "Design" },
  { id: 5, title: "Cybersecurity Fundamentals", description: "Learn ethical hacking, network security, and vulnerability assessment.", difficulty: "ADVANCED", teacherName: "Dr. Marcus Lee", duration: "14 weeks", category: "Cybersecurity" },
  { id: 6, title: "Product Management 101", description: "From idea to launch — learn how to build and ship great products.", difficulty: "BEGINNER", teacherName: "Emily Roberts", duration: "8 weeks", category: "Product Management" },
  { id: 7, title: "Advanced Algorithms & Data Structures", description: "Deep dive into algorithmic thinking and competitive programming.", difficulty: "ADVANCED", teacherName: "Prof. Kumar Raj", duration: "16 weeks", category: "Computer Science" },
  { id: 8, title: "Digital Marketing & SEO", description: "Master online marketing strategies, SEO, and analytics tools.", difficulty: "BEGINNER", teacherName: "Jessica Park", duration: "6 weeks", category: "Marketing" },
];

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const career = searchParams.get("career");
  const { role } = getUserInfo();

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("ALL");
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    const fetchFn = career ? courseApi.getForCareer(career) : courseApi.getAll();
    fetchFn
      .then((data) => setCourses(data?.length ? data : DEMO_COURSES))
      .catch(() => setCourses(DEMO_COURSES))
      .finally(() => setLoading(false));
  }, [career, router]);

  const handleEnroll = async (course) => {
    setEnrollingId(course.id);
    try {
      await studentApi.enrollCourse(course.id);
      setEnrolled((prev) => new Set([...prev, course.id]));
    } catch {
      setEnrolled((prev) => new Set([...prev, course.id])); // optimistic
    } finally {
      setEnrollingId(null);
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "ALL" || c.difficulty?.toUpperCase() === diffFilter;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role={role || "STUDENT"} />
        <main className="flex-1 p-6 lg:p-8 space-y-6 animate-fade-in">
          <div>
            <h1 className="page-title">
              {career ? `Courses for ${career}` : "All Courses"}
            </h1>
            <p className="text-gray-500 mt-1">
              {career ? `Showing courses tailored for ${career}.` : "Explore all available courses and enroll to start learning."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search courses, teachers…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9" />
            </div>
            <div className="flex gap-2">
              {["ALL","BEGINNER","INTERMEDIATE","ADVANCED"].map((d) => (
                <button key={d} onClick={() => setDiffFilter(d)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    diffFilter === d ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {d === "ALL" ? "All" : d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">📚</span>
              <p className="mt-3 text-gray-500">No courses found matching your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={enrolled.has(course.id)}
                  onEnroll={role !== "TEACHER" ? handleEnroll : null}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CoursesContent />
    </Suspense>
  );
}
