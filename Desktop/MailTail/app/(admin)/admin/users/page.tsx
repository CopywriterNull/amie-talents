import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface UserWithTeam {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  brand_name: string | null;
  created_at: string;
  team_membership: {
    team_id: string;
    team_name: string;
    role: string;
  } | null;
}

async function getUsers(search?: string): Promise<UserWithTeam[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, email, first_name, last_name, brand_name, created_at")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  const { data: profiles, error } = await query.limit(100);

  if (error || !profiles) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  if (profiles.length === 0) {
    return [];
  }

  // Get team memberships for all users (without FK relationship)
  const userIds = profiles.map((p) => p.id);
  const { data: memberships } = await supabase
    .from("team_members")
    .select("user_id, team_id, role")
    .in("user_id", userIds);

  // Get unique team IDs and fetch team details
  const teamIds = [...new Set((memberships || []).map((m) => m.team_id).filter(Boolean))] as string[];

  let teamsById = new Map<string, { id: string; name: string }>();
  if (teamIds.length > 0) {
    const { data: teams } = await supabase
      .from("teams")
      .select("id, name")
      .in("id", teamIds);

    teamsById = new Map(
      (teams || []).map((t) => [t.id, { id: t.id, name: t.name }])
    );
  }

  const membershipByUser = new Map(
    (memberships || []).map((m) => {
      const team = m.team_id ? teamsById.get(m.team_id) : null;
      return [
        m.user_id,
        team ? {
          team_id: team.id,
          team_name: team.name,
          role: m.role,
        } : null,
      ];
    })
  );

  return profiles.map((profile) => ({
    ...profile,
    team_membership: membershipByUser.get(profile.id) || null,
  }));
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const users = await getUsers(params.search);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All registered users across all brands
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form>
            <Input
              name="search"
              placeholder="Search by email or name..."
              defaultValue={params.search || ""}
              className="max-w-sm"
            />
          </form>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {users.length} User{users.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No users found
            </p>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-sm font-semibold">
                      {user.first_name?.[0] || user.email[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#171717]">
                        {user.first_name
                          ? `${user.first_name} ${user.last_name || ""}`
                          : user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {user.team_membership ? (
                      <Link
                        href={`/admin/brands/${user.team_membership.team_id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span className="text-sm">{user.team_membership.team_name}</span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {user.team_membership.role}
                        </Badge>
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">No team</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
