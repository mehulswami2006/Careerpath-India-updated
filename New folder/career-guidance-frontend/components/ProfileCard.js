export default function ProfileCard({ name, email, role, bio, subject, rating, totalStudents }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{name || "—"}</h2>
          <p className="text-sm text-gray-500 truncate">{email || "—"}</p>
          <span className={`mt-1 inline-block badge ${role === "TEACHER" ? "badge-purple" : "badge-blue"}`}>
            {role === "TEACHER" ? "Teacher" : "Student"}
          </span>
        </div>
      </div>

      {(bio || subject) && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {subject && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Subject:</span> {subject}
            </div>
          )}
          {bio && <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>}
        </div>
      )}

      {(rating !== undefined || totalStudents !== undefined) && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
          {rating !== undefined && (
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{Number(rating).toFixed(1)}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          )}
          {totalStudents !== undefined && (
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
