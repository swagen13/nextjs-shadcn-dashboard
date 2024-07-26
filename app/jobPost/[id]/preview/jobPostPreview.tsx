"use client";

import { useEffect, useState } from "react";
import { BsCashStack, BsEye, BsEyeSlash, BsPersonFill } from "react-icons/bs";
import { PlateEditor } from "./PlateEditor";

interface EditJobPostFormProps {
  jobPost: any;
}

const parseDescription = (description: string) => {
  if (!description) {
    return <p>No description available.</p>;
  }

  try {
    const elements = JSON.parse(description);

    return elements.map((element: any, index: number) => {
      const { children, type } = element;
      const text = children.map((child: any) => child.text).join(" ");
      return <p key={index}>{text}</p>;
    });
  } catch (error) {
    console.error("Failed to parse description:", error);
    return <p>Invalid description format.</p>;
  }
};

export default function JobPostPreview({ jobPost }: EditJobPostFormProps) {
  const [post, setPost] = useState(jobPost[0]);
  const [description, setDescription] = useState<any>(null);

  useEffect(() => {
    if (jobPost[0].description !== "") {
      console.log(jobPost[0].description);
      const convertedValue = deserializeEditorContent(jobPost[0].description);
      console.log("convertedValue", convertedValue);
      setDescription(convertedValue);
    }
  }, [jobPost]);

  const deserializeEditorContent = (html: string) => {
    const domParser = new DOMParser();
    const document = domParser.parseFromString(html, "text/html");
    const elements = Array.from(document.body.childNodes);

    return elements.map((element: any) => {
      if (!(element instanceof Element)) {
        return {
          type: "p",
          children: [{ text: element.textContent || "" }],
          id: null,
        };
      }

      const dataKey = element
        .querySelector("[data-key]")
        ?.getAttribute("data-key");
      let textContent = element.textContent || ""; // Use textContent to get the plain text without HTML tags
      textContent = textContent.replace(/<br\s*\/?>/g, "\n");

      return {
        type: "p",
        children: [{ text: textContent }],
        id: dataKey || null,
      };
    });
  };

  if (!post) {
    return <div>No job post found.</div>;
  }

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 border-b pb-2">
          {post.job_title}
        </h1>
        <div className="text-gray-700 mb-4 flex items-center">
          <BsPersonFill className="mr-2" />
          <strong className="mr-2">Posted by:</strong> {post.post_owner_name}
        </div>
        <div className="text-gray-700 mb-4 flex items-center">
          <BsCashStack className="mr-2" />
          <strong className="mr-2">Wage:</strong> {post.wage}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 mb-2">Description:</strong>
          <div className="p-4 border rounded-lg bg-gray-50">
            {description ? (
              <PlateEditor initialData={description} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="text-gray-700 mb-4 flex items-center">
          <strong className="mr-2">Status:</strong>
          {post.show ? (
            <span className="text-green-500 flex items-center">
              <BsEye className="mr-2" /> Visible
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              <BsEyeSlash className="mr-2" /> Hidden
            </span>
          )}
        </div>
      </div>
    </>
  );
}
