"use client";

import { request } from "@api/fetch";
import { JOB_STATUSES } from "@constants/constants";
import Dropdown from "@components/Dropdown";
import { Job, JobStatus } from "@/models/models";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "next-client-cookies";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Button from "@/components/Button";

export default function UpdateJobStatus() {
  const router = useRouter();
  const params = useParams();
  const cookies = useCookies();
  const jobId = params.job_id;
  const [jobDetails, setJobDetails] = useState<Job>();
  const [status, setStatus] = useState<JobStatus>();
  const [updateText, setUpdateText] = useState("");

  const fetchData = async () => {
    const data = { status: status, update_text: updateText };
    const response = await request(
      "POST",
      data,
      `/jobs/${jobId}/update_status/`,
      cookies.get("token")
    );
    setJobDetails(response);

    // set the current value of status dropdown as current status of job
    setStatus(response.status.status);
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
          <p>Update Job Status</p>
        </div>
        <p>ID: {jobId}</p>
      </div>
      <div>
        <div>
          <p>
            {jobDetails?.role} - {jobDetails?.company?.name}
          </p>
        </div>
        <form className="flex flex-col gap-4">
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
          />
          <Button type="primary" text={"Update"} onClick={() => {}}></Button>
        </form>
      </div>
    </div>
  );
}
