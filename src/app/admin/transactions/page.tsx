"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  Filter,
} from "lucide-react";
import {
  Transaction,
  TransactionCategory,
  parseChaseCSV,
  getTransactions,
  saveTransactions,
  updateTransaction,
  getCampaigns,
  getMatchingRules,
  getCreatorPaymentInfo,
  matchAllTransactions,
  formatCurrency,
  formatDate,
  generateId,
  saveImportSession,
} from "@/lib/finance";
import { talents } from "@/lib/talents";
import { cn } from "@/lib/utils";

const categoryOptions: { value: TransactionCategory; label: string }[] = [
  { value: "brand_payment", label: "Brand Payment" },
  { value: "creator_payout", label: "Creator Payout" },
  { value: "operating_expense", label: "Operating Expense" },
  { value: "refund", label: "Refund" },
  { value: "uncategorized", label: "Uncategorized" },
];

const categoryColors: Record<TransactionCategory, string> = {
  brand_payment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  creator_payout: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  operating_expense: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  refund: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  uncategorized: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
      <TransactionsContent />
    </Suspense>
  );
}

function TransactionsContent() {
  const searchParams = useSearchParams();
  const showImport = searchParams.get("import") === "true";
  const filterParam = searchParams.get("filter");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(filterParam || "all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Import state
  const [showImportDialog, setShowImportDialog] = useState(showImport);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    total: number;
    matched: number;
    new: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [editCategory, setEditCategory] = useState<TransactionCategory>("uncategorized");
  const [editCreatorId, setEditCreatorId] = useState<string>("");
  const [editCampaignId, setEditCampaignId] = useState<string>("");
  const [editNotes, setEditNotes] = useState("");

  const loadTransactions = useCallback(() => {
    const data = getTransactions();
    // Sort by date descending
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      searchQuery === "" ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.rawDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || txn.category === categoryFilter;

    const matchesType = typeFilter === "all" || txn.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportResult(null);

    try {
      const text = await file.text();
      const parsed = parseChaseCSV(text);

      if (parsed.length === 0) {
        throw new Error("No transactions found in file");
      }

      // Get existing transactions count
      const existingCount = getTransactions().length;

      // Run matching
      const campaigns = getCampaigns();
      const rules = getMatchingRules();
      const creatorPaymentInfo = getCreatorPaymentInfo();
      const matched = matchAllTransactions(parsed, campaigns, rules, creatorPaymentInfo);

      // Save transactions
      saveTransactions(matched);

      // Calculate results
      const newCount = getTransactions().length - existingCount;
      const matchedCount = matched.filter(
        (t) => t.category !== "uncategorized"
      ).length;

      // Save import session
      const dates = matched.map((t) => new Date(t.date).getTime());
      saveImportSession({
        id: generateId("import"),
        filename: file.name,
        importedAt: new Date().toISOString(),
        transactionCount: parsed.length,
        matchedCount,
        unmatchedCount: parsed.length - matchedCount,
        dateRange: {
          start: new Date(Math.min(...dates)).toISOString(),
          end: new Date(Math.max(...dates)).toISOString(),
        },
      });

      setImportResult({
        total: parsed.length,
        matched: matchedCount,
        new: newCount,
      });

      // Reload transactions
      loadTransactions();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import file");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle edit transaction
  const handleEditTxn = (txn: Transaction) => {
    setEditingTxn(txn);
    setEditCategory(txn.category);
    setEditCreatorId(txn.matchedCreatorId || "");
    setEditCampaignId(txn.matchedCampaignId || "");
    setEditNotes(txn.notes || "");
  };

  const handleSaveEdit = () => {
    if (!editingTxn) return;

    const updated = updateTransaction(editingTxn.id, {
      category: editCategory,
      matchedCreatorId: editCreatorId || undefined,
      matchedCampaignId: editCampaignId || undefined,
      notes: editNotes || undefined,
      matchedBy: "manual",
      matchConfidence: 100,
      matchConfidenceLevel: "high",
      verifiedAt: new Date().toISOString(),
    });

    if (updated) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    }

    setEditingTxn(null);
  };

  const campaigns = getCampaigns();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            {transactions.length} total transactions
          </p>
        </div>
        <Button onClick={() => setShowImportDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Income</SelectItem>
                <SelectItem value="debit">Expense</SelectItem>
              </SelectContent>
            </Select>

            {(categoryFilter !== "all" || typeFilter !== "all" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter("all");
                  setTypeFilter("all");
                  setSearchQuery("");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              {transactions.length === 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowImportDialog(true)}
                >
                  Import your first CSV
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[140px]">Category</TableHead>
                  <TableHead className="w-[100px]">Confidence</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            txn.type === "credit"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          )}
                        >
                          {txn.type === "credit" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-[300px]">
                            {txn.description}
                          </p>
                          {txn.matchReason && (
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                              {txn.matchReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-normal", categoryColors[txn.category])}>
                        {txn.category.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {txn.matchedBy === "manual" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : txn.matchConfidence >= 80 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : txn.matchConfidence >= 50 ? (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {txn.matchedBy === "manual" ? "Verified" : `${txn.matchConfidence}%`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        txn.type === "credit" ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {txn.type === "credit" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTxn(txn)}>
                            Edit Category
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

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Chase CSV</DialogTitle>
            <DialogDescription>
              Upload your Chase bank statement export to import transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!importResult && (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  importing
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={importing}
                />

                {importing ? (
                  <div className="space-y-2">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-muted-foreground">Processing...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload CSV</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Chase bank statement export (CSV format)
                    </p>
                  </>
                )}
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{importError}</p>
              </div>
            )}

            {importResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <p className="text-sm">Import successful!</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">{importResult.total}</p>
                    <p className="text-xs text-muted-foreground">Total Parsed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-green-600">{importResult.new}</p>
                    <p className="text-xs text-muted-foreground">New Added</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-blue-600">{importResult.matched}</p>
                    <p className="text-xs text-muted-foreground">Auto-Matched</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {importResult ? (
              <Button onClick={() => {
                setShowImportDialog(false);
                setImportResult(null);
              }}>
                Done
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editingTxn} onOpenChange={() => setEditingTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Categorize this transaction and link it to a campaign or creator.
            </DialogDescription>
          </DialogHeader>

          {editingTxn && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">{editingTxn.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(editingTxn.date)} &bull;{" "}
                  <span className={editingTxn.type === "credit" ? "text-green-600" : "text-red-600"}>
                    {editingTxn.type === "credit" ? "+" : "-"}{formatCurrency(editingTxn.amount)}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={editCategory} onValueChange={(v) => setEditCategory(v as TransactionCategory)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {editCategory === "creator_payout" && (
                  <div>
                    <label className="text-sm font-medium">Creator</label>
                    <Select value={editCreatorId} onValueChange={setEditCreatorId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select creator..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {talents.map((talent) => (
                          <SelectItem key={talent.id} value={talent.id}>
                            {talent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {editCategory === "brand_payment" && campaigns.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Campaign</label>
                    <Select value={editCampaignId} onValueChange={setEditCampaignId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select campaign..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.brandName} - {campaign.campaignName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Optional notes..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTxn(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
