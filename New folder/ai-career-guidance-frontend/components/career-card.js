export default function CareerCard({ career }) {

  return (
    <div className="border rounded p-4 shadow">

      <h2 className="text-xl font-bold mb-2">
        {career.title}
      </h2>

      <p className="text-gray-600 mb-2">
        {career.description}
      </p>

      <p className="text-sm text-blue-600">
        Skills: {career.skills}
      </p>

    </div>
  );
}
