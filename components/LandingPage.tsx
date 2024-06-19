import Image from "next/image";
import home from "@assets/home/home.png";
import Link from "next/link";
import Button from "./Button";
import Logo from "./Logo";

export default function LandingPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between bg-primary p-3">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Link href={"/login"}>
            <Button type="primary" text="Login" />
          </Link>
          <Link href={"/signup"}>
            <Button type="secondary" text="Signup" />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col mt-6">
          <p className="text-6xl font-bold">
            Stay Ahead of the Game with JobPulse
          </p>
        </div>
        <div className="mt-12">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              className="w-1/2 rounded-lg shadow"
              src={home}
              alt="home page"
            />
            <p className="text-2xl flex justify-center w-1/2">
              Interactive Dashboards!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
