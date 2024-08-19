import { getAllSkills, getSkillById } from "../action";
import EditSkillForm from "./EditSkillForm";

interface EditSkillPageProps {
  params: { id: string };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const skillData = await getSkillById(params.id);
  const skills = await getAllSkills();

  if (!skillData || "message" in skillData) {
    // Handle loading errors
    return <div>Error loading skill data , please try again later.</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
      </div>
      <EditSkillForm skillData={skillData} skills={skills} />
    </div>
  );
}
