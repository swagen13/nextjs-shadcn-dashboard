import { getUserById } from "../action";
import EditUserForm from "./EditUserForm";

interface EditUserPageProps {
  params: { id: string };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const userData = await getUserById(params.id);

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">
          Edit User: {userData[0].username}
        </h1>
      </div>
      <EditUserForm userData={userData[0]} />
    </div>
  );
}
