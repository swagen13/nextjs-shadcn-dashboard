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
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus } from "react-icons/bs";
import Swal from "sweetalert2";
import { addJobPost } from "../action";
import { JobPostSchema, JobPostSchemaType, JobPostSubmission } from "../schema";
import { useRouter } from "next/navigation";

// Define an interface for skill
interface Users {
  id: number;
  username: string;
  email: string | null;
  password: string;
  image: number;
}

interface AddJobPostFormProps {
  users: any[];
}

export default function AddJobPostForm({ users }: AddJobPostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const form = useForm<JobPostSchemaType>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: {
      show: false,
      job_title: "",
      wage: "",
      post_owner: "",
      descriptions: [{ description: "" }],
    },
  });

  const { handleSubmit, reset, control, formState } = form;
  const { fields, append } = useFieldArray({
    control,
    name: "descriptions",
  });
  const { isSubmitting, errors } = formState;

  const onSubmit = handleSubmit(async (data: JobPostSubmission) => {
    const response = await addJobPost(data);

    if (response.status) {
      Swal.fire({
        title: response.message,
        icon: "success",
      }).then(() => {
        router.push("/jobPost"); // Redirect to /jobPost
      });
    } else {
      Swal.fire({
        title: response.message,
        icon: "error",
      });
    }
  });

  const handleAddDescription = () => {
    append({ description: "" });
  };

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
                        {users.map((user) => (
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

          {fields.map((field, index) => (
            <div key={field.id} className="mt-4">
              <FormField
                control={form.control}
                name={`descriptions.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Description"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errors.descriptions && errors.descriptions[index] && (
                <span>{errors.descriptions[index]?.description?.message}</span>
              )}
            </div>
          ))}

          <div className="flex">
            <button
              type="button"
              onClick={handleAddDescription}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 flex items-center"
            >
              <BsPlus className="mr-2" />
              Add Description
            </button>
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
              {isSubmitting ? <Spinner size={20} /> : "Add Job Post"}
            </Button>
            <Button
              type="reset"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
