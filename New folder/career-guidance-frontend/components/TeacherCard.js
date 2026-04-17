"use client";
import { useState } from "react";

export default function TeacherCard({ teacher, onHire }) {
  const [requested, setRequested] = useState(false);
  const { name, subject, bio, rating, totalStudents, experience, hourlyRate } = teacher;
  const initials = name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "T";

  const handleHire = () => {
    onHire && onHire(teacher);
    setRequested(true);
  };

  const stars = Math.round(Number(rating) || 0);

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          {subject && <p className="text-xs text-primary-600 font-medium">{subject}</p>}
        </div>
      </div>

      {/* Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className={`w-4 h-4 ${s <= stars ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">{Number(rating).toFixed(1)} ({totalStudents || 0} students)</span>
        </div>
      )}

      {bio && <p className="text-sm text-gray-500 line-clamp-2">{bio}</p>}

      <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
        {experience && <span>📅 {experience} exp</span>}
        {hourlyRate && <span>💰 ${hourlyRate}/hr</span>}
      </div>

      <button
        onClick={handleHire}
        disabled={requested}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          requested
            ? "bg-green-100 text-green-700 cursor-default"
            : "bg-primary-600 text-white hover:bg-primary-700"
        }`}
      >
        {requested ? "Request Sent ✓" : "Hire Teacher"}
      </button>
    </div>
  );
}
