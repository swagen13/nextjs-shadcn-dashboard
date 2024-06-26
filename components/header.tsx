"use client";
import { auth } from "@/firebaseConfig";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { signOut } from "firebase/auth";
import { signOut as signOutSession } from "next-auth/react";
import { BsList } from "react-icons/bs";
import { Button } from "./ui/button";

// import useSignOut from "@/hooks/signout";

export default function Header() {
  const { toggleCollapse, invokerToggleCallapse } = useSidebarToggle();

  // const { removeSession, result, error } = useSignOut();

  const sideBarToggle = () => {
    invokerToggleCallapse();
  };

  const headerStyle = classNames(
    "fixed bg-[#31353d] w-full z-0 px-4 shadow-sm shadow-slate-500/40 ",
    {
      ["sm:pl-[5.6rem]"]: toggleCollapse,
      ["sm:pl-[20rem]"]: !toggleCollapse,
    }
  );

  async function LogOut() {
    // log out from firebase
    await signOut(auth);

    // log out from session
    await signOutSession();

    // redirect to login page
    window.location.href = "/";
  }

  return (
    <header className={headerStyle}>
      <div className="flex items-center justify-between h-16">
        {/* sidebar toggle button */}
        <Button onClick={sideBarToggle} className="text-white hover:bg-white">
          <BsList className="text-white hover:text-black" size={24}></BsList>
        </Button>

        <div className="order-1 sm:order-2 h-10 w-10 rounded-full bg-[#3a3f48] flex items-center justify-center text-center">
          {/* log out button */}
          <Button
            className="text-white hover:bg-white mr-6"
            onClick={() => {
              LogOut();
            }}
          >
            Log Out
          </Button>
          {/* <span className="font-semibold text-sm">SR</span> */}
        </div>
      </div>
    </header>
  );
}
