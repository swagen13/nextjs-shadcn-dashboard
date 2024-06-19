import { getSkillParents } from "../action";
import AddSubSkillForm from "./AddSubSkillForm";

export default async function addSubSkillPage() {
  const paretSkills = await getSkillParents();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Sub Skill</h1>
      </div>
      {paretSkills && paretSkills.length > 0 && (
        <AddSubSkillForm parentSkill={paretSkills} />
      )}
    </div>
  );
}
