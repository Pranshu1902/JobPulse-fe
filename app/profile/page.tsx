"use client";

import { useCookies } from "next-client-cookies";
import { request } from "@api/fetch";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { COMMON_ERROR_NOTIFICATION_MESSAGE } from "@constants/constants";
import { NotificationManager } from "react-notifications";
import Button from "@components/Button";
import { useRouter } from "next/navigation";

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function Profile() {
  const router = useRouter();
  const cookies = useCookies();
  const [user, setUser] = useState({
    id: 0,
    email: "",
    username: "",
    first_name: "",
    last_name: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading status

  const disabledEditMode = () => {
    setEditMode(false);
  };

  const enableEditMode = () => {
    setEditMode(true);
  };

  const logout = () => {
    cookies.remove("token");
    router.push("/login");
  };

  const updateUserDetails = async () => {
    setLoading(true); // Set loading to true when updating profile

    const data = {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    const response = await request(
      "PUT",
      data,
      `/users/${user.id}/`,
      cookies.get("token")
    );

    if (response?.id) {
      NotificationManager.success("Profile updated successfully", "Success");
      fetchUserData(); // Refresh user data after update
      disabledEditMode();
    } else {
      NotificationManager.error(COMMON_ERROR_NOTIFICATION_MESSAGE, "Error");
    }

    setLoading(false); // Reset loading state after request completes
  };

  const fetchUserData = async () => {
    const response = await request(
      "GET",
      {},
      "/current-user/",
      cookies.get("token")
    );
    setUser(response);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <p className="text-3xl font-semibold">My Profile</p>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <TextField
          className="w-full"
          id="outlined-basic"
          label="First Name"
          variant="outlined"
          value={user.first_name}
          onChange={(e) => setUser({ ...user, first_name: e.target.value })}
          disabled={!editMode}
        />
        <TextField
          className="w-full"
          id="outlined-basic"
          label="Last Name"
          variant="outlined"
          value={user.last_name}
          onChange={(e) => setUser({ ...user, last_name: e.target.value })}
          disabled={!editMode}
        />
        <TextField
          className="w-full"
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          disabled={!editMode}
        />
        <TextField
          className="w-full"
          id="outlined-basic"
          label="Email"
          variant="outlined"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          disabled={!editMode}
        />
      </div>
      <div className="mt-6">
        {editMode ? (
          <div className="flex items-center gap-4">
            <Button type="cancel" text="Cancel" onClick={disabledEditMode} />
            <Button type="primary" text="Save" onClick={updateUserDetails} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button type="primary" text="Edit" onClick={enableEditMode} />
            <Button type="delete" text="Sign out" onClick={logout} />
          </div>
        )}
      </div>

      {/* Loader displayed conditionally based on 'loading' state */}
      {loading && <Loader />}
    </div>
  );
}
