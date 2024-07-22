import React from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { MARK_SUBSCRIPT, MARK_SUPERSCRIPT } from "@udecode/plate-basic-marks";
import { focusEditor, toggleMark, useEditorRef } from "@udecode/plate-common";

// import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";
import { BsSubscript, BsSuperscript, BsThreeDots } from "react-icons/bs";

export function MoreDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert">
          <BsThreeDots />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
      >
        <DropdownMenuItem
          onSelect={() => {
            toggleMark(editor, {
              clear: MARK_SUPERSCRIPT,
              key: MARK_SUBSCRIPT,
            });
            focusEditor(editor);
          }}
        >
          <BsSuperscript className="mr-2 size-5" />
          Superscript
          {/* (⌘+,) */}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            toggleMark(editor, {
              clear: MARK_SUBSCRIPT,
              key: MARK_SUPERSCRIPT,
            });
            focusEditor(editor);
          }}
        >
          <BsSubscript className="mr-2 size-5" />
          Subscript
          {/* (⌘+.) */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}