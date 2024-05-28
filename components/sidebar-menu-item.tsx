"use client";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SideNavItem } from "@/types/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
  const { toggleCollapse } = useSidebarToggle();

  const linkStyle =
    "flex items-center min-h-[40px] h-full text-[#6e768e] py-2 px-4 hover:text-white rounded-md transition duration-200";
  const activeLinkStyle =
    "rounded-md text-white light:text-black light:bg-[#efefef] bg-[#3a3f48]";
  const ddLinkStyle = linkStyle;
  const navMenuDropdownItem =
    "text-[#6e768e] py-2 px-4 hover:text-white  transition duration-200";

  const pathName = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  return (
    <>
      {item.submenu ? (
        <div className="rounded-md min-w-[18px]">
          <a
            className={`${ddLinkStyle} ${
              item.path === pathName ? activeLinkStyle : ""
            } ${toggleCollapse ? "justify-center" : ""}`}
            onClick={toggleSubMenu}
          >
            {item.icon}
            {!toggleCollapse && (
              <>
                <span className="ml-3 leading-6 font-semibold">
                  {item.title}
                </span>
                <BsChevronRight
                  className={` ${
                    subMenuOpen ? "transform rotate-90" : ""
                  } ml-auto stroke-2 text-sm`}
                />
              </>
            )}
          </a>
          {subMenuOpen && !toggleCollapse && (
            <div className="bg-[#3a3f48] border-l-4">
              <div className="grid gap-y-2 px-10 py-3 leading-5">
                {item.subMenuItems?.map((subItem, index) => {
                  return (
                    <Link
                      key={index}
                      href={subItem.path}
                      className={`${navMenuDropdownItem} ${
                        subItem.path === pathName ? "text-white" : ""
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.path}
          className={`${linkStyle} ${
            item.path === pathName ? activeLinkStyle : ""
          }`}
        >
          {item.icon}
          {!toggleCollapse && (
            <span className="ml-3 leading-6 font-semibold">{item.title}</span>
          )}
        </Link>
      )}
    </>
  );
};
