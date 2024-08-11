import { getSkills } from "@/app/dragAndDrop/action";
import { getJobPostById, getUsers } from "../action";

interface EditSkillPageProps {
  params: { id: number; description: string };
}

export default async function PostJobEditlPage({ params }: EditSkillPageProps) {
  //   const job_post = await getJobPostById(params.id);
  //   const users = await getUsers();
  //   const skills = await getSkills();

  //   if (!job_post) {
  //     return (
  //       <div className="bg-gray-200 rounded-lg p-6 m-4">
  //         <div className="flex flex-row justify-between">
  //           <h1 className="text-2xl font-bold">Edit Skill</h1>
  //         </div>
  //         <p>Job post not found.</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
      </div>
      {params.description}
      {/* <EditJobPostForm jobPost={job_post} users={users} skill={skills} /> */}
    </div>
  );
}
