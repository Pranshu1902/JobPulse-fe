"use client";

import { useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job } from "@models/models";
import Link from "next/link";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

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

  const showJobCard = (job: any) => {
    return (
      <div key={job.id} className="bg-lightgray p-3 rounded-lg">
        <div>
          <b className="text-xl">{job.role}</b>
          <p>{job.company.name}</p>
          <p>{job.contract_length}</p>
          <p>Salary: {job.salary}</p>
          <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} />
              <p className="text-xl">{job.platform}</p>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyBill} />
              <p className="text-xl">{job.salary}</p>
            </div>
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button
            className="mt-4"
            type="secondary"
            text="View Details"
          ></Button>
        </Link>
      </div>
    );
  };

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
  };

  fetchData();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl">Welcome, Pranshu</p>
        <Link href={"/jobs/new"}>
          <Button type="secondary" text="Add New Job" />
        </Link>
        {/* <button className="p-2 rounded-lg border border-primary">Add New Job</button> */}
      </div>
      <div className="flex justify-around gap-2 items-center mt-6">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Applied</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Applied"]?.length}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Offered</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Offered"]?.length}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-purple-100 w-full">
          <p className="text-xl">Rejected</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Rejected"]?.length}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4">
          {jobs?.map((job: Job) => showJobCard(job))}
        </div>
      </div>
    </div>
  );
}
