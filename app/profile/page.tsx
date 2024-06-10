export default function Profile() {
  const user = { name: "Pranshu", email: "pranshu1902@gmail.com" };

  return (
    <div className="p-4">
      <p className="text-2xl">My Profile</p>
      <div className="p-4">
        <p className="mt-6">Name: {user.name}</p>
        <p className="mt-6">Email: {user.email}</p>
      </div>
    </div>
  );
}
