import {
  BsHouseDoor,
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
            title: "Sub Skill",
            path: "/subSkill",
          },
          {
            title: "Children Skill",
            path: "/childrenSkill",
          },
        ],
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
