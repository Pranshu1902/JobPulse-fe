"use client";

import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSignOutAlt,
  faUser,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Logo from "@components/Logo";

export default function DashBoard({
  onLinkClick,
}: {
  onLinkClick: () => void;
}) {
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
    onLinkClick();
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
              onClick={onLinkClick}
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
      <div className="flex flex-col gap-2 p-4 text-lg w-full mt-4">
        <p className="text-lg">Pranshu Aggarwal</p>
        <Link
          href="/logout"
          onClick={logout}
          className="rounded-lg text-xl hover:bg-green-500 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <p>Sign Out</p>
        </Link>
      </div>
    </div>
  );
}
