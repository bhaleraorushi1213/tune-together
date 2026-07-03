import { Link } from "react-router-dom";
import { LayoutDashboardIcon } from "lucide-react";
import { Show, SignOutButton } from "@clerk/react";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => {
  const isAdmin = false;

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        TuneTogether
      </div>
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Link to={"/admin"} className="flex items-center bg-zinc-800 hover:bg-zinc-700 rounded-md px-4 py-2">
            <LayoutDashboardIcon className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <Show when="signed-in" >
          <SignOutButton />
        </Show>
        <Show when="signed-out" >
          <SignInOAuthButtons />
        </Show>
      </div>
    </div>
  )
}

export default Topbar;