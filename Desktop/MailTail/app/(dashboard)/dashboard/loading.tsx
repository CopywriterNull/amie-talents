export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-28 bg-[#e5e5e5] rounded" />
          <div className="h-4 w-20 bg-[#f5f5f5] rounded mt-1" />
        </div>
        <div className="h-9 w-24 bg-[#e5e5e5] rounded-lg" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e5e5] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-16 bg-[#f5f5f5] rounded" />
                <div className="h-7 w-12 bg-[#e5e5e5] rounded mt-2" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f5f5f5]" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity skeleton */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e5e5]">
          <div className="h-4 w-28 bg-[#e5e5e5] rounded" />
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f5]" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-[#e5e5e5] rounded" />
                <div className="h-3 w-16 bg-[#f5f5f5] rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5f5f5]" />
              <div>
                <div className="h-4 w-28 bg-[#e5e5e5] rounded" />
                <div className="h-3 w-20 bg-[#f5f5f5] rounded mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
