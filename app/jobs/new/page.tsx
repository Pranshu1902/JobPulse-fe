"use client";

import { JobCreateModel } from "@models/models";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { request } from "@/app/api/fetch";
import { useCookies } from "next-client-cookies";
import { NotificationManager } from "react-notifications";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@/app/constants/constants";

const initialJobData: JobCreateModel = {
  role: "",
  company: "",
  application_date: "",
  contract_length: "",
  job_link: "",
  platform: "",
  salary: "",
};

export default function NewJob() {
  const router = useRouter();
  const cookies = useCookies();
  const [jobData, setJobData] = useState<JobCreateModel>(initialJobData);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await request(
      "POST",
      jobData,
      "/jobs/",
      cookies.get("token")
    );

    if (response?.id) {
      NotificationManager.success("Job posted successfully", "Success");
      router.push("/jobs");
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
  };

  useEffect(() => {
    document.title = "New Job | JobPulse";
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p className="font-semibold text-2xl">Add New Job</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-12">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Role"
            variant="outlined"
            value={jobData.role}
            onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Company"
            variant="outlined"
            value={jobData.company}
            onChange={(e) =>
              setJobData({ ...jobData, company: e.target.value })
            }
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Salary"
            variant="outlined"
            value={jobData.salary}
            onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Contract Length"
            variant="outlined"
            value={jobData.contract_length}
            onChange={(e) =>
              setJobData({ ...jobData, contract_length: e.target.value })
            }
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Platform"
            variant="outlined"
            value={jobData.platform}
            onChange={(e) =>
              setJobData({ ...jobData, platform: e.target.value })
            }
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Job Link"
            variant="outlined"
            value={jobData.job_link}
            onChange={(e) =>
              setJobData({ ...jobData, job_link: e.target.value })
            }
          />
        </div>
        <div className="flex justify-center items-center">
          <Button
            type={"primary"}
            buttonType="submit"
            text="Create Job"
          ></Button>
        </div>
      </form>
    </div>
  );
}
