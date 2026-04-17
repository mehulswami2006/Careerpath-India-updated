export default function TeacherCard({teacher}){

  return(
    <div className="bg-white p-4 rounded shadow">

      <h2 className="font-bold">
        {teacher.name}
      </h2>

      <p>{teacher.subject}</p>

      <button className="bg-indigo-600 text-white px-3 py-1 mt-2 rounded">
        Hire
      </button>

    </div>
  );
}