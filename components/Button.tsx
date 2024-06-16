import { ButtonTypes } from "@models/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  type: ButtonTypes;
  text: string;
  onClick?: (e: any) => void;
  icon?: any;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className={`${
        props.type === "primary"
          ? "bg-primary text-white"
          : "border border-primary"
      } font-bold p-2 rounded-lg px-12 py-2 flex justify-center items-center`}
      onClick={props.onClick}
      type="submit"
    >
      <FontAwesomeIcon icon={props?.icon} />
      {props.text}
    </button>
  );
}
