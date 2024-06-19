"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChidrentSkillSchema, ChidrentSkillSchemaType } from "../schema";
import {
  addChildSkill,
  getChildrenSkillsBySubSkillId,
  getSubSkillsWithChildrenCount,
} from "../action";
import SkillFilter from "./addChildSkillFilter";
import { useRouter } from "next/navigation";

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
  subskills: Skill[];
}) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ChidrentSkillSchemaType>({
    resolver: zodResolver(ChidrentSkillSchema),
    defaultValues: {
      name: "",
      description: "",
      translationsname: "",
      subskillid: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("translationsname", data.translationsname);
    formData.append("subskillid", selectedSkills[selectedSkills.length - 1]);

    const response = await addChildSkill(formData);

    if (response.status) {
      Swal.fire({
        title: "Skill added successfully",
        icon: "success",
      });
      reset();
      formRef.current?.reset();
    } else {
      Swal.fire({
        title: "Error adding skill",
        icon: "error",
      });
    }
  });

  const handleSelectChange = (value: string) => {
    setSelectedSkills((prev) => {
      const updatedSkills = [...prev];
      updatedSkills[selectedSkills.length - 1] = value; // Ensure the selected skill is updated correctly
      if (
        selectedSkills.length === 0 ||
        selectedSkills[selectedSkills.length - 1] !== value
      ) {
        updatedSkills.push(value);
      }
      return updatedSkills;
    });

    // Only push a new route if a new skill is selected
    if (selectedSkills[selectedSkills.length - 1] !== value) {
      router.push(`/childrenSkill/addChildrenSkill?subSkillId=${value}`);
    }
  };

  const fetchSubSkills = async (parentId: string): Promise<any[]> => {
    const subSkills = await getChildrenSkillsBySubSkillId(parentId);
    return subSkills;
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="translationsname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Translation Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subskillid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Skill</FormLabel>
                      <FormControl>
                        <SkillFilter
                          parentSkills={subskills}
                          fetchSubSkills={fetchSubSkills}
                          onSelectChange={handleSelectChange}
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
