import { Link, useLocation } from "react-router-dom";
import { HomeIcon, MessageCircle, Heart, ListMusic } from "lucide-react";
import { cn } from "../../lib/utils";
import { useChatStore } from "../../stores/useChatStore";

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/liked", icon: Heart, label: "Liked" },
  { to: "/playlists", icon: ListMusic, label: "Lists" },
];

const MobileNav = () => {
  const { pathname } = useLocation();
  const { totalUnread } = useChatStore();

  return (
    <nav className="sm:hidden flex items-center justify-around border-t border-border bg-surface py-2 shrink-0">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
              isActive ? "text-primary" : "text-text-muted"
            )}
          >
            <div className="relative">
              <Icon className="size-5" />
              {label === "Chat" && totalUnread > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none rounded-full bg-primary text-text">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;