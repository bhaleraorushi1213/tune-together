import { useUser } from "@clerk/react";
import { useState } from "react";
import { useChatStore } from "../../../stores/useChatStore";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage.trim()) return;
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="p-3 sm:p-4 mt-auto border-t border-border shrink-0">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-surface-hover border-none text-text focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="bg-primary hover:bg-primary-hover rounded-lg shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;