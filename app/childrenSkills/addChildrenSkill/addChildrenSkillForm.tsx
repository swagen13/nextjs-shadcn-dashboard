"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ChidrentSkillSchema, ChidrentSkillSchemaType } from "../schema";
import SkillFilter from "./addChildSkillFilter";
import { addChildSkill } from "../action";

interface Skill {
  id: string;
  name: string;
  parentid: string;
  children_count: number;
  childlevel: number;
}

export default function AddChildrenSkillForm({
  subskills,
}: {
  subskills: any[];
}) {
  const [skills, setSkills] = useState<any[]>(subskills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    console.log("skills", skills);
  }, [skills]);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ChidrentSkillSchemaType>({
    resolver: zodResolver(ChidrentSkillSchema),
    defaultValues: {
      skill_name: "",
      parent_id: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("skill_name", data.skill_name);

    // Get the last index of selectedSkills
    const parentSkill = selectedSkills[selectedSkills.length - 1];
    formData.append("parent_id", parentSkill);

    const response = await addChildSkill(formData);

    if (response.status) {
      console.log("response", response);

      if (response.skill) {
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // sort response.path by path
          response.path.sort((a: any, b: any) => a - b);

          // Find the parent skill object from the skills state with path
          let parentSkillObj = null;
          let currentSkills = skills; // Assuming skills is your state containing all skills

          // Traverse the path array to find the parent skill object
          for (let i = 0; i < response.path.length; i++) {
            const skillId = response.path[i];

            // Find the skill in currentSkills with matching id
            parentSkillObj = currentSkills.find(
              (skill) => skill.id === skillId
            );

            if (parentSkillObj) {
              // If found, update currentSkills to its children for next iteration
              currentSkills = parentSkillObj.children || [];
            } else {
              // If not found, break the loop (handle error case)
              console.error(
                `Skill with id ${skillId} not found in currentSkills`
              );
              break;
            }
          }

          if (parentSkillObj) {
            // count level from response.path
            const lastLevel = response.path.length;

            // Add new skill to skills state (if needed)
            const newSkill = {
              id: response.skill.id,
              name: response.skill.skill_name,
              parentid: parentSkill,
              children: [],
              level: lastLevel + 1,
            };

            // Update the parent skill object with new skill
            parentSkillObj.children = parentSkillObj.children || [];

            parentSkillObj.children.push(newSkill);

            // Update the skills state
            setSkills([...skills]);
          } else {
            console.error("Parent skill object not found in skills state");
          }
        });
        return false;
      } else {
        Swal.fire({
          title: "Error",
          text: "Unexpected response format",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: response.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return false;
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="skill_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Skill</FormLabel>
                      <FormControl>
                        <SkillFilter
                          parentSkills={skills}
                          onSelectChange={setSelectedSkills}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="reset"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
