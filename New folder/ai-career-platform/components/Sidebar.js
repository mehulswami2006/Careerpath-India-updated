import Link from "next/link";

export default function Sidebar() {

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6">

      <h2 className="text-lg font-bold mb-6">
        Navigation
      </h2>

      <div className="space-y-4">

        <Link href="/student-dashboard">Dashboard</Link>
        <Link href="/aptitude-test">Aptitude Test</Link>
        <Link href="/career-recommendation">Career AI</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/hire-teacher">Hire Teacher</Link>
        <Link href="/appointments">Appointments</Link>

      </div>

    </div>
  );
}