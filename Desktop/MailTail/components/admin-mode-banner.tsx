"use client";

import { usePathname } from "next/navigation";

export function AdminModeBanner() {
  const pathname = usePathname();

  // Only show on admin pages
  const isAdminPage = pathname.startsWith("/dashboard/admin");
  if (!isAdminPage) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600">
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          animation: "shimmer 3s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center py-1.5">
        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white">
          Admin Mode
        </span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
