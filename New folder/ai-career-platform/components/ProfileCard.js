export default function ProfileCard({user}){

  return(
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold">
        {user.name}
      </h2>

      <p className="text-gray-600">
        {user.email}
      </p>

    </div>
  );
}