"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  Trash2,
} from "lucide-react";
import {
  Campaign,
  CampaignStatus,
  CampaignPayout,
  getCampaigns,
  saveCampaign,
  deleteCampaign,
  formatCurrency,
  formatDate,
  generateId,
} from "@/lib/finance";
import { talents } from "@/lib/talents";
import { cn } from "@/lib/utils";

const statusColors: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending_payment: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  paid: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const statusLabels: Record<CampaignStatus, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  pending_payment: "Pending Payment",
  paid: "Paid",
};

const initialFormState = {
  brandName: "",
  campaignName: "",
  description: "",
  totalBudget: "",
  agencyFee: "",
  agencyFeeType: "percentage" as "percentage" | "flat",
  status: "draft" as CampaignStatus,
  startDate: "",
  endDate: "",
  expectedPaymentDate: "",
  paymentTerms: "",
  invoiceNumber: "",
  notes: "",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [creatorPayouts, setCreatorPayouts] = useState<CampaignPayout[]>([]);

  const loadCampaigns = () => {
    const data = getCampaigns();
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleOpenCreate = () => {
    setForm(initialFormState);
    setCreatorPayouts([]);
    setEditingCampaign(null);
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setForm({
      brandName: campaign.brandName,
      campaignName: campaign.campaignName,
      description: campaign.description || "",
      totalBudget: campaign.totalBudget.toString(),
      agencyFee: campaign.agencyFee.toString(),
      agencyFeeType: campaign.agencyFeeType,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate || "",
      expectedPaymentDate: campaign.expectedPaymentDate || "",
      paymentTerms: campaign.paymentTerms || "",
      invoiceNumber: campaign.invoiceNumber || "",
      notes: campaign.notes || "",
    });
    setCreatorPayouts(campaign.creatorPayouts || []);
    setEditingCampaign(campaign);
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    const campaign: Campaign = {
      id: editingCampaign?.id || generateId("campaign"),
      brandName: form.brandName,
      campaignName: form.campaignName,
      description: form.description || undefined,
      totalBudget: parseFloat(form.totalBudget) || 0,
      agencyFee: parseFloat(form.agencyFee) || 0,
      agencyFeeType: form.agencyFeeType,
      creatorPayouts,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      expectedPaymentDate: form.expectedPaymentDate || undefined,
      paymentTerms: form.paymentTerms || undefined,
      invoiceNumber: form.invoiceNumber || undefined,
      notes: form.notes || undefined,
      createdAt: editingCampaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCampaign(campaign);
    loadCampaigns();
    setShowCreateDialog(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id);
      loadCampaigns();
    }
  };

  const handleAddCreator = () => {
    setCreatorPayouts([
      ...creatorPayouts,
      {
        creatorId: "",
        creatorName: "",
        amount: 0,
        status: "pending",
      },
    ]);
  };

  const handleUpdateCreatorPayout = (index: number, updates: Partial<CampaignPayout>) => {
    setCreatorPayouts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleRemoveCreatorPayout = (index: number) => {
    setCreatorPayouts((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const budget = parseFloat(form.totalBudget) || 0;
    const feePercent = parseFloat(form.agencyFee) || 0;
    const agencyAmount =
      form.agencyFeeType === "percentage"
        ? budget * (feePercent / 100)
        : feePercent;
    const creatorTotal = creatorPayouts.reduce((sum, p) => sum + p.amount, 0);
    const remaining = budget - agencyAmount - creatorTotal;

    return { budget, agencyAmount, creatorTotal, remaining };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your brand campaigns and creator payouts
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.totalBudget, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === "pending_payment").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No campaigns yet</p>
              <Button variant="outline" className="mt-4" onClick={handleOpenCreate}>
                Create your first campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Creators</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Agency Fee</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.brandName}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.campaignName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-normal", statusColors[campaign.status])}>
                        {statusLabels[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {campaign.creatorPayouts.slice(0, 3).map((payout, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                            title={payout.creatorName}
                          >
                            {payout.creatorName.charAt(0)}
                          </div>
                        ))}
                        {campaign.creatorPayouts.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                            +{campaign.creatorPayouts.length - 3}
                          </div>
                        )}
                        {campaign.creatorPayouts.length === 0 && (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(campaign.totalBudget)}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.agencyFeeType === "percentage"
                        ? `${campaign.agencyFee}%`
                        : formatCurrency(campaign.agencyFee)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(campaign)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Create Campaign"}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? "Update campaign details and creator payouts."
                : "Create a new campaign and assign creators."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g., Nike"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  value={form.campaignName}
                  onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                  placeholder="e.g., Summer 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Campaign details..."
                rows={2}
              />
            </div>

            {/* Budget */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Budget *</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={form.totalBudget}
                  onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyFee">Agency Fee</Label>
                <Input
                  id="agencyFee"
                  type="number"
                  value={form.agencyFee}
                  onChange={(e) => setForm({ ...form, agencyFee: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label>Fee Type</Label>
                <Select
                  value={form.agencyFeeType}
                  onValueChange={(v) =>
                    setForm({ ...form, agencyFeeType: v as "percentage" | "flat" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status & Dates */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as CampaignStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Creator Payouts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Creator Payouts</Label>
                <Button variant="outline" size="sm" onClick={handleAddCreator}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Creator
                </Button>
              </div>

              {creatorPayouts.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                  No creators assigned yet
                </div>
              ) : (
                <div className="space-y-2">
                  {creatorPayouts.map((payout, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <Select
                        value={payout.creatorId}
                        onValueChange={(v) => {
                          const creator = talents.find((t) => t.id === v);
                          handleUpdateCreatorPayout(index, {
                            creatorId: v,
                            creatorName: creator?.name || "",
                          });
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select creator..." />
                        </SelectTrigger>
                        <SelectContent>
                          {talents.map((talent) => (
                            <SelectItem key={talent.id} value={talent.id}>
                              {talent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={payout.amount || ""}
                        onChange={(e) =>
                          handleUpdateCreatorPayout(index, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Amount"
                        className="w-[120px]"
                      />
                      <Select
                        value={payout.status}
                        onValueChange={(v) =>
                          handleUpdateCreatorPayout(index, {
                            status: v as "pending" | "paid",
                          })
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCreatorPayout(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {form.totalBudget && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Budget</span>
                  <span className="font-medium">{formatCurrency(totals.budget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Agency Fee</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(totals.agencyAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Creator Payouts</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(totals.creatorTotal)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-medium">
                  <span>Remaining</span>
                  <span className={totals.remaining < 0 ? "text-red-600" : ""}>
                    {formatCurrency(totals.remaining)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.brandName || !form.campaignName || !form.totalBudget}
            >
              {editingCampaign ? "Save Changes" : "Create Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
