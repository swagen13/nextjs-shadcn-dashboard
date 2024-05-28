"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteSubSkill, getChildrenSkills } from "./action";
import { subSkillsColumns } from "./dataTable/column";
import { SubSkillsDataTable } from "./dataTable/dataTable";

const SkillsPage = () => {
  const [subSkills, setsubSkills] = useState<any>([]);

  useEffect(() => {
    getChildrenSkills().then((data) => {
      setsubSkills(data);
    });
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
        <h1 className="text-2xl font-bold">Children Skill</h1>
        <Link href="/childrenSkill/addChildrenSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Children Skill
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
