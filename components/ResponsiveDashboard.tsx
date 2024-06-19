"use client";

import { useState, useEffect, useRef } from "react";
import Breadcrumbs from "@components/Breadcrumbs";
import DashBoard from "@components/DashBoard";

export default function ResponsiveDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dashboardRef.current &&
      !dashboardRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-col md:flex-row">
      <Breadcrumbs onMenuClick={handleMenuClick} />
      <div
        ref={dashboardRef}
        className={`fixed md:fixed top-0 md:top-auto w-4/5 md:w-1/6 h-screen bg-green-400 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-20`}
      >
        <DashBoard onLinkClick={() => setMenuOpen(false)} />
      </div>
      <div className="mt-12 md:mt-0 ml-0 md:ml-[16.6667%] w-full md:w-[83.3333%] overflow-scroll">
        {children}
      </div>
    </div>
  );
}
