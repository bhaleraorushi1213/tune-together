import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { axiosInstance } from "../lib/axios.ts";
import { Loader } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore.ts";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else
    delete axiosInstance.defaults.headers.common['Authorization'];
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        if(token) {
          await checkAdminStatus();
        }
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider", error)
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [getToken, checkAdminStatus])

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader className="size-8 text-emerald-500 animate-spin " />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthProvider