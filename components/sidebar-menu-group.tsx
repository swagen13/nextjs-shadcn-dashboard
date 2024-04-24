import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SideNavItemGroup } from "@/types/types";
import React from "react";
import { SideBarMenuItem } from "./sidebar-menu-item";
import classNames from "classnames";

function SideBarMenuGroup({ menuGroup }: { menuGroup: SideNavItemGroup }) {
  const { toggleCollapse } = useSidebarToggle();
  const menuGroupTitleStyle = classNames(
    "py-4 tracking-[.1rem] font-medium uppercase text-sm text-[#A5A1AA] ",
    {
      "text-center": toggleCollapse,
    }
  );
  return (
    <>
      <h3 className={menuGroupTitleStyle}>
        {!toggleCollapse ? menuGroup.title : "..."}
      </h3>
      {menuGroup.menuList.map((item, index) => {
        return <SideBarMenuItem key={index} item={item}></SideBarMenuItem>;
      })}
    </>
  );
}

export default SideBarMenuGroup;
