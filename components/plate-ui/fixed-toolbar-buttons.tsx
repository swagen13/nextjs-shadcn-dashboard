import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
} from "@udecode/plate-basic-marks";
import { useEditorReadOnly } from "@udecode/plate-common";
import { MARK_HIGHLIGHT } from "@udecode/plate-highlight";
import { useState } from "react";
import {
  BsCode,
  BsHighlighter,
  BsSubscript,
  BsSuperscript,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import { ImageUploadToolbarButton } from "./image-upload-toolbar-button";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { LinkToolbarButton } from "./link-toolbar-button";
import { ListToolbarButton } from "./list-toolbar-button";
import { TableDropdownMenu } from "./table-dropdown-menu";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{ transform: "translateX(calc(-1px))" }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>
            <ToolbarGroup>
              <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
                <BsTypeBold />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
                <BsTypeItalic />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={MARK_UNDERLINE}
                tooltip="Underline (⌘+U)"
              >
                <BsTypeUnderline />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={MARK_STRIKETHROUGH}
                tooltip="Strikethrough (⌘+⇧+M)"
              >
                <BsTypeStrikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_CODE} tooltip="Code (⌘+E)">
                <BsCode />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_HIGHLIGHT}>
                <BsHighlighter />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_SUBSCRIPT}>
                <BsSubscript />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_SUPERSCRIPT}>
                <BsSuperscript />
              </MarkToolbarButton>
            </ToolbarGroup>
            <ToolbarGroup>
              <ImageUploadToolbarButton />
              <LinkToolbarButton />
              <ListToolbarButton />
              <TableDropdownMenu />
            </ToolbarGroup>
          </>
        )}
        <div className="grow" />
        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
