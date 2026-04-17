import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold mb-6 text-indigo-600">
        AI Career Guidance & Tutor Platform
      </h1>

      <p className="text-lg mb-8 text-gray-600">
        Discover careers, learn skills, and connect with expert teachers.
      </p>

      <div className="flex gap-6">

        <Link
          href="/login"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          Register
        </Link>

      </div>

    </div>
  );
}