"use client";

import Link from "next/link";
import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold">
        AI Career Guidance
      </h1>

      <div className="space-x-5">

        <Link href="/dashboard">Dashboard</Link>

        <Link href="/careers">Careers</Link>

        <Link href="/quiz">Career Quiz</Link>

        <Link href="/recommendations">AI Recommendations</Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
