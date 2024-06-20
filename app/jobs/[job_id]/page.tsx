"use client";

import { useRouter, useParams } from "next/navigation";
import {
  faChevronLeft,
  faClock,
  faGlobe,
  faMoneyBill,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { request } from "@api/fetch";
import { useCookies } from "next-client-cookies";
import { Job, JobComment } from "@/models/models";
import Modal from "@components/Modal";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@/app/constants/constants";
import { NotificationManager } from "react-notifications";
import ConfirmDelete from "@/components/modals/ConfirmDelete";
import StatusTimeline from "@/components/Timeline";
import { TextField } from "@mui/material";
import Button from "@/components/Button";
import Loader from "@/components/Loader";

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const cookies = useCookies();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading status

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

  const addComment = async () => {
    const data = { comment: newComment };
    const response = await request(
      "POST",
      data,
      `/jobs/${jobId}/comment/`,
      cookies.get("token")
    );

    if (response?.id) {
      NotificationManager.success("Comment posted successfully", "Success");
      setNewComment("");
      fetchData();
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
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

  const showCommentBox = (comment: JobComment) => {
    return (
      <div key={comment.id} className="bg-lightgray p-3 rounded-lg relative">
        <p>{comment.comment}</p>
        <p className="text-sm absolute right-2 bottom-2">
          {new Date(comment.date).toLocaleString()}
        </p>
      </div>
    );
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await request(
        "GET",
        {},
        `/jobs/${jobId}`,
        cookies.get("token")
      );
      setJobDetails(response);
    } catch (error) {
      console.error("Error fetching job details:", error);
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    } finally {
      setLoading(false); // Set loading to false when fetching completes
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!jobId || !jobDetails?.id || loading) {
    return <Loader />; // Display loader while fetching data
  }

  return (
    <div className="p-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p>Job Details</p>
        </div>
        <p>ID: {jobId}</p>
      </div>
      <div className="bg-lightgray rounded-lg p-4 flex flex-col md:flex-row gap-6 justify-between">
        <div>
          <p className="text-3xl font-bold">{jobDetails?.role}</p>
          <p className="text-xl">{jobDetails?.company.name}</p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} />
              <p className="text-xl">{jobDetails?.platform}</p>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyBill} />
              <p className="text-xl">{jobDetails?.salary}</p>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              <p className="text-xl">
                {jobDetails?.application_date &&
                  new Date(jobDetails.application_date).toLocaleString()}
              </p>
            </div>
            <a
              href={jobDetails?.job_link}
              target="_blank"
              className="hover:underline"
            >
              <FontAwesomeIcon icon={faExternalLink} /> Job Link
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="primary"
            text="View Status Updates"
            onClick={displayStatusUpdatesRecord}
          />
          <Button
            type="primary"
            text="Update Status"
            onClick={updateJobStatus}
          />
          {/* <Button type="primary" text="Edit Job" onClick={editJob} /> */}
          <Button
            type="delete"
            text="Delete Job"
            onClick={displayDeleteModal}
          />
        </div>
      </div>
      <div>
        <div className="text-2xl mt-4">Comments:</div>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full md:w-4/5"
          />
          <Button
            onClick={addComment}
            className="w-full md:w-1/5"
            type="primary"
            text="Add"
          ></Button>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          {jobDetails?.comments.length ?? 0 > 0 ? (
            jobDetails?.comments.map((comment: JobComment) =>
              showCommentBox(comment)
            )
          ) : (
            <div className="bg-lightgray p-3 rounded-lg flex justify-center">
              No Comments Found
            </div>
          )}
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
