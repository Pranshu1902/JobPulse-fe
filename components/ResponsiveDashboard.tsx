"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Breadcrumbs from "@components/Breadcrumbs";
import DashBoard from "@components/DashBoard";
import LandingPage from "@components/LandingPage";

export default function ResponsiveDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const cookies = useCookies();

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  if (pathname == "/login" || pathname == "/signup") {
    return <>{children}</>;
  } else if (pathname == "/" && !cookies.get("token")) {
    return <LandingPage />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Breadcrumbs onMenuClick={handleMenuClick} />
      <div
        className={`fixed md:fixed top-0 md:top-auto w-4/5 md:w-1/6 h-screen bg-green-400 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-20`}
      >
        <DashBoard />
      </div>
      <div className="mt-12 md:mt-0 ml-0 md:ml-[16.6667%] w-full md:w-[83.3333%] overflow-scroll">
        {children}
      </div>
    </div>
  );
}
