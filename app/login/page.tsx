"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@assets/logo_white.png";
import { loginData } from "@models/types";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { request } from "@api/fetch";
import { useRouter } from "next/navigation";
import { NotificationManager } from "react-notifications";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@constants/constants";
import { TextField } from "@mui/material";
import Button from "@components/Button";
import Loader from "@components/Loader"; // Assuming Loader component is defined
import { useAuth } from "@context/AuthContext";

const initialLoginData: loginData = {
  username: "",
  password: "",
};

export default function Login() {
  const [data, setData] = useState(initialLoginData);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const cookies = useCookies();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission

    const datas = { username: data.username, password: data.password };
    try {
      const response = await request("POST", datas, "api-token-auth/");

      if (response && response["token"]) {
        cookies.set("token", response["token"]);
        NotificationManager.success("Logged in successfully", "Success");
        router.push("/");
      } else {
        NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  // Redirect to home page if token already exists
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
    document.title = "Login | JobPulse";
  }, [router, isAuthenticated]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side with logo */}
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full bg-primary">
        <Image src={logo} alt="logo" className="w-2/3 md:w-1/3" />
      </div>

      {/* Right side with login form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">Login</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 w-[300px]"
        >
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

          {/* Loader displayed conditionally based on 'loading' state */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <Loader />
            </div>
          )}
        </form>

        <p className="mt-2">
          New User?{" "}
          <Link href="/signup" className="text-primary">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
