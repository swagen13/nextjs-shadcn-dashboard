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
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { addSubSkill } from "../action";
import { SkillSchema, SkillSchemaType } from "../schema";

const initialState = {
  message: "",
  status: false,
};

export default function AddSkillForm({ parentSkills }: any) {
  useEffect(() => {
    console.log("parentSkills", parentSkills);
  }, [parentSkills]);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<SkillSchemaType>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      skill_name: "",
      parent_id: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    console.log("data", data);

    if (data.parent_id === "") {
      Swal.fire({
        title: "Please select parent skill",
        icon: "warning",
      });

      return;
    }
    const formData = new FormData();
    formData.append("skill_name", data.skill_name);
    formData.append("parent_id", data.parent_id);

    const response = await addSubSkill(formData);

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
              </div>
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Skill</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="block w-full mt-1  border-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 "
                      >
                        <option value="">Select Parent Skill</option>
                        {parentSkills.map((skill: any) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.skill_name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
