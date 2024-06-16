"use client";

import { JOB_STATUSES } from "@constants/constants";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { useEffect, useState, useRef } from "react";
import { Job, JobStatus } from "@/models/models";
import Link from "next/link";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Jobs() {
  const cookies = useCookies();
  const [jobList, setJobList] = useState<Job[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showBoardColumn = (status: JobStatus) => {
    const filteredJobs = jobList.filter(
      (job: Job) => job.status.status === status
    );

    return (
      <div
        key={status}
        className="p-3 rounded-xl bg-primary min-w-[300px] w-[300px] text-white flex flex-col max-h-[80vh]"
      >
        <div>
          <p className="font-semibold text-2xl mb-4">{status}</p>
        </div>
        <div className="flex flex-col gap-6 overflow-y-auto pb-3">
          {filteredJobs.map((job: Job) => showJobCard(job))}
        </div>
        {filteredJobs.length === 0 && (
          <div className="flex justify-center p-2 bg-secondary rounded-lg">
            No Jobs found
          </div>
        )}
      </div>
    );
  };

  const showJobCard = (job: any) => {
    return (
      <div key={job.id} className="bg-secondary p-3 rounded-lg">
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

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 200; // Adjust scrolling distance as needed
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 200; // Adjust scrolling distance as needed
    }
  };

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
      <div className="flex gap-4 relative">
        <button
          className="absolute px-3 left-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
          onClick={scrollLeft}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex gap-4 overflow-x-auto" ref={scrollRef}>
          {JOB_STATUSES.map((job_status: JobStatus) =>
            showBoardColumn(job_status)
          )}
        </div>
        <button
          className="absolute px-3 right-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
          onClick={scrollRight}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
