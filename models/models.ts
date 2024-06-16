export type Company = {
  name: string;
};

export type JobStatus =
  | "Applied"
  | "Offered"
  | "Rejected"
  | "Withdrawn"
  | "Accepted";

export type StatusUpdate = {
  id: string;
  job: string;
  status: JobStatus;
  update_text: string;
  date_posted: string;
};

export type Job = {
  id: string;
  role: string;
  company: Company;
  application_date: string;
  contract_length: string;
  job_link: string;
  platform: string;
  salary: string;
  status: StatusUpdate;
  statuses: StatusUpdate[];
};
