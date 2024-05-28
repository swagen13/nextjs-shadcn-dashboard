"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteSkill, getSkills } from "./action";
import { SkillsDataTable } from "./dataTable/dataTable";
import { skillsColumns } from "./dataTable/column";
import Swal from "sweetalert2";

const SkillsPage = () => {
  const [skills, setSkills] = useState<any>([]);

  useEffect(() => {
    getSkills().then((data) => {
      setSkills(data);
    });
  }, []);

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await deleteSkill(id);
      if (response.message === "Skill deleted successfully") {
        console.log("Skill deleted successfully");

        // Trigger success alert
        Swal.fire("Skill deleted successfully", "", "success");

        // update skills state by filtering out the deleted skill
        setSkills((prevData: any[]) =>
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
        <h1 className="text-2xl font-bold">Skill</h1>
        <Link href="/skills/addSkill">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Skill
          </Button>
        </Link>
      </div>

      {/* Pass the handleDeleteUser function to the DataTable component */}
      {skills && (
        <SkillsDataTable
          data={skills}
          columns={skillsColumns}
          onDeleteSkill={handleDeleteSkill}
        />
      )}
    </div>
  );
};
export default SkillsPage;
