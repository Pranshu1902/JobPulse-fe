"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@assets/logo_white.png";
import { signupData } from "@models/types";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { request } from "@/app/api/fetch";
import { useRouter } from "next/navigation";
import { NotificationManager } from "react-notifications";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@constants/constants";
import { TextField } from "@mui/material";
import Button from "@/components/Button";
import Loader from "@/components/Loader"; // Assuming Loader component is defined

const initialSignupData: signupData = {
  username: "",
  password: "",
  confirm_password: "",
};

export default function Signup() {
  const [data, setData] = useState(initialSignupData);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const cookies = useCookies();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission

    if (data.password !== data.confirm_password) {
      NotificationManager.error("Password doesn't match", "Error");
      setLoading(false); // Reset loading state
      return;
    }

    const datas = { username: data.username, password: data.password };

    try {
      const response = await request("POST", datas, "users/");

      if (response && response.id) {
        NotificationManager.success("Account created successfully", "Success");

        // log in user
        const loginResponse = await request("POST", datas, "api-token-auth/");

        if (loginResponse && loginResponse["token"]) {
          cookies.set("token", loginResponse["token"]);
          router.push("/");
        }
      } else {
        NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  // Redirect to home page if token already exists
  useEffect(() => {
    if (cookies.get("token")) {
      router.push("/");
    }
  }, [cookies, router]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full bg-primary">
        <Image src={logo} alt="logo" className="w-2/3 md:w-1/3"></Image>
      </div>
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Signup</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 w-[300px]">
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
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={data.confirm_password}
            onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
          />
          <Button type="primary" text="Signup" />

          {/* Loader displayed conditionally based on 'loading' state */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <Loader />
            </div>
          )}
        </form>
        <p className="mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
