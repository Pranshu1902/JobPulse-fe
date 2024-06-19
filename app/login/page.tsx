"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@assets/logo_white.png";
import { loginData } from "@models/types";
import Link from "next/link";
// import { cookies } from "next/headers";
import { useCookies } from "next-client-cookies";
import { request } from "@/app/api/fetch";
import { useRouter } from "next/navigation";
import { NotificationManager } from "react-notifications";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@constants/constants";
import { TextField } from "@mui/material";
import Button from "@/components/Button";

const initialLoginData: loginData = {
  username: "",
  password: "",
};

// const initialErrors: loginData = {
//   username: "",
//   password: "",
// };

export default function Login() {
  const [data, setData] = useState(initialLoginData);
  // const [errors, setErrors] = useState(initialErrors);

  const cookies = useCookies();
  const router = useRouter();

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

    const datas = { username: data.username, password: data.password };
    const response = await request("POST", datas, "api-token-auth/");

    if (response && response["token"]) {
      cookies.set("token", response["token"]);
      NotificationManager.success("Logged in successfully", "Success");
      router.push("/");
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }
  };

  // navigate to home page is token already present
  useEffect(() => {
    if (cookies.get("token")) {
      router.push("/");
    }
  }, [cookies, router]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full bg-primary">
        <Image src={logo} alt="logo" className="w-2/3 md:w-1/3"></Image>
        {/* <p className="font-bold text-5xl">JobPulse</p> */}
        {/* <p>Stay Ahead of the Game with JobPulse</p> */}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Login</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Password"
            type="password"
            variant="outlined"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button type="primary" text="Login" />
          {/* <button className="flex justify-center items-center gap-2 border border-black rounded-lg p-2">
            <Image width={25} src={google} alt="google"></Image>
            Login with Google
          </button> */}
        </form>
        <p>
          New User?{" "}
          <Link href={"/signup"} className="text-primary">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
