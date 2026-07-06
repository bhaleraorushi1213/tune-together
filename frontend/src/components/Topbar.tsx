import { Link } from "react-router-dom";
import { AudioWaveform, LayoutDashboardIcon } from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import { useAuthStore } from "../stores/useAuthStore";

import SignInOAuthButtons from "./SignInOAuthButtons";


const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <div className="p-1.5 border border-zinc-400 rounded-full bg-emerald-500">
          <AudioWaveform className="size-8 text-zinc-900"  />
        </div>
        <p className="font-semibold">TuneTogether</p>
      </div>
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Link to={"/admin"} className="flex items-center bg-zinc-800 hover:bg-zinc-700 rounded-md px-4 py-2">
            <LayoutDashboardIcon className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <Show when="signed-in" >
          <UserButton />
        </Show>
        <Show when="signed-out" >
          <SignInOAuthButtons />
        </Show>


      </div>
    </div>
  )
}

export default Topbar;