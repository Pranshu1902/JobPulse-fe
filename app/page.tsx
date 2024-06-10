"use client";

import { useState } from "react";
import { request } from "./api/fetch";
import { useCookies } from "next-client-cookies";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const cookies = useCookies();

  const fetchData = async () => {
    const response = await request("GET", {}, "jobs/", cookies.get("token"));
    console.log(response);
    setJobs(response);
  }

  fetchData();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <p className="text-2xl">Welcome, Pranshu</p>
      <button className="p-2 rounded-lg border border-purple-500">Add New Job</button>
      </div>
      <div className="flex justify-around gap-2 items-center mt-6">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Applied</p>
          <p className="font-bold text-5xl">{jobs?.length}</p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Offered</p>
          <p className="font-bold text-5xl">12</p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Rejected</p>
          <p className="font-bold text-5xl">12</p>
        </div>
      </div>
    </div>
  );
}
