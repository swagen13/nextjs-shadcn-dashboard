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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { addJobPost } from "../action";
import { JobPostSchema, JobPostSchemaType } from "../schema";
import { editor, PlateEditor } from "./PlateEditor";
import { deserializeHtml, TElement, TText } from "@udecode/plate-common";
import { serializeHtml } from "@udecode/plate-serializer-html";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Skill } from "@/app/dragAndDrop/interface";

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
  skill: any[];
}

function flattenSkills(skills: Skill[]): Skill[] {
  return skills.reduce((acc, skill) => {
    acc.push(skill);
    if (skill.children) {
      acc = acc.concat(flattenSkills(skill.children));
    }
    return acc;
  }, [] as Skill[]);
}

function formatSkillName(skill_name: string, level: number): string {
  return "-".repeat(level) + skill_name;
}

export default function AddJobPostForm({ users, skill }: AddJobPostFormProps) {
  const [description, setDescription] = useState<any>(null);
  const [descriptionChanged, setDescriptionChanged] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues = {
    show: "false",
    job_title: "",
    wage: "",
    post_owner: "",
    description: "",
    skill_id: "",
    id: "",
  };

  const form = useForm<JobPostSchemaType>({
    resolver: zodResolver(JobPostSchema),
    defaultValues,
  });

  useEffect(() => {
    const convertedValue = convertToSlateValue(defaultValues.description);
    setDescription(convertedValue);
  }, []);

  useEffect(() => {
    if (
      description &&
      JSON.stringify(description) !==
        JSON.stringify(convertToSlateValue(defaultValues.description))
    ) {
      setDescriptionChanged(true);
    } else {
      setDescriptionChanged(false);
    }
  }, [description, defaultValues.description]);

  // Function to handle description changes
  const handleDescriptionChange = (newDescription: any) => {
    setDescription(newDescription);
  };

  useEffect(() => {
    const subscription = form.watch((value: Record<string, any>) => {
      const hasChanges = (
        Object.keys(defaultValues) as (keyof typeof defaultValues)[]
      ).some((key) => value[key] !== defaultValues[key]);

      if (hasChanges) {
        setIsSubmitDisabled(false);
      } else {
        setIsSubmitDisabled(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, defaultValues]);

  useEffect(() => {
    if (descriptionChanged) {
      setIsSubmitDisabled(false);
    }
  }, [descriptionChanged]);

  useEffect(() => {
    setIsChecked(defaultValues.show === "true");
  }, [defaultValues.show]);

  const { reset, control, formState } = form;

  const { isSubmitting, errors } = formState;

  const flattenedSkills = flattenSkills(skill);

  const convertToSlateValue = (html: string) => {
    const convertedValue = deserializeHtml(editor, {
      element: html,
    }) as (TElement | TText)[];

    const result: TElement[] = [];
    let currentParagraph: TElement = { type: "p", children: [] };

    convertedValue.forEach((node) => {
      if ((node as TElement).type === "br") {
        currentParagraph.children.push({ text: "\n" } as TText);
      } else {
        currentParagraph.children.push(node);
      }
    });

    if (currentParagraph.children.length > 0) {
      result.push(currentParagraph);
    }

    return result;
  };

  const onSubmit = async (data: any) => {
    // Serialize the HTML from your editor
    const serializedHtml = serializeHtml(editor, {
      nodes: description, // Assuming 'description' is the editor's state
      dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
      convertNewLinesToHtmlBr: true,
      stripWhitespace: false,
    });

    // Create a JSON object to send
    const jsonData = {
      ...data, // Add other form data (e.g., title, category, etc.)
      description: serializedHtml, // Add the serialized HTML to the JSON
    };

    console.log("JSON Data to send:", jsonData);
    try {
      const response = await fetch("/api/jobPosts/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData), // Convert JSON object to string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      // if response is successful, display the sweet alert message
      if (responseData.message) {
        Swal.fire({
          title: "Success",
          text: responseData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occurred while updating the job post",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        // action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
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

            <div className="w-3/12 mr-4">
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
            <div className="w-3/12 mr-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="description"
                        {...field}
                        value={field.value}
                        // onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-3/12">
              <FormField
                control={form.control}
                name="skill_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value?.toString() || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="p-2 border rounded-md w-full ml-2"
                      >
                        <option value="">No Skill</option>
                        {flattenedSkills.map((skill) => (
                          <option key={skill.id} value={skill.id.toString()}>
                            {formatSkillName(skill.name, skill.level)}
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

          {description && (
            <div>
              Description
              <PlateEditor
                initialData={description}
                onChange={handleDescriptionChange} // Use the handler here
              />
            </div>
          )}
          <div className="flex">
            <FormField
              control={form.control}
              name="show"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mt-2 ml-4">
                  <FormControl>
                    <select
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                      className="p-2 border rounded-md w-full"
                    >
                      <option value="false">Hidden</option>
                      <option value="true">Visible</option>
                    </select>
                  </FormControl>
                  <FormLabel>Show Post</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex mt-6">
            <Button
              type="submit"
              disabled={isSubmitDisabled} // Disable button initially
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 mr-4"
            >
              {isSubmitting ? <Spinner size={20} /> : "Add Job Post"}
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
