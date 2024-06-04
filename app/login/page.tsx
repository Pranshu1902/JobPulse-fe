"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "@assets/logo.png";
import { loginData } from "@types";

const initialLoginData: loginData = {
  email: "",
  username: "",
  password: "",
};

export default function Login() {
  const [data, setData] = useState(initialLoginData);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <Image src={logo} alt="logo" className="w-1/3"></Image>
        {/* <p className="font-bold text-5xl">JobPulse</p> */}
        {/* <p>Stay Ahead of the Game with JobPulse</p> */}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Login</p>
        <form></form>
      </div>
    </div>
  );
}
