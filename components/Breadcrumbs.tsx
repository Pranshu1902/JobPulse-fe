import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Logo from "@components/Logo";

export default function Breadcrumbs({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full bg-green-400 p-2 flex items-center justify-between md:hidden z-10">
      <Logo width={40} />
      <button onClick={onMenuClick} className="p-2">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
}
