"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../services/api";
import { requireAuth } from "../../lib/protectedRoute";
import DashboardStats from "../../components/DashboardStats";

export default function DashboardPage() {

  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {

    if (!requireAuth(router)) return;

    apiRequest("/api/test/secure")
      .then(data => setMessage(data))
      .catch(() => router.push("/login"));

  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Student Dashboard
      </h1>

      <div className="bg-green-100 p-4 rounded">
        {message}
      </div>

      <DashboardStats />

    </div>
  );
}
