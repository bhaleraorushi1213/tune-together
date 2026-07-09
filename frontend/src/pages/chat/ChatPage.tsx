import { useEffect, useRef } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useUser } from "@clerk/react";
import Topbar from "../../components/Topbar";
import UsersList from "./components/UsersList";
import { AudioWaveform } from "lucide-react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import { cn } from "../../lib/utils";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    if (!selectedUser || messages.length === 0) {
      prevMessageCountRef.current = messages.length;
      return;
    }

    const shouldAutoScroll = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (shouldAutoScroll) {
      requestAnimationFrame(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [messages, selectedUser]);

  return (
    <main className="h-full rounded-lg bg-linear-to-b from-surface to-base overflow-hidden flex flex-col">
      <Topbar />

      <div className="flex-1 min-h-0 grid sm:grid-cols-[250px_1fr]">

        <div className={cn("min-h-0 overflow-hidden", selectedUser ? "hidden sm:block" : "block")}>
          <UsersList />
        </div>

        <div className={cn("min-h-0 flex flex-col overflow-hidden", selectedUser ? "flex" : "hidden sm:flex")}>
          {selectedUser ? (
            <>
              <ChatHeader />
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-3 sm:p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={cn(
                        "flex items-start gap-2.5 sm:gap-3",
                        message.senderId === user?.id && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="size-7 sm:size-8 shrink-0">
                        <AvatarImage
                          src={message.senderId === user?.id ? user.imageUrl : selectedUser.imageUrl}
                        />
                      </Avatar>

                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[75%] sm:max-w-[70%]",
                          message.senderId === user?.id ? "bg-primary" : "bg-surface-hover"
                        )}
                      >
                        <p className="text-sm text-text">{message.content}</p>
                        <span className="text-xs text-text/70 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={endOfMessagesRef} />
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="hidden sm:flex flex-col items-center justify-center h-full space-y-6">
    <div className="p-1.5 rounded-lg bg-primary animate-bounce">
      <AudioWaveform className="size-8 text-text" />
    </div>
    <div className="text-center">
      <h3 className="text-text text-lg font-medium mb-1 font-display">No conversation selected</h3>
      <p className="text-text-muted text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);