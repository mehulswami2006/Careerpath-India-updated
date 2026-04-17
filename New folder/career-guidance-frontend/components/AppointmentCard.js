"use client";

const statusColors = {
  PENDING:   "badge-yellow",
  CONFIRMED: "badge-green",
  REJECTED:  "badge-red",
  COMPLETED: "badge-blue",
  CANCELLED: "badge-red",
};

export default function AppointmentCard({ appt, role, onAccept, onReject, onSendLink, onFinish }) {
  const {
    id, studentName, teacherName, subject, date, time,
    status, meetingLink, notes,
  } = appt;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {role === "TEACHER" ? studentName : teacherName}
          </h3>
          {subject && <p className="text-sm text-primary-600 font-medium">{subject}</p>}
        </div>
        <span className={`badge ${statusColors[status] || "badge-blue"} flex-shrink-0`}>
          {status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
        {date && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
        )}
        {time && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        )}
      </div>

      {notes && <p className="mt-2 text-sm text-gray-500 italic">"{notes}"</p>}

      {meetingLink && (
        <a
          href={meetingLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.677V15.32a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Join Meeting
        </a>
      )}

      {/* Teacher actions */}
      {role === "TEACHER" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {status === "PENDING" && (
            <>
              <button onClick={() => onAccept && onAccept(id)} className="btn-success text-xs py-1.5 px-3">Accept</button>
              <button onClick={() => onReject && onReject(id)} className="btn-danger text-xs py-1.5 px-3">Reject</button>
            </>
          )}
          {status === "CONFIRMED" && !meetingLink && (
            <button
              onClick={() => {
                const link = prompt("Enter meeting link (e.g. Zoom/Meet URL):");
                if (link) onSendLink && onSendLink(id, link);
              }}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Send Meeting Link
            </button>
          )}
          {status === "CONFIRMED" && meetingLink && (
            <button onClick={() => onFinish && onFinish(id)} className="btn-secondary text-xs py-1.5 px-3">
              Finish Meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
}
