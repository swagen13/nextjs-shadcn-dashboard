import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { SIDENAV_ITEM } from '@/SIDEBAR_CONSTANTS';
import classNames from 'classnames';
import Image from 'next/image';
import { SideBarMenuItem } from './sidebar-menu-item';
import SideBarMenuGroup from './sidebar-menu-group';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebaseConfig';

export default function Sidebar() {
  const { toggleCollapse } = useSidebarToggle();
  const [user] = useAuthState(auth); // Get user from useAuthState hook

  const asideStyle = classNames(
    'sidebar overflow-y-auto fixed bg-[#31353d] text-grey-500 z-50 h-full shadow-lg shadow-grey-900/20 transition duration-300 ease-in-out w-[20rem]',
    {
      ['sm:w-[5.4rem] sm:left-0 left-[-100%]']: toggleCollapse,
      ['w-[20rem]']: !toggleCollapse,
    }
  );
  return (
    <aside className={asideStyle}>
      <div className="flex relative items-center py-5 px-3.5">
        <Image
          alt=""
          src={'/images.png'}
          className="w-12 mx3.5 min-h-fit"
          width={35}
          height={35}
        ></Image>
        {!toggleCollapse && (
          <h3 className="pl-2 font-bold text-2xl text-[#e6e9ee] min-w-max">
            {user ? user.email : 'User'}
          </h3>
        )}
      </div>
      <nav className="flex flex-col gap-2 transition duration-300">
        <div className="flex flex-col gap-2 px-4">
          {SIDENAV_ITEM.map((item, index) => {
            return (
              <SideBarMenuGroup key={index} menuGroup={item}></SideBarMenuGroup>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
