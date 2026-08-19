export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-zinc-500 border-t-[#8BAAA8] rounded-full animate-spin" />
        <p className="text-[#a1a1aa] text-sm animate-pulse">Loading Workspace...</p>
      </div>
    </div>
  );
}
