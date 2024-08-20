import { getAllSkills } from "../action";
import AddSkillForm from "./AddSkillForm";

export default async function AddSkillFormPage() {
  const skills = await getAllSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Skill</h1>
      </div>
      <AddSkillForm skills={skills} />
    </div>
  );
}
