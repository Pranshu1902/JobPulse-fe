"use client";

import { useParams } from 'next/navigation';

export default function JobDetail() {
  const params = useParams();
  const jobId = params.job_id;

  if (!jobId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <p>Job Details</p>
        <p>{jobId}</p>
      </div>
    </div>
  );
}
