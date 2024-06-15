"use client";

import { useParams } from "next/navigation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job, StatusUpdate } from "@models/types";

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const cookies = useCookies();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  const displayStatusUpdatesRecord = () => {
    setShowStatusHistory(true);
  };

  const showStatusObject = (status: StatusUpdate) => {
    return (
      <div>
        <p className="text-xl">
          Status: <b>{status.status}</b>
        </p>
        <p>{status.update_text}</p>
      </div>
    );
  };

  if (!jobId) {
    return <div>Loading...</div>;
  }

  const fetchData = async () => {
    const response = await request(
      "GET",
      {},
      `/jobs/${jobId}`,
      cookies.get("token")
    );
    console.log(response);
    setJobDetails(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p>Job Details</p>
        </div>
        <p>ID: {jobId}</p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 flex justify-between">
        <div>
          <p className="text-3xl font-bold">{jobDetails?.role}</p>
          <p className="text-xl">{jobDetails?.company.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={displayStatusUpdatesRecord}
            className="p-2 px-8 rounded-lg bg-primary text-white font-bold"
          >
            View Status Updates
          </button>
          <button className="p-2 px-8 rounded-lg bg-primary text-white font-bold">
            Update Status
          </button>
          <button className="p-2 px-8 rounded-lg bg-primary text-white font-bold">
            Edit Job
          </button>
          <button className="p-2 px-8 rounded-lg bg-red-500 text-white font-bold">
            Delete Job
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {showStatusHistory &&
          jobDetails?.statuses.map((status: StatusUpdate) => (
            <div key={status.id}>{showStatusObject(status)}</div>
          ))}
      </div>
    </div>
  );
}
