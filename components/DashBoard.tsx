"use client";

import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Logo from "@components/Logo";

export default function DashBoard() {
  const cookies = useCookies();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname == "/login" || pathname == "/signup") {
    return null;
  }

  const tabs = [
    { name: "Home", route: "/", icon: faHome, tabIndex: 0 },
    { name: "Jobs", route: "/jobs", icon: faUserGraduate, tabIndex: 1 },
    { name: "Profile", route: "/profile", icon: faUser, tabIndex: 2 },
  ];

  const getActiveTab = (pathname: string): number => {
    const routes = ["/", "/jobs", "/profile"];
    let index = 0;

    routes.forEach((route: string, i: number) => {
      if (pathname.startsWith(route)) {
        index = i;
      }
    });

    return index;
  };

  const activeTab = getActiveTab(pathname);

  const logout = () => {
    cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="bg-primary text-white p-2 h-full flex flex-col justify-between">
      <div>
        <Logo />

        <div className="flex flex-col gap-4 mt-6">
          {tabs.map((tab, i) => (
            <Link
              key={i}
              href={tab.route}
              className={`${
                activeTab === tab.tabIndex && "bg-secondary"
              } p-4 rounded-lg text-xl hover:bg-secondary w-full flex items-center gap-2`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <p>{tab.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 text-lg w-full mt-4">
        <FontAwesomeIcon icon={faUser} />
        <div>
          <p className="text-lg">Pranshu Aggarwal</p>
          <button onClick={logout} className="hover:cursor-pointer text-md">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
