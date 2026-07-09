import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { useChatStore } from "../../../stores/useChatStore";

const ChatHeader = () => {
  const { selectedUser, onlineUsers, setSelectedUser } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 sm:p-4 border-b border-border flex items-center gap-2 shrink-0">
      {/* back button only matters on mobile where this replaces the user list */}
      <Button
        size="icon"
        variant="ghost"
        className="sm:hidden text-text-muted shrink-0"
        onClick={() => setSelectedUser(null)}
      >
        <ArrowLeft className="size-5" />
      </Button>

      <Avatar>
        <AvatarImage src={selectedUser.imageUrl} />
        <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h2 className="font-medium truncate text-text">{selectedUser.fullName}</h2>
        <p className="text-sm text-text-muted">
          {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;