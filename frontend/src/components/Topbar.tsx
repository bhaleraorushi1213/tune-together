import { Link, useNavigate } from "react-router-dom";
import { AudioWaveform, LayoutDashboardIcon, Search } from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import { useAuthStore } from "../stores/useAuthStore";
import { useSearchStore } from "../stores/useSearchStore";
import { Input } from "./ui/input";

import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const { query, setQuery } = useSearchStore();
  const navigate = useNavigate();

  const handleSearchFocus = () => {
    // navigate to /search as soon as they start typing anywhere, so results
    // have a dedicated page instead of a cramped dropdown
    navigate("/search");
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 justify-between p-3 sm:p-4 sticky top-0 bg-base/80 backdrop-blur-md z-10 border-b border-border">
      <div className="flex gap-2.5 items-center shrink-0">
        <div className="p-1.5 rounded-lg bg-primary">
          <AudioWaveform className="size-6 text-text" />
        </div>
        <p className="font-display font-semibold text-lg tracking-tight hidden sm:block">TuneTogether</p>
      </div>

      {/* SEARCH — center, grows to fill available space */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleSearchFocus}
          placeholder="Search songs, artists, albums"
          className="pl-9 bg-surface-hover border-border text-text placeholder:text-text-muted"
        />
      </div>

      <div className="flex gap-2 sm:gap-4 items-center shrink-0">
        {isAdmin && (
          <Link
            to={"/admin"}
            className="hidden sm:flex items-center bg-surface hover:bg-surface-hover border border-border rounded-lg px-4 py-2 text-sm transition-colors"
          >
            <LayoutDashboardIcon className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <Show when="signed-in">
          <UserButton />
        </Show>
        <Show when="signed-out">
          <SignInOAuthButtons />
        </Show>
      </div>
    </div>
  );
};

export default Topbar;