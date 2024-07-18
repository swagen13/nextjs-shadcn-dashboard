import React from "react";

import { withRef } from "@udecode/cn";
import {
  ELEMENT_UL,
  useListToolbarButton,
  useListToolbarButtonState,
} from "@udecode/plate-list";

import { ToolbarButton } from "./toolbar";
import { BsListOl, BsListUl } from "react-icons/bs";

export const ListToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: string;
  }
>(({ nodeType = ELEMENT_UL, ...rest }, ref) => {
  const state = useListToolbarButtonState({ nodeType });
  const { props } = useListToolbarButton(state);

  return (
    <ToolbarButton
      ref={ref}
      tooltip={nodeType === ELEMENT_UL ? "Bulleted List" : "Numbered List"}
      {...props}
      {...rest}
    >
      {nodeType === ELEMENT_UL ? <BsListUl /> : <BsListOl />}
    </ToolbarButton>
  );
});
