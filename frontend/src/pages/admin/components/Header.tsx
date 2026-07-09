import { Link } from "react-router-dom";
import { AudioWaveform } from "lucide-react";
import { Show, UserButton } from "@clerk/react";

const Header = () => {
  return (
    <div className="flex sm:items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 mb-4 sm:mb-8">
        <Link to="/" className="rounded-lg shrink-0">
          <div className="p-1.5 rounded-lg bg-primary">
            <AudioWaveform className="size-8 sm:size-10 text-text" />
          </div>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text">Music Manager</h1>
          <p className="text-text-muted mt-1 text-sm sm:text-text">Manage your music catalog</p>
        </div>
      </div>
      <Show when="signed-in">
        <UserButton  />
      </Show>
    </div>
  );
};

export default Header;