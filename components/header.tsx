import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { BsList } from "react-icons/bs";

export default function Header() {
  const { toggleCollapse, invokerToggleCallapse } = useSidebarToggle();

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
  return (
    <header className={headerStyle}>
      <div className="flex items-center justify-between h-16">
        <button
          onClick={sideBarToggle}
          className="order-2 sm:order-1 bg-[#3a3f48] text-[#6e768e] hover:bg-white ml-3 rounded-md h-[30px] w-[30px] shadow-md shadow-black/10 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <BsList></BsList>
        </button>
        <div className="order-1 sm:order-2 h-10 w-10 rounded-full bg-[#3a3f48] flex items-center justify-center text-center">
          <span className="font-semibold text-sm">SR</span>
        </div>
      </div>
    </header>
  );
}
