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
import { Job, JobComment } from "@/models/models";
import Modal from "@components/Modal";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@/app/constants/constants";
import { NotificationManager } from "react-notifications";
import ConfirmDelete from "@components/modals/ConfirmDelete";
import StatusTimeline from "@components/Timeline";
import { CircularProgress, TextField } from "@mui/material";
import Button from "@components/Button";
import Loader from "@components/Loader";
import { useAuth } from "@context/AuthContext";
import BasicCommentMenu from "@components/BasicCommentMenu";
import EditComment from "@/components/modals/EditComment";

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentID, setCommentID] = useState("");
  const [showEditComment, setShowEditComment] = useState(false);
  const [editCommentDetails, setEditCommentDetails] = useState({
    id: "",
    newComment: "",
  });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading status
  const { getToken, isLoading } = useAuth();

  const displayStatusUpdatesRecord = () => {
    setShowStatusHistory(true);
  };

  const displayDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const displayDeleteCommentModal = (id: string) => {
    setShowDeleteCommentModal(true);
    setCommentID(id);
  };

  const hideDeleteCommentModal = () => {
    setShowDeleteCommentModal(false);
    setCommentID("");
  };

  const displayEditCommentModal = (id: string, comment: string) => {
    setShowEditComment(true);
    setEditCommentDetails({ id: id, newComment: comment });
  };

  const hideEditCommentModal = () => {
    setShowEditComment(false);
    setEditCommentDetails({ id: "", newComment: "" });
  };

  const updateJobStatus = () => {
    router.push(`/jobs/${jobId}/status`);
  };

  const editJob = () => {
    router.push(`/jobs/${jobId}/edit`);
  };

  const addComment = async () => {
    setAddCommentLoading(true);
    const data = { comment: newComment };
    const response = await request(
      "POST",
      data,
      `/jobs/${jobId}/comment/`,
      getToken()
    );

    if (response?.id) {
      NotificationManager.success("Comment posted successfully", "Success");
      setNewComment("");
      fetchComments();
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
    setAddCommentLoading(false);
  };

  const editComment = async (newComment: string) => {
    setLoadingModal(true);
    const response = await request(
      "PUT",
      { comment: newComment },
      `/comments/${editCommentDetails.id}/`,
      getToken()
    );

    if (response?.id) {
      NotificationManager.success("Comment updated successfully", "Success");
      fetchComments();
      hideEditCommentModal();
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
    setLoadingModal(false);
  };

  const deleteJob = async () => {
    setLoadingModal(true);
    const response = await request("DELETE", {}, `/jobs/${jobId}`, getToken());

    if (response) {
      NotificationManager.success("Job deleted successfully", "Success");
      router.replace("/jobs");
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
    setLoadingModal(false);
  };

  const deleteComment = async () => {
    setLoadingModal(true);
    const response = await request(
      "DELETE",
      {},
      `/comments/${commentID}`,
      getToken()
    );

    if (response) {
      NotificationManager.success("Comment deleted successfully", "Success");
      fetchComments();
      hideDeleteCommentModal();
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
    setLoadingModal(false);
  };

  const showCommentBox = (comment: JobComment) => {
    return (
      <div
        key={comment.id}
        className="bg-lightgray p-3 rounded-lg flex flex-col relative"
      >
        <p className="break-words md:w-5/6">{comment.comment}</p>
        <div className="md:w-1/6 flex items-center justify-between gap-2 pt-3 md:pt-0">
          <p className="text-sm md:absolute right-2 bottom-2">
            {new Date(comment.date).toLocaleString()}
          </p>
          <div className="md:absolute right-2 top-0">
            <BasicCommentMenu
              comment={comment}
              onEdit={displayEditCommentModal}
              onDelete={displayDeleteCommentModal}
            />
          </div>
        </div>
      </div>
    );
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await request(
        "GET",
        {},
        `/jobs/${jobId}/get_all_comments`,
        getToken()
      );
      if (jobDetails) {
        setJobDetails({ ...jobDetails, comments: response });
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    } finally {
      setCommentsLoading(false); // Set loading to false when fetching completes
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await request("GET", {}, `/jobs/${jobId}`, getToken());
        setJobDetails(response);
      } catch (error) {
        console.error("Error fetching job details:", error);
        NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchData();
  }, [isLoading, getToken, jobId]);

  useEffect(() => {
    document.title = `${jobDetails?.role} | JobPulse`;
  }, [jobDetails]);

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
          <Button type="primary" text="Edit Job" onClick={editJob} />
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
          {addCommentLoading ? (
            <div className="flex justify-center w-full md:w-1/5">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <Button
              onClick={addComment}
              className="w-full md:w-1/5"
              type="primary"
              text="Add"
            ></Button>
          )}
        </div>
        {commentsLoading ? (
          <div className="flex justify-center mt-4">
            <Loader />
          </div>
        ) : (
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
        )}
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
          isLoading={loadingModal}
        />
      </Modal>
      <Modal open={showDeleteCommentModal} setOpen={setShowDeleteCommentModal}>
        <ConfirmDelete
          title={"Comment"}
          onSubmit={deleteComment}
          onCancel={hideDeleteCommentModal}
          isLoading={loadingModal}
        />
      </Modal>
      <Modal open={showEditComment} setOpen={setShowEditComment}>
        <EditComment
          initialComment={editCommentDetails.newComment}
          isLoading={loadingModal}
          onCancel={hideEditCommentModal}
          onSubmit={editComment}
        />
      </Modal>
    </div>
  );
}
