import { getSkills } from "@/app/dragAndDrop/action";
import { getUsers } from "../action";
import AddJobPostForm from "./AddJobPost";

export default async function AddJobPostPage() {
  const users = await getUsers();
  const skills = await getSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Job Post</h1>
      </div>
      <AddJobPostForm users={users} skill={skills} />
    </div>
  );
}
