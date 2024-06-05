"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "@assets/logo.png";
import google from "@assets/google.png";
import { loginData } from "@models/types";
import TextInput from "@components/TextInput";
import Link from "next/link";

const initialLoginData: loginData = {
  email: "",
  username: "",
  password: "",
};

export default function Login() {
  const [data, setData] = useState(initialLoginData);
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full bg-purple-400">
        <Image src={logo} alt="logo" className="w-1/3"></Image>
        {/* <p className="font-bold text-5xl">JobPulse</p> */}
        {/* <p>Stay Ahead of the Game with JobPulse</p> */}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Sign Up</p>
        <form className="flex flex-col gap-4">
          <TextInput
            title="Email"
            type={"email"}
            value={data.email}
            setValue={(e) => setData({ ...data, email: e.target.value })}
          ></TextInput>
          <TextInput
            title="Password"
            type={"password"}
            value={data.password}
            setValue={(e) => setData({ ...data, password: e.target.value })}
          ></TextInput>
          <button className="border border-black rounded-lg p-2">Login</button>
          <button className="flex justify-center items-center gap-2 border border-black rounded-lg p-2">
            <Image width={25} src={google} alt="google"></Image>
            Login with Google
          </button>
        </form>
        <p>
          Already have an account? <Link href={"/login"}>Login</Link>
        </p>
      </div>
    </div>
  );
}
