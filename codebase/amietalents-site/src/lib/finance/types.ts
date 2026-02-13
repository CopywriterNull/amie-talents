// Finance Module Types

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'brand_payment'
  | 'creator_payout'
  | 'operating_expense'
  | 'refund'
  | 'uncategorized';

export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'pending_payment'
  | 'paid';

export type MatchConfidence = 'high' | 'medium' | 'low' | 'none';

export interface CreatorPaymentInfo {
  creatorId: string;
  creatorName: string;
  paymentMethod: 'zelle' | 'wire' | 'ach' | 'check';
  paymentHandle?: string; // Zelle email/phone, or bank details reference
  notes?: string;
}

export interface CampaignPayout {
  creatorId: string;
  creatorName: string;
  amount: number;
  status: 'pending' | 'paid';
  paidDate?: string;
  transactionId?: string;
}

export interface Campaign {
  id: string;
  brandName: string;
  campaignName: string;
  description?: string;
  totalBudget: number;
  agencyFee: number;
  agencyFeeType: 'percentage' | 'flat';
  creatorPayouts: CampaignPayout[];
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  expectedPaymentDate?: string;
  paymentTerms?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  rawDescription: string;
  amount: number;
  type: TransactionType;
  balance?: number;
  checkNumber?: string;

  // Categorization
  category: TransactionCategory;

  // Matching
  matchedCampaignId?: string;
  matchedCreatorId?: string;
  matchConfidence: number; // 0-100
  matchConfidenceLevel: MatchConfidence;
  matchedBy: 'auto' | 'manual' | 'rule';
  matchReason?: string;

  // Meta
  importedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface MatchingRule {
  id: string;
  name: string;
  pattern: string;
  isRegex: boolean;
  matchType: 'brand' | 'creator' | 'expense';
  matchesEntityId?: string;
  matchesEntityName?: string;
  category: TransactionCategory;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export interface ImportSession {
  id: string;
  filename: string;
  importedAt: string;
  transactionCount: number;
  matchedCount: number;
  unmatchedCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

// Dashboard Stats
export interface FinanceDashboardStats {
  // Cash Flow
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;

  // Period comparison
  incomeChange: number; // percentage
  expenseChange: number;

  // Breakdown
  brandPaymentsTotal: number;
  creatorPayoutsTotal: number;
  operatingExpensesTotal: number;

  // Status
  pendingReceivables: number;
  pendingPayables: number;

  // Matching
  unmatchedTransactions: number;
  recentTransactions: Transaction[];
}

export interface CampaignPnL {
  campaignId: string;
  brandName: string;
  campaignName: string;
  revenue: number;
  creatorCosts: number;
  agencyFee: number;
  netProfit: number;
  margin: number;
  status: CampaignStatus;
}

export interface CreatorEarnings {
  creatorId: string;
  creatorName: string;
  totalEarnings: number;
  paidAmount: number;
  pendingAmount: number;
  campaigns: {
    campaignId: string;
    campaignName: string;
    amount: number;
    status: 'pending' | 'paid';
  }[];
}

// Chase CSV Format
export interface ChaseCSVRow {
  Details: string; // CREDIT or DEBIT
  'Posting Date': string;
  Description: string;
  Amount: string;
  Type: string;
  Balance: string;
  'Check or Slip #': string;
}
