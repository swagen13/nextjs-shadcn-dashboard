import { getJobPostById, getUsers } from "../action";
import EditJobPostForm from "./EditJobPost";

interface EditSkillPageProps {
  params: { id: number };
}

export default async function PostJobSkillPage({ params }: EditSkillPageProps) {
  const job_post = await getJobPostById(params.id);
  const users = await getUsers();

  if (!job_post) {
    return (
      <div className="bg-gray-200 rounded-lg p-6 m-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold">Edit Skill</h1>
        </div>
        <p>Job post not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
      </div>
      <EditJobPostForm jobPost={job_post} users={users} />
    </div>
  );
}
