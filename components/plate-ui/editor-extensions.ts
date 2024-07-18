import { Editor, Element, Node } from "slate";

const deleteImageFromStorage = async (url: string) => {
  console.log("url", url);

  //   try {
  //     const response = await fetch("/api/deleteImage", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ path: url }),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       console.error(result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //   }
};

export const withImageDeletion = (editor: Editor) => {
  const { apply } = editor;

  editor.apply = (operation) => {
    if (
      operation.type === "remove_node" &&
      Element.isElement(operation.node) &&
      (operation.node as any).type === "image"
    ) {
      const url = (operation.node as any).url;
      if (url) {
        deleteImageFromStorage(url);
      }
    }
    apply(operation);
  };

  return editor;
};
