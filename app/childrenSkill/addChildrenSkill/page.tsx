import { getSubSkills } from "../action";
import AddChildrenSkillForm from "./addChildrenSkillForm";

export default async function addChildrenSkillPage() {
  const subSkills = await getSubSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Sub Skill</h1>
      </div>
      <AddChildrenSkillForm subSkill={subSkills} />
    </div>
  );
}
