import {
  BsBlockquoteLeft,
  BsFilePost,
  BsHouseDoor,
  BsPencil,
  BsPeople,
  BsPersonLinesFill,
  BsSliders,
} from "react-icons/bs";
import { SideNavItemGroup } from "./types/types";

export const SIDENAV_ITEM: SideNavItemGroup[] = [
  {
    title: "Dashboards",
    menuList: [
      {
        title: "Dashboard",
        path: "/",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Manage",
    menuList: [
      {
        title: "Skills",
        path: "/skills",
        icon: <BsSliders size={20} />,
        submenu: true,
        subMenuItems: [
          {
            title: "Skills",
            path: "/skills",
          },
          {
            title: "Skill Sortable",
            path: "/dragAndDrop",
          },
        ],
      },
      {
        title: "Job Post",
        path: "/jobPost",
        icon: <BsFilePost size={20} />,
      },
      {
        title: "Editors",
        path: "/editor",
        icon: <BsPencil size={20} />,
      },
      {
        title: "Users",
        path: "/users",
        icon: <BsPeople size={20} />,
      },
      {
        title: "Profile",
        path: "/profile",
        icon: <BsPersonLinesFill size={20} />,
      },
    ],
  },
];
