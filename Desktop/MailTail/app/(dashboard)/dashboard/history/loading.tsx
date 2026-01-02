export default function HistoryLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-20 bg-[#e5e5e5] rounded" />
          <div className="h-4 w-32 bg-[#f5f5f5] rounded mt-1" />
        </div>
        <div className="h-9 w-28 bg-[#e5e5e5] rounded-lg" />
      </div>

      {/* List skeleton */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] divide-y divide-[#e5e5e5] overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f5f5f5]" />
              <div>
                <div className="h-4 w-40 bg-[#e5e5e5] rounded" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-3 w-20 bg-[#f5f5f5] rounded" />
                  <div className="h-3 w-16 bg-[#f5f5f5] rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
