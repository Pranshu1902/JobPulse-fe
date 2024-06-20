"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "@models/models";
import { useCookies } from "next-client-cookies";
import { request } from "@api/fetch";

interface AuthContextType {
  user: AuthUser | null;
  getToken: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cookies = useCookies();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookies.get("token");
      if (token) {
        const response = await request("GET", {}, "/current-user/", token);
        setUser({ ...response, token });
      }
    };

    if (!user && cookies.get("token")) {
      fetchUser();
    }
  }, [cookies, user]);

  const getToken = () => user?.token;

  return (
    <AuthContext.Provider value={{ user, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
