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

// Import necessary functions
import { getAllSubSkills, getChildrenSkillsBySubSkillId } from "../action";
import AddChildrenSkillForm from "./addChildrenSkillForm";

interface addChildrenSkillPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function addChildrenSkillPage({
  searchParams,
}: addChildrenSkillPageProps) {
  const subSkillId = Array.isArray(searchParams.subSkillId)
    ? searchParams.subSkillId[0]
    : searchParams.subSkillId;

  // Fetch all subskills
  let subskills: any[] = await getAllSubSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Sub Skill</h1>
      </div>
      <AddChildrenSkillForm subskills={subskills} />
    </div>
  );
}
