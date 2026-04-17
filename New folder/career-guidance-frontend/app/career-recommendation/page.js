"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { aptitudeApi, getToken } from "../../services/api";

const DEMO_CAREERS = [
  {
    name: "Software Engineer",
    match: 92,
    description: "Design, build, and maintain software systems and applications.",
    skills: ["Programming", "Problem Solving", "Algorithms", "System Design"],
    degrees: ["B.Tech Computer Science", "B.Sc Software Engineering", "B.E. Information Technology"],
    pathway: "High School → B.Tech CS (4 yrs) → Internships → Junior Dev → Senior Dev",
    links: [
      { label: "MIT OpenCourseWare CS", url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/" },
      { label: "Apply at IITs", url: "https://josaa.admissions.nic.in/" },
    ],
    icon: "💻", color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Data Scientist",
    match: 87,
    description: "Analyze complex datasets to help organizations make better decisions.",
    skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization"],
    degrees: ["B.Sc Statistics", "B.Tech CS/AI", "B.Sc Mathematics"],
    pathway: "High School → B.Sc Math/Stats (3 yrs) → MS Data Science → Data Analyst → Data Scientist",
    links: [
      { label: "Coursera Data Science", url: "https://www.coursera.org/professional-certificates/ibm-data-science" },
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
    ],
    icon: "📊", color: "from-green-500 to-teal-600",
  },
  {
    name: "Product Manager",
    match: 79,
    description: "Bridge the gap between business, technology, and user experience.",
    skills: ["Communication", "Strategic Thinking", "Analytics", "Leadership"],
    degrees: ["BBA", "B.Tech + MBA", "B.Sc Business"],
    pathway: "High School → BBA/B.Tech (3-4 yrs) → MBA → Associate PM → PM → Senior PM",
    links: [
      { label: "Product School", url: "https://productschool.com/" },
      { label: "PM Exercises", url: "https://www.productmanagementexercises.com/" },
    ],
    icon: "🚀", color: "from-orange-500 to-red-500",
  },
  {
    name: "Cybersecurity Analyst",
    match: 75,
    description: "Protect computer systems and networks from digital attacks.",
    skills: ["Networking", "Ethical Hacking", "Risk Analysis", "Cryptography"],
    degrees: ["B.Tech CS/Cybersecurity", "B.Sc Information Security"],
    pathway: "High School → B.Tech CS (4 yrs) → CEH/CISSP Certifications → Security Analyst",
    links: [
      { label: "TryHackMe", url: "https://tryhackme.com/" },
      { label: "SANS Courses", url: "https://www.sans.org/cyber-security-courses/" },
    ],
    icon: "🔐", color: "from-purple-500 to-violet-600",
  },
  {
    name: "UX/UI Designer",
    match: 70,
    description: "Create intuitive and visually appealing digital experiences.",
    skills: ["Design Thinking", "Wireframing", "Figma", "User Research"],
    degrees: ["B.Des Interaction Design", "B.Sc Visual Communication", "B.Tech CS + Design"],
    pathway: "High School → B.Des (4 yrs) → Internship → Junior Designer → Senior UX Designer",
    links: [
      { label: "Google UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { label: "Interaction Design Foundation", url: "https://www.interaction-design.org/" },
    ],
    icon: "🎨", color: "from-pink-500 to-rose-500",
  },
];

export default function CareerRecommendation() {
  const router = useRouter();
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    aptitudeApi.getRecommended()
      .then((data) => setCareers(data?.length ? data : DEMO_CAREERS))
      .catch(() => setCareers(DEMO_CAREERS))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8 space-y-6 animate-fade-in">
          <div>
            <h1 className="page-title">AI Career Recommendations</h1>
            <p className="text-gray-500 mt-1">Based on your aptitude results, here are your best-matched career paths.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : selected ? (
            /* Career Detail */
            <div className="animate-fade-in">
              <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 mb-6 font-medium">
                ← Back to careers
              </button>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className={`card bg-gradient-to-r ${selected.color} text-white`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{selected.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold">{selected.name}</h2>
                        <p className="text-white/80 mt-1">{selected.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: `${selected.match}%` }} />
                      </div>
                      <span className="text-sm font-bold">{selected.match}% match</span>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="section-title mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.skills?.map((s) => (
                        <span key={s} className="badge badge-blue">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="section-title mb-3">Education Pathway</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">{selected.pathway}</p>
                  </div>
                </div>

                {/* Side */}
                <div className="space-y-4">
                  <div className="card">
                    <h3 className="section-title mb-3">Required Degrees</h3>
                    <ul className="space-y-2">
                      {selected.degrees?.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-primary-500">🎓</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card">
                    <h3 className="section-title mb-3">Apply for Degrees</h3>
                    <div className="space-y-2">
                      {selected.links?.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg p-2 transition-colors">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => router.push(`/courses?career=${encodeURIComponent(selected.name)}`)}
                    className="btn-primary w-full">
                    Find Related Courses →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Career List */
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {careers.map((career) => (
                <button key={career.name} onClick={() => setSelected(career)}
                  className="card text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{career.icon || "🎯"}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary-600">{career.match}%</span>
                      <p className="text-xs text-gray-400">match</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{career.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{career.description}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${career.match}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {career.skills?.slice(0, 3).map((s) => (
                      <span key={s} className="badge badge-blue text-xs">{s}</span>
                    ))}
                  </div>
                  <p className="text-xs text-primary-600 font-medium">View details →</p>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
