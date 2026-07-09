import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import MobileNav from "./components/MobileNav";

const MainLayout = () => {
  return (
    <div className="h-screen bg-base text-text flex flex-col">
      <AudioPlayer />

      <div className="flex-1 flex overflow-hidden gap-2 p-2 min-h-0">
        {/* LEFT SIDEBAR — icon-only on tablet, hidden below sm (mobile uses bottom nav) */}
        <div className="hidden sm:flex sm:w-20 md:w-64 shrink-0 h-full overflow-hidden">
          <LeftSidebar />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </div>

        {/* RIGHT SIDEBAR — only on wide screens, no breakpoint listener needed */}
        <div className="hidden xl:flex xl:w-72 shrink-0">
          <FriendsActivity />
        </div>
      </div>

      <MobileNav />
      <PlaybackControls />
    </div>
  );
};

export default MainLayout;