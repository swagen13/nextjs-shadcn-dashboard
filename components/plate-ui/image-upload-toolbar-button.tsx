// /components/image-upload-toolbar-button.tsx
import React, { useRef, useState } from "react";
import { useEditorState } from "@udecode/plate-common";
import { insertImage } from "@udecode/plate-media";
import { BsImage } from "react-icons/bs";
import { Button } from "./button";
import { put } from "@vercel/blob";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const ImageUploadToolbarButton = () => {
  const editor = useEditorState();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // Upload the image buffer to the server
      const imageBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Upload the image to Vercel Blob
      const response = await put(`editorImages/${file.name}`, buffer, {
        access: "public",
        token: "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
        contentType: file.type,
      });

      if (response.url) {
        // Insert the image URL into the editor
        insertImage(editor, response.url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <Button
        type="button" // Ensure this is a button, not a submit button
        onClick={() => inputRef.current?.click()}
        title="Upload Image"
        className="bg-white text-black hover:bg-gray-50"
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <BsImage />
        )}
      </Button>
    </>
  );
};
