"use client";

import { useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job } from "@models/models";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const cookies = useCookies();
  const [filteredJobList, setFilteredJobList] = useState<{
    [key: string]: Job[];
  }>({
    Applied: [],
    Offered: [],
    Rejected: [],
    Withdrawn: [],
    Accepted: [],
  });

  const fetchData = async () => {
    const response = await request("GET", {}, "jobs/", cookies.get("token"));
    console.log(response);
    setJobs(response);

    // sort by status
    const organizedJobs = response.reduce(
      (acc: { [key: string]: Job[] }, job: Job) => {
        const status = job.status.status;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(job);
        return acc;
      },
      { Applied: [], Offered: [], Rejected: [], Withdrawn: [], Accepted: [] }
    );

    setFilteredJobList(organizedJobs);
  }

  fetchData();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <p className="text-2xl">Welcome, Pranshu</p>
      <Link href={"/jobs/new"}><Button type="secondary" text="Add New Job" /></Link>
      {/* <button className="p-2 rounded-lg border border-primary">Add New Job</button> */}
      </div>
      <div className="flex justify-around gap-2 items-center mt-6">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Applied</p>
          <p className="font-bold text-5xl">{filteredJobList["Applied"]?.length}</p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Offered</p>
          <p className="font-bold text-5xl">{filteredJobList["Offered"]?.length}</p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Rejected</p>
          <p className="font-bold text-5xl">{filteredJobList["Rejected"]?.length}</p>
        </div>
      </div>
    </div>
  );
}
