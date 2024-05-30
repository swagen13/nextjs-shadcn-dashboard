import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSkills } from "./action";
import { SkillsDataTable } from "./dataTable/dataTable";
import { skillsColumns } from "./dataTable/column";

async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Link rel="preload" href="/skills/addSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Skill
          </Button>
        </Link>
      </div>
      <SkillsDataTable data={skills} columns={skillsColumns} />
    </div>
  );
}
export default SkillsPage;
