import { getSkillById } from "../action";
import EditSkillForm from "./EditSkillForm";

interface EditSkillPageProps {
  params: { id: string };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const skillData = await getSkillById(params.id);

  if (!skillData) {
    return <div>Skill not found</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
      </div>
      <EditSkillForm skillData={skillData} />
    </div>
  );
}
