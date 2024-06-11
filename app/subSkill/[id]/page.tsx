import { getSkills } from "@/app/skills/action";
import { getSubSkillById } from "../action";
import EditSubSkillForm from "./EditSubSkillForm";

interface EditSkillPageProps {
  params: { id: string };
}

export default async function EditSubSkillPage({ params }: EditSkillPageProps) {
  const subSkillData = await getSubSkillById(params.id);

  const parentSkill = await getSkills();

  if (!subSkillData) {
    return <div>Skill not found</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
      </div>
      <EditSubSkillForm subSkillData={subSkillData} parentSkill={parentSkill} />
    </div>
  );
}
