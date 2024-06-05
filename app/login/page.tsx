"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@assets/logo.png";
import google from "@assets/google.png";
import { loginData } from "@models/types";
import TextInput from "@components/TextInput";
import Link from "next/link";
// import { cookies } from "next/headers";
import { useCookies } from "next-client-cookies";
import { request } from "@/app/api/fetch";
import { redirect } from "next/navigation";
import { NotificationManager } from "react-notifications";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@constants/constants";

const initialLoginData: loginData = {
  email: "",
  username: "",
  password: "",
};

const initialErrors: loginData = {
  email: "",
  username: "",
  password: "",
};

export default function Login() {
  const [data, setData] = useState(initialLoginData);
  const [errors, setErrors] = useState(initialErrors);

  const cookies = useCookies();

  // const validateData = (data: loginData) => {
  //   let valid = true;
  //   let error = initialErrors;
  //   if (data.email.length === 0) {
  //     error["email"] = "Email is required";
  //     valid = false;
  //   }
  //   if (data.password.length === 0) {
  //     error["password"] = "Password is required";
  //     valid = false;
  //   } else if (data.password.length < 8) {
  //     error["password"] = "Password length should be atleast 8";
  //     valid = false;
  //   }
  //   setErrors(error);
  //   return valid;
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if (validateData(data)) {
    // }

    const datas = { username: data.email, password: data.password };
    const response = await request("POST", datas, "api-token-auth/");

    if (response && response["token"]) {
      cookies.set("token", response["token"]);
      NotificationManager.success("Logged in successfully", "Success");
    } else {
      NotificationManager.error(
        COMMON_ERROR_NOTIFICATION_MESSAGE,
        "Error"
      );
    }
  };

  // navigate to home page is token already present
  useEffect(() => {
    if (cookies.get("token")) {
      redirect("/");
    }
  }, [cookies]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full bg-purple-400">
        <Image src={logo} alt="logo" className="w-1/3"></Image>
        {/* <p className="font-bold text-5xl">JobPulse</p> */}
        {/* <p>Stay Ahead of the Game with JobPulse</p> */}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Login</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Replace custom component with some package */}
          <TextInput
            title="Email"
            type={"text"}
            value={data.email}
            setValue={(e) => setData({ ...data, email: e.target.value })}
            error={errors.email}
          ></TextInput>
          <TextInput
            title="Password"
            type={"password"}
            value={data.password}
            setValue={(e) => setData({ ...data, password: e.target.value })}
            error={errors.password}
          ></TextInput>
          <button type="submit" className="border border-black rounded-lg p-2">
            Login
          </button>
          <button className="flex justify-center items-center gap-2 border border-black rounded-lg p-2">
            <Image width={25} src={google} alt="google"></Image>
            Login with Google
          </button>
        </form>
        <p>
          New User?{" "}
          <Link href={"/signup"} className="text-blue-500">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
