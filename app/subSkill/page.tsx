import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSkillsWithChildrenCount, getSubSkills } from "./action";
import { SubSkillsDataTable } from "./dataTable/dataTable";
import { skillsColumns } from "../skills/dataTable/column";

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

  // const subSkills = getSubSkills();

  // fetch sub skills
  const subSkills = await getSubSkills(
    parentId as string,
    pageParam,
    name as string
  );

  const skillCount = await getSkillsWithChildrenCount();

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
        data={subSkills}
        columns={skillsColumns}
        parentSkills={skillCount}
      />
    </div>
  );
}
