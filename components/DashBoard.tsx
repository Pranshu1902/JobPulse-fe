"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@assets/logo.png";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faList, faUser } from "@fortawesome/free-solid-svg-icons";

export default function DashBoard() {
  const pathname = usePathname();

  if (pathname == "/login" || pathname == "/signup") {
    return null;
  }

  const tabs = [
    { name: "Home", route: "/", icon: faHome },
    { name: "List", route: "/list", icon: faList },
    { name: "Profile", route: "/profile", icon: faUser },
  ];

  return (
    <div className="bg-green-400 p-2 h-full">
      <Image src={logo} alt="logo" className="w-1/2"></Image>

      <div className="flex flex-col gap-4 mt-6">
        {tabs.map((tab, i) => (
          <Link
            key={i}
            href={tab.route}
            className={`${
              pathname === tab.route && "bg-green-500"
            } p-4 rounded-lg text-xl hover:bg-green-500 w-full flex items-center gap-2`}
          >
            <FontAwesomeIcon icon={tab.icon}></FontAwesomeIcon>
            <p>{tab.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
