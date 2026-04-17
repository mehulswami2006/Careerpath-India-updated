export default function CourseCard({course}){

  return(
    <div className="border p-4 rounded shadow">

      <h2 className="font-bold">
        {course.title}
      </h2>

      <p>{course.description}</p>

      <p className="text-sm text-gray-600">
        Difficulty: {course.difficulty}
      </p>

    </div>
  );
}