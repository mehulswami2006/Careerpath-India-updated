const difficultyColor = {
  BEGINNER:     "badge-green",
  INTERMEDIATE: "badge-yellow",
  ADVANCED:     "badge-red",
};

export default function CourseCard({ course, onEnroll, enrolled }) {
  const { title, description, difficulty, teacherName, duration, category } = course;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {difficulty && (
            <span className={`badge ${difficultyColor[difficulty?.toUpperCase()] || "badge-blue"}`}>
              {difficulty}
            </span>
          )}
          {category && <span className="badge badge-purple">{category}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 leading-snug">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          {teacherName && (
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{teacherName}</span>
            </p>
          )}
          {duration && <p className="text-xs text-gray-400 mt-0.5">{duration}</p>}
        </div>
        {onEnroll && (
          <button
            onClick={() => onEnroll(course)}
            disabled={enrolled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
              enrolled
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {enrolled ? "Enrolled ✓" : "Enroll"}
          </button>
        )}
      </div>
    </div>
  );
}
