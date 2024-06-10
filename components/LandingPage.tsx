import Image from "next/image";
import logo from "@assets/plain_logo.png";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-6">
        <Image src={logo} alt="logo" width={50}></Image>
        <p>JobPulse</p>
        <a href="#about">About Us</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href={"/login"} className="p-2 rounded-lg">
            Login
          </Link>
          <Link
            href={"/signup"}
            className="p-2 rounded-lg border border-purple-600"
          >
            Signup
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <p className="text-6xl font-bold p-6">Stay Ahead of the Game with JobPulse</p>
      </div>
    </div>
  );
}
