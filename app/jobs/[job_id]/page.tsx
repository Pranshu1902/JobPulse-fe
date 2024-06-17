"use client";

import { useRouter, useParams } from "next/navigation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job } from "@/models/models";
import Modal from "@components/Modal";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@/app/constants/constants";
import { NotificationManager } from "react-notifications";
import ConfirmDelete from "@/components/modals/ConfirmDelete";
import StatusTimeline from "@/components/Timeline";

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const cookies = useCookies();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const displayStatusUpdatesRecord = () => {
    setShowStatusHistory(true);
  };

  const displayDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const updateJobStatus = () => {
    router.push(`/jobs/${jobId}/status`);
  };

  const deleteJob = async () => {
    const response = await request(
      "DELETE",
      {},
      `/jobs/${jobId}`,
      cookies.get("token")
    );

    if (response) {
      NotificationManager.success("Job deleted successfully", "Success");
      router.push("/jobs");
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
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
      <div className="bg-lightgray rounded-lg p-4 flex justify-between">
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
          <button
            onClick={displayDeleteModal}
            className="p-2 px-8 rounded-lg bg-red-500 text-white font-bold"
          >
            Delete Job
          </button>
        </div>
      </div>
      <Modal open={showStatusHistory} setOpen={setShowStatusHistory}>
        <div className="flex flex-col gap-2 p-6">
          <p className="text-2xl font-semibold">Status Update Track</p>
          <StatusTimeline statuses={jobDetails?.statuses} />
        </div>
      </Modal>
      <Modal open={showDeleteModal} setOpen={setShowDeleteModal}>
        <ConfirmDelete
          title={"Job"}
          onSubmit={deleteJob}
          onCancel={hideDeleteModal}
        />
      </Modal>
    </div>
  );
}
