"use client";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EditJobPostSchema, EditJobPostSchemaType } from "../schema";
import { PlateEditor } from "./PlateEditor";
import { editJobPost } from "../action";
import Swal from "sweetalert2";
import { serializeHtml } from "@udecode/plate-serializer-html";
import { createPlateEditor } from "@udecode/plate-common";

// Define an interface for skill
interface Users {
  id: number;
  username: string;
  email: string | null;
  password: string;
  image: number;
}

interface EditJobPostFormProps {
  users: any;
  jobPost: any;
}

export default function EditJobPostForm({
  users,
  jobPost,
}: EditJobPostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues = {
    show: jobPost[0].show,
    job_title: jobPost[0].job_title,
    wage: jobPost[0].wage,
    post_owner: jobPost[0].post_owner,
    description: jobPost[0].description,
    id: jobPost[0].id,
  };

  const [description, setDescription] = useState(
    JSON.parse(defaultValues.description)
  );

  const form = useForm<EditJobPostSchemaType>({
    resolver: zodResolver(EditJobPostSchema),
    defaultValues,
  });

  const { handleSubmit, reset, control, formState } = form;

  const { isSubmitting, errors } = formState;

  const onSubmit = handleSubmit(async (data: any) => {
    console.log("editor");

    // const jobPostData = {
    //   ...data,
    //   description: JSON.stringify(description),
    // };
    // const response = await editJobPost(jobPostData);
    // if (response.status) {
    //   Swal.fire({
    //     title: response.message,
    //     icon: "success",
    //   });
    // } else {
    //   Swal.fire({
    //     title: response.message,
    //     icon: "error",
    //   });
    // }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col space-y-4"
        ref={formRef}
      >
        <div className="bg-white p-6 rounded-xl space-y-4">
          <div className="flex ">
            <div className="w-6/12 mr-4">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Job Title"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-3/12 mr-4">
              <FormField
                control={form.control}
                name="post_owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Owner</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="p-2 border rounded-md w-full"
                      >
                        <option value="">Select Post Owner</option>
                        {users.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-3/12">
              <FormField
                control={form.control}
                name="wage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wage"
                        {...field}
                        className="p-2 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            Description
            <PlateEditor initialData={description} onChange={setDescription} />
          </div>
          <div className="flex">
            <div className="">
              <FormField
                control={form.control}
                name={"show"}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mt-2 ml-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Show Post</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex mt-6">
            <Button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 mr-4"
            >
              {isSubmitting ? <Spinner size={20} /> : "Edit Job Post"}
            </Button>
            <Button
              type="reset"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
              onClick={() => reset(defaultValues)}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}