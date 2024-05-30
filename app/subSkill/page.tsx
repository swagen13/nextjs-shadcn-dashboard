import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSkillParents, getSubSkills } from "./action";
import { skillsColumns } from "../skills/dataTable/column";
import { SubSkillsDataTable } from "./dataTable/dataTable";

async function SkillsPage() {
  const skills = await getSubSkills();
  const parentSkills = await getSkillParents();

  //get parent skills id
  const parentSkillsId = parentSkills.map((skill) => skill.parentId);

  // get parent id from skills
  const parentSkillsIdFromSkills = skills.map((skill) => skill.parentId);

  // get count of skills in parent skills
  const parentSkillsCount = parentSkillsId.map((id) =>
    parentSkillsIdFromSkills.filter((skill) => skill === id)
  );

  // merge count of skills in parent skills
  const parentSkillsWithCount = parentSkills.map((skill, index) => ({
    ...skill,
    children: parentSkillsCount[index].length,
  }));

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Sub Skills</h1>
        <Link href="/subSkill/addSubSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Sub Skill
          </Button>
        </Link>
      </div>
      <SubSkillsDataTable
        data={skills}
        columns={skillsColumns}
        parentSkills={parentSkillsWithCount}
      />
    </div>
  );
}
export default SkillsPage;
