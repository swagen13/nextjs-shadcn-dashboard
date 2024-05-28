"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteSubSkill, getSubSkills } from "./action";
import { subSkillsColumns } from "./dataTable/column";
import { SubSkillsDataTable } from "./dataTable/dataTable";
import Swal from "sweetalert2";
import { getChildrenSkills } from "../childrenSkill/action";

const SkillsPage = () => {
  const [subSkills, setsubSkills] = useState<any>([]);

  useEffect(() => {
    const subskills = async () => {
      const subSkills = await getSubSkills();
      const childrenSkills = await getChildrenSkills();

      // get subSkills id from subSkills skill
      const subSkillsId = subSkills.map((skill: any) => skill.id);

      // filter childrenSkills by subSkills id
      const filteredChildrenSkills = childrenSkills.filter((skill: any) =>
        subSkillsId.includes(skill.subSkillId)
      );
      // merge subSkills.length with childrenSkills
      const subSkillsWithChildren = subSkills.map((skill: any) => {
        const children = filteredChildrenSkills.filter(
          (child: any) => child.subSkillId === skill.id
        );
        return { ...skill, children: children.length };
      });

      setsubSkills(subSkillsWithChildren);
    };

    subskills();
  }, []);

  const handleDeleteSubSkill = async (id: string) => {
    try {
      const response = await deleteSubSkill(id);
      if (response.message === "Skill deleted successfully") {
        console.log("Skill deleted successfully");

        // Trigger success alert
        Swal.fire("Skill deleted successfully", "", "success");

        // update skills state by filtering out the deleted skill
        setsubSkills((prevData: any[]) =>
          prevData.filter((skill) => skill.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      // Trigger error alert
      Swal.fire("Error deleting skill", "", "error");
    }
  };

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Sub Skill</h1>
        <Link href="/subSkill/addSubSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Sub Skill
          </Button>
        </Link>
      </div>

      {/* Pass the handleDeletesub skill function to the DataTable component */}
      {subSkills && (
        <SubSkillsDataTable
          data={subSkills}
          columns={subSkillsColumns}
          onDeleteSubSkill={handleDeleteSubSkill}
        />
      )}
    </div>
  );
};
export default SkillsPage;
