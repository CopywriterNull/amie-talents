import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is an admin
  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // Table might not exist or user not an admin - redirect to dashboard
    console.error("Admin check error:", error.message);
    redirect("/dashboard");
  }

  if (!admin) {
    // Not an admin - redirect to dashboard
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminSidebar adminRole={admin.role} adminEmail={user.email || ""} />
      <main className="ml-[220px] min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
