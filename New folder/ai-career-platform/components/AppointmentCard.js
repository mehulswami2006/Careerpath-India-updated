export default function AppointmentCard({appointment}){

  return(
    <div className="border p-4 rounded">

      <h3>{appointment.teacher}</h3>

      <p>Status: {appointment.status}</p>

      {appointment.meetingLink && (
        <a
          href={appointment.meetingLink}
          className="text-blue-600"
        >
          Join Meeting
        </a>
      )}

    </div>
  );
}