import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteSubSkill, getChildrenSkills, getSubSkills } from "./action";
import { subSkillsColumns } from "./dataTable/column";
import { ChildrenSkillsDataTable } from "./dataTable/dataTable";
import { getSkillParents } from "../subSkill/action";

async function SkillsPage() {
  const childrenSkills = await getChildrenSkills();

  const subSkills = await getSubSkills();

  const parentSkills = await getSkillParents();

  //get parent skills id
  const parentSkillsId = parentSkills.map((skill) => skill.parentId);

  // get parent id from skills
  const parentSkillsIdFromSkills = subSkills.map(
    (subSkills) => subSkills.parentId
  );

  // get count of skills in parent skills
  const parentSkillsCount = parentSkillsId.map((id) =>
    parentSkillsIdFromSkills.filter((subSkills) => subSkills === id)
  );

  // merge count of skills in parent skills
  const parentSkillsWithCount = parentSkills.map((skill, index) => ({
    ...skill,
    children: parentSkillsCount[index].length,
  }));

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
        parentSkills={parentSkillsWithCount}
        columns={subSkillsColumns}
      />
    </div>
  );
}
export default SkillsPage;
