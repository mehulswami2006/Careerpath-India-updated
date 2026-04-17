import Link from "next/link";

export default function HomePage() {

  return (
    <div className="text-center mt-20">

      <h1 className="text-5xl font-bold mb-6">
        AI Career Guidance System
      </h1>

      <p className="mb-6 text-lg">
        Discover the best career path using AI
      </p>

      <Link
        href="/quiz"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Start Career Quiz
      </Link>

    </div>
  );
}