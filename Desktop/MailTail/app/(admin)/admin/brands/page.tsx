import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface BrandWithDetails {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  owner: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  subscription: {
    status: string;
    trial_type: string | null;
    trial_ends_at: string | null;
    trial_template_limit: number | null;
    trial_templates_used: number;
  } | null;
  members_count: number;
  templates_count: number;
  klaviyo_connected: boolean;
}

async function getBrands(searchParams: { status?: string; search?: string }): Promise<BrandWithDetails[]> {
  const supabase = await createClient();

  // Get all teams
  let query = supabase
    .from("teams")
    .select("id, name, created_at, owner_id")
    .order("created_at", { ascending: false });

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  const { data: teams, error } = await query;

  if (error || !teams) {
    console.error("Error fetching teams:", error);
    return [];
  }

  if (teams.length === 0) {
    return [];
  }

  // Get subscriptions, member counts, template counts, and owner profiles
  const teamIds = teams.map((t) => t.id);
  const ownerIds = teams.map((t) => t.owner_id).filter(Boolean);

  const [subscriptionsResult, membersResult, templatesResult, klaviyoResult, ownersResult] = await Promise.all([
    supabase.from("team_subscriptions").select("*").in("team_id", teamIds),
    supabase.from("team_members").select("team_id").in("team_id", teamIds),
    supabase.from("processed_templates").select("team_id").in("team_id", teamIds),
    supabase.from("klaviyo_connections").select("team_id").in("team_id", teamIds),
    ownerIds.length > 0
      ? supabase.from("profiles").select("id, email, first_name, last_name").in("id", ownerIds)
      : Promise.resolve({ data: [] }),
  ]);

  const subscriptionsByTeam = new Map(
    (subscriptionsResult.data || []).map((s) => [s.team_id, s])
  );

  const memberCountsByTeam = new Map<string, number>();
  (membersResult.data || []).forEach((m) => {
    memberCountsByTeam.set(m.team_id, (memberCountsByTeam.get(m.team_id) || 0) + 1);
  });

  const templateCountsByTeam = new Map<string, number>();
  (templatesResult.data || []).forEach((t) => {
    templateCountsByTeam.set(t.team_id, (templateCountsByTeam.get(t.team_id) || 0) + 1);
  });

  const klaviyoByTeam = new Set((klaviyoResult.data || []).map((k) => k.team_id));

  const ownersById = new Map(
    (ownersResult.data || []).map((o) => [o.id, { email: o.email, first_name: o.first_name, last_name: o.last_name }])
  );

  const brands: BrandWithDetails[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
    created_at: team.created_at,
    owner_id: team.owner_id,
    owner: team.owner_id ? ownersById.get(team.owner_id) || null : null,
    subscription: subscriptionsByTeam.get(team.id) || null,
    members_count: memberCountsByTeam.get(team.id) || 0,
    templates_count: templateCountsByTeam.get(team.id) || 0,
    klaviyo_connected: klaviyoByTeam.has(team.id),
  }));

  // Filter by status if provided
  if (searchParams.status) {
    return brands.filter((b) => {
      if (!b.subscription) return searchParams.status === "none";
      return b.subscription.status === searchParams.status;
    });
  }

  return brands;
}

function getStatusBadge(subscription: BrandWithDetails["subscription"]) {
  if (!subscription) {
    return <Badge variant="outline" className="text-gray-500 border-gray-300">No Plan</Badge>;
  }

  switch (subscription.status) {
    case "trial":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Trial</Badge>;
    case "active":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    case "expired":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
    case "suspended":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Suspended</Badge>;
    default:
      return <Badge variant="outline">{subscription.status}</Badge>;
  }
}

function getTrialInfo(subscription: BrandWithDetails["subscription"]) {
  if (!subscription || subscription.status !== "trial") return null;

  if (subscription.trial_type === "usage") {
    const remaining = (subscription.trial_template_limit || 0) - subscription.trial_templates_used;
    return (
      <span className="text-xs text-muted-foreground">
        {remaining} / {subscription.trial_template_limit} templates left
      </span>
    );
  }

  if (subscription.trial_type === "time" && subscription.trial_ends_at) {
    const daysLeft = Math.ceil(
      (new Date(subscription.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return (
      <span className="text-xs text-muted-foreground">
        {daysLeft > 0 ? `${daysLeft} days left` : "Expiring soon"}
      </span>
    );
  }

  return null;
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const brands = await getBrands(params);

  const statusFilters = [
    { value: "", label: "All" },
    { value: "trial", label: "Trial" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "suspended", label: "Suspended" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717]">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all registered brands and their subscriptions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form className="flex-1">
              <Input
                name="search"
                placeholder="Search brands..."
                defaultValue={params.search || ""}
                className="max-w-sm"
              />
            </form>

            {/* Status Filter */}
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={`/admin/brands${filter.value ? `?status=${filter.value}` : ""}`}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    (params.status || "") === filter.value
                      ? "bg-[#171717] text-white"
                      : "bg-[#f5f5f5] text-[#525252] hover:bg-[#e5e5e5]"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brands List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {brands.length} Brand{brands.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No brands found
            </p>
          ) : (
            <div className="divide-y">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/admin/brands/${brand.id}`}
                  className="flex items-center justify-between py-4 hover:bg-[#fafafa] -mx-4 px-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center text-white text-sm font-semibold">
                      {brand.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#171717]">{brand.name}</p>
                        {getStatusBadge(brand.subscription)}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-muted-foreground">
                          {brand.owner?.email || "No owner"}
                        </p>
                        {getTrialInfo(brand.subscription)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-[#171717]">{brand.members_count}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-[#171717]">{brand.templates_count}</p>
                      <p className="text-xs text-muted-foreground">Templates</p>
                    </div>
                    <div className="text-center w-16">
                      {brand.klaviyo_connected ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 text-[10px]">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
