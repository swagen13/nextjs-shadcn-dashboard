"use client";
import Spinner from "@/components/Spinner";
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
import { User } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { EditSkillSchema, EditSkillSchemaType } from "../schema";
import { updateSkill } from "../action";

const initialState = {
  message: "",
  status: false,
};

export default function EditSkillForm({ skillData }: any) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log("skillData", skillData);
  }, [skillData]);

  const form = useForm<EditSkillSchemaType>({
    resolver: zodResolver(EditSkillSchema),
    defaultValues: {
      id: skillData.id.toString(),
      skill_name: skillData.skill_name,
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("skill_name", data.skill_name);
    formData.append("id", data.id);

    const response = await updateSkill(formData);

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
                  Update Skill
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
