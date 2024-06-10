import { JobStatus } from "@/models/types";

export const COMMON_ERROR_NOTIFICATION_MESSAGE: string =
  "Something went wrong!";

export const JOB_STATUSES: JobStatus[] = [
  "Applied",
  "Offered",
  "Rejected",
  "Accepted",
  "Withdrawn",
];
