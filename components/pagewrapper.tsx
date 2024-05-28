"use client";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const { toggleCollapse, invokerToggleCallapse } = useSidebarToggle();

  const pageStyle = classNames("bg-slate-50 flex-grow text-black p-2 mt-16", {
    ["sm:pl-[5.4rem]"]: toggleCollapse,
    ["sm:pl-[20.4rem]"]: !toggleCollapse,
  });
  return <div className={pageStyle}>{children}</div>;
}
