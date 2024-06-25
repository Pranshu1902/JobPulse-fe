"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "@models/models";
import { useCookies } from "next-client-cookies";
import { request } from "@api/fetch";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  getToken: () => string | undefined;
  isAuthenticated: () => boolean;
  logOut: () => void;
  isLoading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cookies = useCookies();
  const { data: session } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const fetchUser = async () => {
    setLoading(true);

    // token stored in cookies
    if (cookies.get("token")) {
      const token = cookies.get("token");
      const response = await request("GET", {}, "/current-user/", token);
      setUser({ ...response, token });
    }

    // user logged in through social media
    else if (session && session.user) {
      setUser({
        id: (session.user as any).id,
        first_name: (session.user as any).first_name ?? "",
        last_name: (session.user as any).last_name ?? "",
        image: session.user.image ?? "",
        username: (session.user as any).username,
        email: session.user.email ?? "",
        token: (session.user as any).authToken,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user && (cookies.get("token") || session?.user)) {
      fetchUser();
    }
  }, [cookies, user, session]);

  const getToken = () => user?.token ?? "";

  const isAuthenticated = () => !!user;

  const refetch = async () => {
    const response = await request("GET", {}, "/current-user/", user?.token);
    setUser({ ...response, token: user?.token });
  };

  const logOut = () => {
    if (cookies.get("token")) {
      cookies.remove("token");
    }
    signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        getToken,
        isAuthenticated,
        logOut,
        isLoading: loading,
        refetch,
      }}
    >
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
