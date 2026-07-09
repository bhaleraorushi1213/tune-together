import { Loader } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import { axiosInstance } from "../lib/axios.ts";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isLoaded || !user || syncAttempted.current) return;

        await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl
        })
        syncAttempted.current = true
      } catch (error) {
        console.log("Erros in auth callback", error)
      } finally {
        navigate("/")
      }
    }
    syncUser();
  }, [isLoaded, user, navigate])


  return (
    <div className="h-screen w-full bg-base flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-surface border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="size-6 text-primary animate-spin" />
          <h3 className="text-text text-xl font-display font-bold">Logging you in</h3>
          <p className="text-text-muted text-sm">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage;