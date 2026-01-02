import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminManagement } from "./admin-management";
import { BootstrapButton } from "./bootstrap-button";

interface AdminWithProfile {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

// Designated first admin email
const FIRST_ADMIN_EMAIL = "lennyhuynh526@gmail.com";

async function getAdminsAndCurrentUser(): Promise<{
  admins: AdminWithProfile[];
  currentUserId: string | null;
  isSuperAdmin: boolean;
  canBootstrap: boolean;
}> {
  // Use regular client to get current user (needs cookies)
  const authClient = await createClient();
  // Use service client to query admins table (bypasses RLS)
  const supabase = createServiceClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return { admins: [], currentUserId: null, isSuperAdmin: false, canBootstrap: false };
  }

  // Check if current user is super_admin
  const { data: currentAdmin } = await supabase
    .from("admins")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // Allow bootstrap for designated admin email if they're not already super_admin
  const isDesignatedAdmin = user.email?.toLowerCase() === FIRST_ADMIN_EMAIL.toLowerCase();
  const canBootstrap = isDesignatedAdmin && (!currentAdmin || currentAdmin.role !== "super_admin");

  if (!currentAdmin || currentAdmin.role !== "super_admin") {
    return { admins: [], currentUserId: user.id, isSuperAdmin: false, canBootstrap };
  }

  // Get all admins
  const { data: admins } = await supabase
    .from("admins")
    .select("id, user_id, role, created_at")
    .order("created_at", { ascending: true });

  if (!admins || admins.length === 0) {
    return { admins: [], currentUserId: user.id, isSuperAdmin: true };
  }

  // Get profile info for each admin
  const userIds = admins.map((a) => a.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name")
    .in("id", userIds);

  const profilesById = new Map((profiles || []).map((p) => [p.id, p]));

  const adminsWithProfiles: AdminWithProfile[] = admins.map((admin) => ({
    ...admin,
    profile: profilesById.get(admin.user_id) || null,
  }));

  return { admins: adminsWithProfiles, currentUserId: user.id, isSuperAdmin: true, canBootstrap: false };
}

export default async function AdminSettingsPage() {
  const { admins, currentUserId, isSuperAdmin, canBootstrap } = await getAdminsAndCurrentUser();

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#171717]">Admin Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage admin access and permissions
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                You need super admin access to manage administrators.
              </p>
              <BootstrapButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage admin access and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Administrators</CardTitle>
          <CardDescription>
            Manage who has admin access to the dashboard. Super admins can add and remove other admins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminManagement admins={admins} currentUserId={currentUserId} />
        </CardContent>
      </Card>
    </div>
  );
}
