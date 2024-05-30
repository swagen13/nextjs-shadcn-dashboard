import AddUserForm from "./AddUserForm";

export default async function ProfilePage() {
  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add User</h1>
      </div>
      <AddUserForm />
    </div>
  );
}
