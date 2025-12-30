"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SubscriptionBanner } from "@/components/subscription-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Check initial state
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);

    // Listen for toggle events
    function handleToggle(e: CustomEvent) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle as EventListener);
    return () => window.removeEventListener("sidebar-toggle", handleToggle as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <DashboardSidebar />
      <main
        className="transition-all duration-200"
        style={{ paddingLeft: collapsed ? 60 : 200 }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <SubscriptionBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
