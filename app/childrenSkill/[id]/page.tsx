import { getChildrenSkillById, getSubSkills } from "../action";
import EditChildrenSkillForm from "./EditChildrenSkill";

const initialState = {
  message: "",
  status: false,
};

export default async function EditChildrenSkillPage({
  params,
}: {
  params: { id: string };
}) {
  const childrenSkillData = await getChildrenSkillById(params.id);

  const subSkills = await getSubSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Children Skill</h1>
      </div>
      <EditChildrenSkillForm
        childrenSkillData={childrenSkillData}
        subSkills={subSkills}
      />
    </div>
  );
}
