import { JobStatus } from "@/models/models";

export const COMMON_ERROR_NOTIFICATION_MESSAGE: string =
  "Something went wrong!";

export const JOB_STATUSES: JobStatus[] = [
  "Applied",
  "Offered",
  "Rejected",
  "Accepted",
  "Withdrawn",
];

export const backendBaseURL = "https://web-production-84a7.up.railway.app";
