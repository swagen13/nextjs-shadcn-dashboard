import { getSkills } from "../action";
import AddSubSkillForm from "./AddSubSkillForm";

export default async function SubSkillsPage() {
  const parentSkills = await getSkills();
  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Skill</h1>
      </div>
      <AddSubSkillForm parentSkills={parentSkills} />
    </div>
  );
}
