"use client";

import { useEffect, useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job, User } from "@models/models";
import Link from "next/link";
import Button from "@components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMoneyBill,
  faFilter,
  faCross,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import Filter from "@/components/Filter";
import { JOB_STATUSES } from "./constants/constants";

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
  const [user, setUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [filter, setFilter] = useState<string[]>([]);

  const showJobCard = (job: any) => {
    return (
      <div key={job.id} className="bg-lightgray shadow border-2 hover:border-primary transition duration-200 p-3 rounded-lg">
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUserData = async () => {
    const response = await request(
      "GET",
      {},
      "/current-user/",
      cookies.get("token")
    );
    setUser(response);
    console.log(response);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <p className="text-3xl font-semibold">Welcome, {user?.first_name}</p>
        <Link href={"/jobs/new"}>
          <Button type="secondary" text="Add New Job" />
        </Link>
      </div>
      <div className="flex md:flex-row flex-col justify-around gap-2 items-center mt-6">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-lightgray shadow w-full">
          <p className="text-xl">Applied</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Applied"]?.length}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-lightgray shadow w-full">
          <p className="text-xl">Offered</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Offered"]?.length}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-lightgray shadow w-full">
          <p className="text-xl">Rejected</p>
          <p className="font-bold text-5xl">
            {filteredJobList["Rejected"]?.length}
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Filter statuses={JOB_STATUSES} filter={filter} setFilter={setFilter}>
          <FontAwesomeIcon icon={faFilter} /> Filter
        </Filter>
      </div>
      <div className="mt-2">
        <div className="grid md:grid-cols-3 gap-4">
          {jobs
            ?.filter(
              (job: Job) =>
                filter.length === 0 || filter.includes(job.status.status)
            )
            .map((job: Job) => showJobCard(job))}
        </div>
      </div>
    </div>
  );
}
