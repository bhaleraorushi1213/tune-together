const UsersListSkeleton = () => {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg animate-pulse">
      <div className="relative shrink-0">
        <div className="size-10 sm:size-12 rounded-full bg-surface-hover" />
        <div className="absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-surface bg-surface-hover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="h-6 w-28 bg-surface-hover rounded mb-2" />
      </div>
    </div>
  ));
};

export default UsersListSkeleton