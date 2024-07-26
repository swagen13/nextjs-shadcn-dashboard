import { serializeHtml } from "@udecode/plate-serializer-html";
import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const useSerializeHtmlCallback = (editor: any) => {
  return useCallback(
    (nodes: any) => {
      const html = serializeHtml(editor, {
        nodes,
        dndWrapper: (props) => (
          <DndProvider backend={HTML5Backend} {...props} />
        ),
      });
      return html;
    },
    [editor]
  );
};
