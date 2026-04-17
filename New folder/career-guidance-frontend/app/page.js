"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole } from "../services/api";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    const role = getRole();
    if (role === "TEACHER") router.push("/teacher-dashboard");
    else router.push("/student-dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Redirecting…</p>
      </div>
    </div>
  );
}
