import { Button } from "@/components/ui/button";
import Link from "next/link";
import { skillsColumns } from "../skills/dataTable/column";
import { getSkillsWithChildrenCount } from "../subSkill/action";
import { getChildrenSkills, getSubSkillsWithChildrenCount } from "./action";
import { ChildrenSkillsDataTable } from "./dataTable/dataTable";

interface ChildrenSkillsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ChildrenSkillsPage({
  searchParams,
}: ChildrenSkillsPageProps) {
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

  let subSkill;

  const childrenSkills = await getChildrenSkills();

  const parentSkills = await getSkillsWithChildrenCount();

  if (parentId) {
    console.log("parent id", parentId);

    subSkill = await getSubSkillsWithChildrenCount(parentId as string);
  }

  // get parent skills id
  // const parentSkillsId = parentSkills.map((skill) => skill.parentId);

  // // get parent id from skills
  // const parentSkillsIdFromSkills = subSkills.map(
  //   (subSkills) => subSkills.parentId
  // );

  // // get count of skills in parent skills
  // const parentSkillsCount = parentSkillsId.map((id) =>
  //   parentSkillsIdFromSkills.filter((subSkills) => subSkills === id)
  // );

  // // merge count of skills in parent skills
  // const parentSkillsWithCount = parentSkills.map((skill, index) => ({
  //   ...skill,
  //   children: parentSkillsCount[index].length,
  // }));

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Children Skill</h1>
        <Link rel="preload" href="/childrenSkill/addChildrenSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Children Skill
          </Button>
        </Link>
      </div>

      <ChildrenSkillsDataTable
        data={childrenSkills}
        columns={skillsColumns}
        parentSkills={parentSkills}
        subSkill={subSkill}
      />
    </div>
  );
}
