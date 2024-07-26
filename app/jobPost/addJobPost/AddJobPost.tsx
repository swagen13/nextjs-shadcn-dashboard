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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { addJobPost } from "../action";
import { JobPostSchema, JobPostSchemaType } from "../schema";
import { editor, PlateEditor } from "./PlateEditor";
import { deserializeHtml, TElement, TText } from "@udecode/plate-common";
import { serializeHtml } from "@udecode/plate-serializer-html";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  const [description, setDescription] = useState([]);

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

  const { isSubmitting, errors } = formState;

  const onSubmit = handleSubmit(async (data: any) => {
    const adjustedNodes = adjustNodes(description);
    const serializedHtml = serializeEditorContent(editor, adjustedNodes);

    const jobPostData = {
      ...data,
      description: serializedHtml,
    };

    const response = await addJobPost(jobPostData);

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

  const deserializeEditorContent = (editor: any, html: string) => {
    const domParser = new DOMParser();
    const document = domParser.parseFromString(html, "text/html");
    const elements = Array.from(document.body.childNodes);

    return elements.map((element: any) => {
      const dataKey = element
        .querySelector("[data-key]")
        ?.getAttribute("data-key");
      const textContent = element.textContent || "";

      return {
        type: "p",
        children: [{ text: textContent }],
        id: dataKey || null,
      };
    });
  };

  const serializeEditorContent = (editor: any, nodes: any[]) => {
    const nodesWithId = nodes.map((node, index) => ({
      ...node,
      id: node.id || index.toString(),
    }));

    const adjustedNodes = nodesWithId.map((node) => {
      if (node.children && node.children.length > 0) {
        node.children = node.children.map((child: { text: string }) => {
          if (child.text && child.text.includes("\n")) {
            child.text = child.text.replace(/\n/g, "<br />");
          }
          return child;
        });
      }
      return node;
    });

    return serializeHtml(editor, {
      nodes: adjustedNodes,
      dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
      convertNewLinesToHtmlBr: false, // Ensure new lines are converted to <br />
    });
  };

  const adjustNodes = (nodes: TElement[]) => {
    const adjustedNodes: TElement[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.children.length === 1 && node.children[0].text === "") {
        if (i > 0) {
          const prevNode = adjustedNodes[adjustedNodes.length - 1];
          if (prevNode && prevNode.children.length > 0) {
            prevNode.children[prevNode.children.length - 1].text += "\n";
          }
        }
      } else {
        adjustedNodes.push(node);
      }
    }
    return adjustedNodes;
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
