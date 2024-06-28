"use client";

import { request } from "@api/fetch";
import { JOB_STATUSES } from "@constants/constants";
import Dropdown from "@components/Dropdown";
import { Job, JobStatus } from "@models/models";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { NotificationManager } from "react-notifications";
import Button from "@components/Button";
import { useAuth } from "@context/AuthContext";

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function UpdateJobStatus() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [status, setStatus] = useState<JobStatus>("Applied");
  const [updateText, setUpdateText] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading status
  const { getToken } = useAuth();

  const fetchData = async () => {
    setLoading(true); // Set loading to true while fetching data
    const response = await request("GET", {}, `/jobs/${jobId}/`, getToken());
    setJobDetails(response);
    setStatus(response.status.status);
    setLoading(false); // Reset loading state after data fetching completes
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting form

    const data = { status: status, update_text: updateText };
    const response = await request(
      "POST",
      data,
      `/jobs/${jobId}/update_status/`,
      getToken()
    );

    if (response?.id) {
      NotificationManager.success("Status updated successfully", "Success");
      router.replace(`/jobs/${jobId}`);
    }

    setLoading(false); // Reset loading state after request completes
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.title = `Update Status | ${jobDetails?.role} | JobPulse`;
  }, [jobDetails]);

  return (
    <div className="p-4">
      {loading && <Loader />} {/* Display loader when loading is true */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p>Update Job Status</p>
        </div>
        <p>ID: {jobId}</p>
      </div>
      <div>
        <div>
          <p className="text-xl font-semibold">
            {jobDetails?.role} - {jobDetails?.company?.name}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Dropdown
            name={"Status"}
            state={status}
            setState={setStatus}
            options={JOB_STATUSES}
          ></Dropdown>
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Update Text"
            variant="outlined"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
          />
          <div className="flex justify-center gap-2">
            <Button
              type="cancel"
              buttonType={"button"}
              text={"Cancel"}
              onClick={() => router.back()}
            ></Button>
            <Button type="primary" buttonType="submit" text={"Update"}></Button>
          </div>
        </form>
      </div>
    </div>
  );
}
