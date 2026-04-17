"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../services/api";
import { setToken } from "../../lib/auth";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const res = await apiRequest("/api/auth/login", "POST", {
        email,
        password
      });

      setToken(res.token);

      router.push("/dashboard");

    } catch (err) {

      setError("Invalid email or password");

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-900 p-4">

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-4 text-gray-600">

          Don't have an account?{" "}

          <Link
            href="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}
