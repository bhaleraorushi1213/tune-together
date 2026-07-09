import { useEffect } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { HeadphonesIcon, Music4, Users } from "lucide-react";
import { useUser } from "@clerk/react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="h-full w-full min-h-0 overflow-hidden bg-surface rounded-lg border border-border flex flex-col">
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0 text-text-muted" />
          <h2 className="font-display font-semibold text-text">What others are listening to</h2>
        </div>
      </div>

      {!user && <LoginPrompt />}

      {user && (
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-2">
            {users.map((u) => {
              const activity = userActivities.get(u.clerkId);
              const isPlayingSomething = activity && activity !== "Idle";

              return (
                <div key={u._id} className="cursor-pointer hover:bg-surface-hover p-3 rounded-lg transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="size-10 border border-border">
                        <AvatarImage src={u.imageUrl} alt={u.fullName} />
                        <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface ${
                          onlineUsers.has(u.clerkId) ? "bg-success" : "bg-text-faint"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-text truncate">{u.fullName}</span>
                      </div>

                      {isPlayingSomething ? (
                        <div className="mt-1 flex gap-x-2 items-start">
                          <Music4 className="size-4 text-primary shrink-0 animate-pulse" />
                          <div className="min-w-0">
                            <div className="text-xs text-text font-medium truncate">
                              {activity.replace("Playing ", "").split(" by ")[0]}
                            </div>
                            <div className="text-xs text-text-muted truncate">{activity.split(" by ")[1]}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-text-muted">Idle</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-full blur-lg opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-surface rounded-full p-4">
        <HeadphonesIcon className="size-8 text-primary" />
      </div>
    </div>

    <div className="space-y-2 max-w-62.5">
      <h3 className="text-lg font-display font-semibold text-text">See What Friends Are Playing</h3>
      <p className="text-sm text-text-muted">Login to discover what music your friends are enjoying right now</p>
    </div>
  </div>
);