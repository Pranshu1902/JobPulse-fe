"use client";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function NewJob() {
  const router = useRouter();

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
      <form>
        <p>Role:</p>
        <input className="border border-primary" type="text" name="" id="" />
        <p>Company:</p>
        <input className="border border-primary" type="text" name="" id="" />
        <p>Platform:</p>
        <input className="border border-primary" type="text" name="" id="" />
      </form>
    </div>
  );
}
