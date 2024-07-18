"use client";

import React from "react";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuProps,
} from "@radix-ui/react-dropdown-menu";

import { ELEMENT_BLOCKQUOTE } from "@udecode/plate-block-quote";
import {
  focusEditor,
  insertEmptyElement,
  useEditorRef,
} from "@udecode/plate-common";
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from "@udecode/plate-heading";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";

// import { Icons } from '@/components/icons';

import {
  ELEMENT_CODE_BLOCK,
  insertEmptyCodeBlock,
} from "@udecode/plate-code-block";
import { ELEMENT_EXCALIDRAW } from "@udecode/plate-excalidraw";
import { ELEMENT_HR } from "@udecode/plate-horizontal-rule";
import { ELEMENT_LINK, triggerFloatingLink } from "@udecode/plate-link";
import {
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  insertMedia,
} from "@udecode/plate-media";
import { ELEMENT_TABLE, insertTable } from "@udecode/plate-table";
import {
  BsBlockquoteLeft,
  BsDash,
  BsLink,
  BsListOl,
  BsListUl,
  BsParagraph,
  BsPlus,
  BsTable,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
} from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

const items = [
  {
    items: [
      {
        description: "Paragraph",
        icon: BsParagraph,
        label: "Paragraph",
        value: ELEMENT_PARAGRAPH,
      },
      {
        description: "Heading 1",
        icon: BsTypeH1,
        label: "Heading 1",
        value: ELEMENT_H1,
      },
      {
        description: "Heading 2",
        icon: BsTypeH2,
        label: "Heading 2",
        value: ELEMENT_H2,
      },
      {
        description: "Heading 3",
        icon: BsTypeH3,
        label: "Heading 3",
        value: ELEMENT_H3,
      },
      {
        description: "Quote (⌘+⇧+.)",
        icon: BsBlockquoteLeft,
        label: "Quote",
        value: ELEMENT_BLOCKQUOTE,
      },
      {
        value: ELEMENT_TABLE,
        label: "Table",
        description: "Table",
        icon: BsTable,
      },
      {
        value: "ul",
        label: "Bulleted list",
        description: "Bulleted list",
        icon: BsListUl,
      },
      {
        value: "ol",
        label: "Numbered list",
        description: "Numbered list",
        icon: BsListOl,
      },
      {
        value: ELEMENT_HR,
        label: "Divider",
        description: "Divider (---)",
        icon: BsDash,
      },
    ],
    label: "Basic blocks",
  },
  {
    label: "Inline",
    items: [
      {
        value: ELEMENT_LINK,
        label: "Link",
        description: "Link",
        icon: BsLink,
      },
    ],
  },
];

export function InsertDropdownMenu(
  props: React.JSX.IntrinsicAttributes & DropdownMenuProps
) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Insert">
          <BsPlus />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}
            <div>{label}</div>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  className="min-w-[180px]"
                  key={type}
                  onClick={async () => {
                    switch (type) {
                      case ELEMENT_CODE_BLOCK:
                        insertEmptyCodeBlock(editor);
                        break;
                      case ELEMENT_IMAGE:
                        await insertMedia(editor, { type: ELEMENT_IMAGE });
                        break;
                      case ELEMENT_MEDIA_EMBED:
                        await insertMedia(editor, {
                          type: ELEMENT_MEDIA_EMBED,
                        });
                        break;
                      case "ul":
                      case "ol":
                        insertEmptyElement(editor, ELEMENT_PARAGRAPH, {
                          select: true,
                          nextBlock: true,
                        });
                        break;
                      case ELEMENT_TABLE:
                        insertTable(editor);
                        break;
                      case ELEMENT_LINK:
                        triggerFloatingLink(editor, { focused: true });
                        break;
                      default:
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        });
                    }
                    focusEditor(editor);
                  }}
                >
                  <div className="flex">
                    {Icon && <Icon className="mr-2 size-5" />}
                    {itemLabel}
                  </div>
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
