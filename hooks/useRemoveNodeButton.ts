import { Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { TElement } from "@udecode/slate";

const deleteImageFromStorage = async (url: string) => {
  try {
    const response = await fetch(
      `/api/deleteImage?url=${encodeURIComponent(url)}`,
      {
        method: "DELETE",
      }
    );

    if (response.status !== 204) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    console.log("Image deleted successfully:", url);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const useRemoveNodeButton = ({ element }: { element: TElement }) => {
  const editor = useSlateStatic() as ReactEditor;

  return {
    props: {
      onClick: async () => {
        const url = (element as any).url;
        if (url) {
          await deleteImageFromStorage(url);
        }
        const path = ReactEditor.findPath(editor, element);
        Transforms.removeNodes(editor, { at: path });
      },
      onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      },
    },
  };
};
