"use client";

import { JOB_STATUSES } from "@constants/constants";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import { Job, JobStatus } from "@/models/models";
import Link from "next/link";

export default function Jobs() {
  const cookies = useCookies();
  const [jobList, setJobList] = useState<Job[]>([]);

  const showBoardColumn = (status: JobStatus) => {
    return (
      <div className="p-3 rounded-xl bg-primary min-w-[300px] w-[300px] text-white flex flex-col max-h-[80vh]">
        <div>
          <p className="font-semibold text-2xl mb-4">{status}</p>
        </div>
        <div className="flex flex-col gap-6 overflow-y-auto pb-3">
          {jobList
            .filter((job: Job) => job.status.status === status)
            .map((job: Job) => showJobCard(job))}
        </div>
      </div>
    );
  };

  const showJobCard = (job: any) => {
    return (
      <div className="bg-secondary p-3 rounded-lg">
        <Link href={`/jobs/${job.id}`}>
          <b className="text-xl">{job.role}</b>
          <p>{job.company.name}</p>
          <p>{job.contract_length}</p>
          <p>Salary: {job.salary}</p>
        </Link>
      </div>
    );
  };

  const fetchData = async () => {
    const response = await request("GET", {}, "jobs/", cookies.get("token"));
    setJobList(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl">List Jobs</p>
        <Link
          href={"/jobs/new"}
          className="border border-primary p-2 rounded-lg px-6"
        >
          + New
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {JOB_STATUSES.map((job_status: JobStatus) =>
          showBoardColumn(job_status)
        )}
      </div>
    </div>
  );
}
