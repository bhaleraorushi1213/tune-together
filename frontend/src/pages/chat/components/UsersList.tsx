import UsersListSkeleton from "../../../components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useChatStore } from "../../../stores/useChatStore";
import { cn } from "../../../lib/utils";

const UsersList = () => {
  const { users, selectedUser, setSelectedUser, onlineUsers, isUsersLoading, unreadCounts } = useChatStore();

  return (
    <div className="h-full min-h-0 flex flex-col border-border sm:border-r overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-1 p-2 sm:p-4">
          {isUsersLoading ? (
            <UsersListSkeleton />
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  "flex items-center gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-colors",
                  selectedUser?.clerkId === user.clerkId ? "bg-surface-hover" : "hover:bg-surface-hover"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="size-10 sm:size-12">
                    <AvatarImage src={user.imageUrl} alt={user.fullName} />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-surface",
                      onlineUsers.has(user.clerkId) ? "bg-success" : "bg-text-faint"
                    )}
                  />
                  {unreadCounts[user.clerkId] > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none rounded-full bg-primary text-primary-foreground">
                      {unreadCounts[user.clerkId] > 99 ? "99+" : unreadCounts[user.clerkId]}
                    </span>
                  )}
                </div>

                {/* name now shows on mobile too, since mobile gets its own full-width pane instead of a squished icon rail */}
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate text-text block">{user.fullName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersList;