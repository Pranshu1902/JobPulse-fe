import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Button from "@components/Button";

interface ConfirmDeleteProps {
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ConfirmDelete(props: ConfirmDeleteProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-2xl text-red-500 font-bold">
        <FontAwesomeIcon icon={faWarning} />
        <p>Delete {props.title}</p>
      </div>
      <p>Are you sure you want to delete?</p>
      <div className="flex flex-col md:flex-row gap-2 justify-end mt-4">
        <Button type="cancel" text="Cancel" onClick={props.onCancel} />
        <Button type="delete" text="Delete" onClick={props.onSubmit} />
      </div>
    </div>
  );
}
