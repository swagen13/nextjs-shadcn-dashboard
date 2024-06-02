"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { updateSubSkill } from "../action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditSubSkillSchema, EditSubSkillSchemaType } from "../schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

const initialState = {
  message: "",
  status: false,
};

export default function EditSubSkillForm({ subSkillData, parentSkill }: any) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<EditSubSkillSchemaType>({
    resolver: zodResolver(EditSubSkillSchema),
    defaultValues: {
      id: subSkillData.id.toString(),
      name: subSkillData.name,
      description: subSkillData.description || "",
      translationName: subSkillData.translations[0].name,
      parentSkill: subSkillData.parentId,
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("translationName", data.translationName);
    formData.append("id", data.id);
    formData.append("parentSkill", data.parentSkill);

    const response = await updateSubSkill(formData);

    if (response.status) {
      Swal.fire({
        title: "Skill updated successfully",
        icon: "success",
      });
      return false;
    } else {
      Swal.fire({
        title: "Error updating skill",
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
                  name="translationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="translationName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentSkill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Skill</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="block w-full mt-1  border-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 "
                        >
                          <option value="">Select Parent Skill</option>
                          {parentSkill.map((skill: any) => (
                            <option key={skill.id} value={skill.parentId}>
                              {skill.name}
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
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Spinner size={20} />
              ) : (
                <div className="flex items-center justify-center">
                  Update Subskill
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
