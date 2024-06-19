import { ButtonTypes } from "@models/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  type: ButtonTypes;
  buttonType?: "submit" | "reset" | "button" | undefined;
  text: string;
  onClick?: (e: any) => void;
  icon?: any;
  className?: string;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className={`${
        props.type === "primary"
          ? "bg-primary text-white"
          : props.type === "delete"
          ? "bg-red-500 text-white"
          : props.type === "cancel"
          ? "bg-gray-200"
          : "border border-primary"
      } font-bold p-2 rounded-lg px-12 py-2 flex justify-center items-center w-full gap-2 ${props?.className}`}
      onClick={props.onClick}
      type={props?.buttonType}
    >
      <FontAwesomeIcon icon={props?.icon} />
      {props.text}
    </button>
  );
}
