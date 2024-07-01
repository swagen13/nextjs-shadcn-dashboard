// Define the types
interface ChildrenSkill {
  id: string;
  name: string;
  description: string;
  subskillid: string;
  createdAt: string;
  updatedAt: string;
  children_count: number;
}

interface SubSkill {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  children: ChildrenSkill[];
}

import { getSkills } from "../action";
// Import necessary functions
import AddChildrenSkillForm from "./addChildrenSkillForm";

interface addChildrenSkillPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function addChildrenSkillPage() {
  // Fetch all subskills
  const skills = await getSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Sub Skill</h1>
      </div>
      <AddChildrenSkillForm subskills={skills} />
    </div>
  );
}
