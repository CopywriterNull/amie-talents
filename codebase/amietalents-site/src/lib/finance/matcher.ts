// Transaction Matching Engine
import {
  Transaction,
  Campaign,
  MatchingRule,
  TransactionCategory,
  MatchConfidence,
  CreatorPaymentInfo,
} from './types';
import { extractIdentifiers } from './parser';
import { talents } from '../talents';

interface MatchResult {
  confidence: number;
  confidenceLevel: MatchConfidence;
  category: TransactionCategory;
  matchedCampaignId?: string;
  matchedCreatorId?: string;
  matchReason: string;
}

// Fuzzy string matching (Levenshtein-based similarity)
function similarity(a: string, b: string): number {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();

  if (aLower === bLower) return 1;
  if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.8;

  // Simple word overlap
  const aWords = new Set(aLower.split(/\s+/));
  const bWords = new Set(bLower.split(/\s+/));
  const intersection = [...aWords].filter((w) => bWords.has(w));

  if (intersection.length === 0) return 0;
  return intersection.length / Math.max(aWords.size, bWords.size);
}

// Match transaction against rules
function matchAgainstRules(
  transaction: Transaction,
  rules: MatchingRule[]
): MatchResult | null {
  const activeRules = rules
    .filter((r) => r.isActive)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of activeRules) {
    const matches = rule.isRegex
      ? new RegExp(rule.pattern, 'i').test(transaction.rawDescription)
      : transaction.rawDescription.toUpperCase().includes(rule.pattern.toUpperCase());

    if (matches) {
      return {
        confidence: 60,
        confidenceLevel: 'medium',
        category: rule.category,
        matchedCampaignId: rule.matchesEntityId,
        matchedCreatorId:
          rule.matchType === 'creator' ? rule.matchesEntityId : undefined,
        matchReason: `Matched rule: ${rule.name}`,
      };
    }
  }

  return null;
}

// Match against known creators
function matchAgainstCreators(
  transaction: Transaction,
  creatorPaymentInfo: CreatorPaymentInfo[]
): MatchResult | null {
  if (transaction.type !== 'debit') return null;

  const { possibleNames } = extractIdentifiers(transaction.rawDescription);
  const descUpper = transaction.rawDescription.toUpperCase();

  // Check against creator payment handles
  for (const info of creatorPaymentInfo) {
    if (info.paymentHandle) {
      const handleMatch =
        descUpper.includes(info.paymentHandle.toUpperCase()) ||
        descUpper.includes(info.creatorName.toUpperCase());

      if (handleMatch) {
        return {
          confidence: 90,
          confidenceLevel: 'high',
          category: 'creator_payout',
          matchedCreatorId: info.creatorId,
          matchReason: `Matched creator payment handle: ${info.creatorName}`,
        };
      }
    }
  }

  // Check against talent roster names
  for (const talent of talents) {
    const nameMatch = possibleNames.some(
      (name) => similarity(name, talent.name) > 0.7
    );

    if (nameMatch) {
      return {
        confidence: 75,
        confidenceLevel: 'medium',
        category: 'creator_payout',
        matchedCreatorId: talent.id,
        matchReason: `Possible match to creator: ${talent.name}`,
      };
    }
  }

  return null;
}

// Match against campaigns (brand payments)
function matchAgainstCampaigns(
  transaction: Transaction,
  campaigns: Campaign[]
): MatchResult | null {
  if (transaction.type !== 'credit') return null;

  const { possibleCompanies } = extractIdentifiers(transaction.rawDescription);
  const descUpper = transaction.rawDescription.toUpperCase();

  for (const campaign of campaigns) {
    const brandNameMatch =
      descUpper.includes(campaign.brandName.toUpperCase()) ||
      possibleCompanies.some(
        (company) => similarity(company, campaign.brandName) > 0.6
      );

    if (brandNameMatch) {
      // Boost confidence if amount matches expected
      const expectedAmount = campaign.totalBudget;
      const amountMatch = Math.abs(transaction.amount - expectedAmount) < 1;

      return {
        confidence: amountMatch ? 95 : 70,
        confidenceLevel: amountMatch ? 'high' : 'medium',
        category: 'brand_payment',
        matchedCampaignId: campaign.id,
        matchReason: `Matched brand: ${campaign.brandName}${amountMatch ? ' (amount matches)' : ''}`,
      };
    }
  }

  return null;
}

