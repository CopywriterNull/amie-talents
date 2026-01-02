"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

interface AdminManagementProps {
  admins: AdminWithProfile[];
  currentUserId: string | null;
}

export function AdminManagement({ admins, currentUserId }: AdminManagementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add admin dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");

  async function handleAddAdmin() {
    if (!newAdminEmail.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newAdminEmail.trim().toLowerCase(),
          role: newAdminRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess(`${newAdminEmail} has been added as ${newAdminRole === "super_admin" ? "super admin" : "admin"}`);
      setNewAdminEmail("");
      setNewAdminRole("admin");
      setAddDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveAdmin(adminId: string, adminEmail: string) {
    if (!confirm(`Are you sure you want to remove ${adminEmail} as admin?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/admins?id=${adminId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess(`${adminEmail} has been removed as admin`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    } finally {
      setLoading(false);
    }
  }

  function getRoleBadge(role: string) {
    if (role === "super_admin") {
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          Super Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        Admin
      </Badge>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {success}
        </div>
      )}

      {/* Admin List */}
      <div className="space-y-2">
        {admins.map((admin) => {
          const isCurrentUser = admin.user_id === currentUserId;
          const displayName = admin.profile?.first_name
            ? `${admin.profile.first_name} ${admin.profile.last_name || ""}`
            : admin.profile?.email || "Unknown";

          return (
            <div
              key={admin.id}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#fafafa]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center text-white text-sm font-semibold">
                  {admin.profile?.first_name?.[0]?.toUpperCase() ||
                    admin.profile?.email?.[0]?.toUpperCase() ||
                    "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#171717]">
                      {displayName}
                      {isCurrentUser && (
                        <span className="text-muted-foreground ml-1">(you)</span>
                      )}
                    </p>
                    {getRoleBadge(admin.role)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {admin.profile?.email}
                  </p>
                </div>
              </div>

              {!isCurrentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleRemoveAdmin(admin.id, admin.profile?.email || "this admin")
                  }
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Admin Button */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            Add Administrator
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Administrator</DialogTitle>
            <DialogDescription>
              Add a new administrator by their email address. They must already have an account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newAdminRole}
                onValueChange={(v) => setNewAdminRole(v as "admin" | "super_admin")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Super admins can manage other administrators.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={loading}>
              {loading ? "Adding..." : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
