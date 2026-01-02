export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 w-20 bg-[#e5e5e5] rounded" />
        <div className="h-4 w-48 bg-[#f5f5f5] rounded mt-1" />
      </div>

      {/* Klaviyo connection card skeleton */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#f5f5f5]" />
          <div>
            <div className="h-5 w-36 bg-[#e5e5e5] rounded" />
            <div className="h-3 w-24 bg-[#f5f5f5] rounded mt-1" />
          </div>
        </div>
        <div className="h-10 w-full bg-[#f5f5f5] rounded-lg" />
      </div>

      {/* Web feed card skeleton */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#f5f5f5]" />
          <div>
            <div className="h-5 w-24 bg-[#e5e5e5] rounded" />
            <div className="h-3 w-32 bg-[#f5f5f5] rounded mt-1" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-[#f5f5f5] rounded" />
          <div className="h-4 w-3/4 bg-[#f5f5f5] rounded" />
        </div>
      </div>

      {/* Account card skeleton */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
        <div className="h-5 w-20 bg-[#e5e5e5] rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-48 bg-[#f5f5f5] rounded" />
          <div className="h-9 w-24 bg-[#f5f5f5] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
