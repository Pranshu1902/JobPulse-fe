"use client";

import { useRouter, useParams } from "next/navigation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job, StatusUpdate } from "@/models/models";
import Modal from "@components/Modal";
import { DialogTitle } from "@headlessui/react";

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

  const updateJobStatus = () => {
    router.push(`/jobs/${jobId}/status`);
  };

  const showStatusObject = (status: StatusUpdate) => {
    return (
      <div>
        <p className="text-xl">
          Status: <b>{status.status}</b>
        </p>
        <p>{status.update_text}</p>
        <p className="text-sm">{status.date_posted}</p>
      </div>
    );
  };

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

  if (!jobId) {
    return <div>Loading...</div>;
  }

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
          <button
            onClick={updateJobStatus}
            className="p-2 px-8 rounded-lg bg-primary text-white font-bold"
          >
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
      <Modal open={showStatusHistory} setOpen={setShowStatusHistory}>
        <div className="flex flex-col gap-2 p-6">
          <DialogTitle
            as="h1"
            className="font-semibold leading-6 text-gray-900"
          >
            Status Update Track
          </DialogTitle>
          {jobDetails?.statuses.map((status: StatusUpdate) => (
            <div key={status.id}>{showStatusObject(status)}</div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
