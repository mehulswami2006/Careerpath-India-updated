"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">

      <h1 className="font-bold text-lg">
        AI Career Guidance
      </h1>

      <div className="space-x-4">
        <Link href="/student-dashboard">Dashboard</Link>
        <Link href="/aptitude-test">Aptitude Test</Link>
        <Link href="/career-recommendation">Career AI</Link>
        <Link href="/courses">Courses</Link>
      </div>

    </nav>
  );
}