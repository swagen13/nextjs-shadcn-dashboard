import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getChildrenSkills, getSkills } from "./action";
import { ChildrenSkillsDataTable } from "./dataTable/dataTable";
import { childrenSkillsColumns } from "./dataTable/column";

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

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Link rel="preload" href="/childrenSkills/addChildrenSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Skill
          </Button>
        </Link>
      </div>
      {/* Pass skills to your data table or other components */}
      {/* <ChildrenSkillsDataTable data={skills} columns={childrenSkillsColumns} /> */}
    </div>
  );
}
