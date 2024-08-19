import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SkillsDataTable } from "./dataTable/dataTable";
import { skillsColumns } from "./dataTable/column";
import { getSkills } from "./action";

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

  // parse the limit to an integer
  const limitParam = parseInt(limit as string);

  const skills = await getSkills(pageParam, limitParam, name);

  let close = false;

  console.log("skills", skills.length);

  if (skills.length !== limitParam + 1) {
    close = true;
    if (skills.length < limitParam) {
      skills.pop();
    }
  } else {
    close = false;
    if (skills.length < limitParam) {
      skills.pop();
    }
  }

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
      <SkillsDataTable
        columns={skillsColumns}
        data={skills}
        closeNextPage={close}
      />
    </div>
  );
}
