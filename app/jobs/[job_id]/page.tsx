"use client";

import { useParams } from "next/navigation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.job_id;

  if (!jobId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p>Job Details</p>
        </div>
        <p>{jobId}</p>
      </div>
    </div>
  );
}
