import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SkillsDataTable } from "./dataTable/dataTable";
import { skillsColumns } from "./dataTable/column";
import { getSkills, getSubSkills } from "./action";

interface SkillsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const name = Array.isArray(searchParams.name)
    ? searchParams.name[0]
    : searchParams.name;
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit;
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

  const pageParam = parseInt(page as string);

  const skills = await getSkills();

  let subSkills: any;
  if (skills.length > 0) {
    const parentIds = skills.map((skill) => skill.id);
    subSkills = await getSubSkills(parentIds);
  }

  console.log("subSkills", subSkills);

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Link rel="preload" href="/subskills/addSubSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Skill
          </Button>
        </Link>
      </div>
      <SkillsDataTable data={subSkills} columns={skillsColumns} />
    </div>
  );
}
