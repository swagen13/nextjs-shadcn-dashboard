"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
// import { updateChildrenSkill } from "../action";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import {
  EditChidrentSkillSchema,
  EditChidrentSkillSchemaType,
} from "../schema";

const initialState = {
  message: "",
  status: false,
};

export default function EditChildrenSkillForm({
  childrenSkillData,
  subskillid,
}: any) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<EditChidrentSkillSchemaType>({
    resolver: zodResolver(EditChidrentSkillSchema),
    defaultValues: {
      id: childrenSkillData.id.toString(),
      name: childrenSkillData.name,
      description: childrenSkillData.description || "",
      translationsname: childrenSkillData.translations[0].name,
      subskillid: childrenSkillData.subskillid,
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("translationsname", data.translationsname);
    formData.append("subskillid", data.subskillid);
    formData.append("id", data.id);

    // const response = await updateChildrenSkill(formData);

    // if (response.status) {
    //   Swal.fire({
    //     title: "Skill added successfully",
    //     icon: "success",
    //   });
    //   reset();
    //   formRef.current?.reset();
    // } else {
    //   Swal.fire({
    //     title: "Error adding skill",
    //     icon: "error",
    //   });
    // }
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
                  name="translationsname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="translationsname" {...field} />
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
                        <select
                          {...field}
                          className="block w-full mt-1  border-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 "
                        >
                          <option value="">Select Parent Skill</option>
                          {subskillid.map((skill: any) => (
                            <option key={skill.id} value={skill.id}>
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
            {/* reset button */}
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
