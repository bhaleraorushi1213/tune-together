import { Link } from "react-router-dom";
import { AudioWaveform } from "lucide-react";
import { Show, UserButton } from "@clerk/react";

const Header = () => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="rounded-lg">
          <div className="p-1.5 border border-zinc-400 rounded-full bg-green-500">
            <AudioWaveform className="size-10 text-zinc-900" />
          </div>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Music Manager</h1>
          <p className="text-zinc-400 mt-1">Manage your music catalog</p>
        </div>
      </div>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  )
}

export default Header