// Main matching function
export function matchTransaction(
  transaction: Transaction,
  campaigns: Campaign[],
  rules: MatchingRule[],
  creatorPaymentInfo: CreatorPaymentInfo[]
): Transaction {
  // Skip if already manually verified
  if (transaction.matchedBy === 'manual' && transaction.verifiedAt) {
    return transaction;
  }

  let bestMatch: MatchResult | null = null;

  // Try matching in order of specificity
  // 1. Known creator payment handles (highest priority for debits)
  if (!bestMatch && transaction.type === 'debit') {
    bestMatch = matchAgainstCreators(transaction, creatorPaymentInfo);
  }

  // 2. Campaign brand names (for credits)
  if (!bestMatch && transaction.type === 'credit') {
    bestMatch = matchAgainstCampaigns(transaction, campaigns);
  }

  // 3. Matching rules
  if (!bestMatch) {
    bestMatch = matchAgainstRules(transaction, rules);
  }

  // 4. Heuristic categorization
  if (!bestMatch) {
    bestMatch = heuristicCategorize(transaction);
  }

  // Apply match result
  return {
    ...transaction,
    category: bestMatch?.category || 'uncategorized',
    matchConfidence: bestMatch?.confidence || 0,
    matchConfidenceLevel: bestMatch?.confidenceLevel || 'none',
    matchedCampaignId: bestMatch?.matchedCampaignId,
    matchedCreatorId: bestMatch?.matchedCreatorId,
    matchReason: bestMatch?.matchReason,
    matchedBy: 'auto',
  };
}

// Heuristic categorization based on description patterns
function heuristicCategorize(transaction: Transaction): MatchResult | null {
  const desc = transaction.rawDescription.toUpperCase();

  // Common expense patterns
  const expensePatterns = [
    'ADOBE',
    'GOOGLE',
    'AMAZON',
    'AWS',
    'OFFICE',
    'SOFTWARE',
    'SUBSCRIPTION',
    'INTERNET',
    'PHONE',
    'UTILITY',
    'RENT',
    'INSURANCE',
  ];

  if (transaction.type === 'debit') {
    for (const pattern of expensePatterns) {
      if (desc.includes(pattern)) {
        return {
          confidence: 50,
          confidenceLevel: 'low',
          category: 'operating_expense',
          matchReason: `Likely operating expense: ${pattern}`,
        };
      }
    }

    // Zelle/Wire out likely creator payment
    if (desc.includes('ZELLE') || desc.includes('WIRE')) {
      return {
        confidence: 40,
        confidenceLevel: 'low',
        category: 'creator_payout',
        matchReason: 'Outgoing payment (Zelle/Wire)',
      };
    }
  }

  if (transaction.type === 'credit') {
    // ACH/Wire in likely brand payment
    if (desc.includes('ACH CREDIT') || desc.includes('WIRE')) {
      return {
        confidence: 40,
        confidenceLevel: 'low',
        category: 'brand_payment',
        matchReason: 'Incoming payment (ACH/Wire)',
      };
    }
  }

  return null;
}

// Batch match all transactions
export function matchAllTransactions(
  transactions: Transaction[],
  campaigns: Campaign[],
  rules: MatchingRule[],
  creatorPaymentInfo: CreatorPaymentInfo[]
): Transaction[] {
  return transactions.map((t) =>
    matchTransaction(t, campaigns, rules, creatorPaymentInfo)
  );
}

// Get confidence level from score
export function getConfidenceLevel(score: number): MatchConfidence {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  if (score > 0) return 'low';
  return 'none';
}
