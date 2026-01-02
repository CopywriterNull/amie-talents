export default function ProcessLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-40 bg-[#e5e5e5] rounded" />
          <div className="h-4 w-48 bg-[#f5f5f5] rounded mt-1" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-[#f5f5f5] rounded-lg" />
          <div className="h-9 w-9 bg-[#f5f5f5] rounded-lg" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="h-10 w-full max-w-sm bg-[#f5f5f5] rounded-lg" />

      {/* Template grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
            <div className="aspect-[4/3] bg-[#f5f5f5]" />
            <div className="p-3">
              <div className="h-4 w-3/4 bg-[#e5e5e5] rounded" />
              <div className="h-3 w-1/2 bg-[#f5f5f5] rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
