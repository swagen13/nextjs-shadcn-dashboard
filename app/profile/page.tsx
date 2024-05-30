import { getUserProfile } from "../users/action";
import EditProfileForm from "./EditProfileForm";

export default async function ProfilePage() {
  const userProfile = await getUserProfile();

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <EditProfileForm userData={userProfile} />
    </div>
  );
}
