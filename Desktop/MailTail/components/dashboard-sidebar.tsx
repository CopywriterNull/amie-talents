"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LayoutDashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboardIcon },
  { href: "/dashboard/process", label: "Process", icon: ZapIcon },
  { href: "/dashboard/history", label: "History", icon: ClockIcon },
  { href: "/dashboard/team", label: "Team", icon: UsersIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

interface UserProfile {
  email: string;
  firstName: string | null;
  lastName: string | null;
  brandName: string | null;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
    // Dispatch event for layout to listen
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: collapsed }));
  }, [collapsed]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, brand_name")
          .eq("id", authUser.id)
          .single();

        setUser({
          email: authUser.email || "",
          firstName: profile?.first_name || null,
          lastName: profile?.last_name || null,
          brandName: profile?.brand_name || null,
        });

        // Check if user is an admin
        const { data: adminRecord } = await supabase
          .from("admins")
          .select("role")
          .eq("user_id", authUser.id)
          .single();

        setIsAdmin(!!adminRecord);
      }
    }
    fetchUser();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = user
    ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "") || user.email[0]?.toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-white border-r border-[#e5e5e5] flex flex-col z-40 transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[200px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-14 flex items-center border-b border-[#e5e5e5]",
        collapsed ? "justify-center px-0" : "px-4"
      )}>
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center shadow-sm flex-shrink-0">
            <MailIcon className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-[#171717]">MailTail</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-150",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[#171717] text-white"
                    : "text-[#525252] hover:text-[#171717] hover:bg-[#f5f5f5]"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-white" : "text-[#737373]")} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin Link - only shown to admins */}
        {isAdmin && (
          <>
            <div className={cn("my-3 border-t border-[#e5e5e5]", collapsed && "mx-2")} />
            <Link
              href="/admin"
              title={collapsed ? "Admin Panel" : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-150",
                collapsed && "justify-center px-0",
                "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              )}
            >
              <ShieldIcon className="w-[18px] h-[18px] flex-shrink-0 text-amber-500" />
              {!collapsed && "Admin Panel"}
            </Link>
          </>
        )}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#e5e5e5] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f5f5f5] transition-colors"
      >
        {collapsed ? (
          <ChevronRightIcon className="w-3.5 h-3.5 text-[#737373]" />
        ) : (
          <ChevronLeftIcon className="w-3.5 h-3.5 text-[#737373]" />
        )}
      </button>

      {/* User Menu */}
      <div className="p-2 border-t border-[#e5e5e5]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded-lg hover:bg-[#f5f5f5] transition-colors",
                collapsed && "justify-center"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-medium text-[#171717] truncate">
                    {user?.firstName || user?.email?.split("@")[0] || "User"}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={collapsed ? "center" : "start"} side="top" className="w-48 mb-1">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer text-xs">
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild className="cursor-pointer text-xs text-amber-600">
                <Link href="/admin">
                  <ShieldIcon className="w-3.5 h-3.5 mr-2" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-xs text-[#dc2626] focus:text-[#dc2626]">
              <LogOutIcon className="w-3.5 h-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
