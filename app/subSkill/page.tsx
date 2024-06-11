import { Button } from "@/components/ui/button";
import Link from "next/link";
import { skillsColumns } from "../skills/dataTable/column";
import { getSkillParents, getSubSkillByParent, getSubSkills } from "./action";
import { SubSkillsDataTable } from "./dataTable/dataTable";

interface SubSkillsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SubSkillsPage({
  searchParams,
}: SubSkillsPageProps) {
  const parentId = Array.isArray(searchParams.parentId)
    ? searchParams.parentId[0]
    : searchParams.parentId;
  const name = Array.isArray(searchParams.name)
    ? searchParams.name[0]
    : searchParams.name;
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit;
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

  // // parse page params to number
  const pageParam = parseInt(page as string);

  // // Fetch skills and parent skills based on the search parameters
  let subSkillFilter = await getSubSkillByParent(parentId, pageParam);
  const parentSkills = await getSkillParents();
  const subSkills = await getSubSkills();

  // Filter skills by name if provided
  if (name) {
    subSkillFilter = subSkillFilter.filter((subSkillFilter) =>
      subSkillFilter.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Get parent skills id
  const parentSkillsId = parentSkills.map((skill) => skill.parentId);

  // Get parent id from skills
  const parentSkillsIdFromSkills = subSkills.map(
    (subSkills) => subSkills.parentId
  );

  // Get count of skills in parent skills
  const parentSkillsCount = parentSkillsId.map((id) =>
    parentSkillsIdFromSkills.filter((subSkills) => subSkills === id)
  );

  // Merge count of skills in parent skills
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
        data={subSkillFilter}
        columns={skillsColumns}
        parentSkills={parentSkillsWithCount}
      />
    </div>
  );
}
