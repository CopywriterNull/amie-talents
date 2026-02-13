// Finance Store - Local Storage based (can migrate to DB later)
// This provides a simple persistence layer for the finance data

import {
  Campaign,
  Transaction,
  MatchingRule,
  ImportSession,
  CreatorPaymentInfo,
} from './types';

const STORAGE_KEYS = {
  campaigns: 'amie_finance_campaigns',
  transactions: 'amie_finance_transactions',
  rules: 'amie_finance_rules',
  imports: 'amie_finance_imports',
  creatorPayments: 'amie_finance_creator_payments',
};

// Helper to safely access localStorage (SSR safe)
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Campaigns
export function getCampaigns(): Campaign[] {
  return getStorage<Campaign[]>(STORAGE_KEYS.campaigns, []);
}

export function getCampaign(id: string): Campaign | undefined {
  return getCampaigns().find((c) => c.id === id);
}

export function saveCampaign(campaign: Campaign): Campaign {
  const campaigns = getCampaigns();
  const existingIndex = campaigns.findIndex((c) => c.id === campaign.id);

  const now = new Date().toISOString();
  const updatedCampaign = {
    ...campaign,
    updatedAt: now,
    createdAt: campaign.createdAt || now,
  };

  if (existingIndex >= 0) {
    campaigns[existingIndex] = updatedCampaign;
  } else {
    campaigns.push(updatedCampaign);
  }

  setStorage(STORAGE_KEYS.campaigns, campaigns);
  return updatedCampaign;
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter((c) => c.id !== id);
  setStorage(STORAGE_KEYS.campaigns, campaigns);
}

// Transactions
export function getTransactions(): Transaction[] {
  return getStorage<Transaction[]>(STORAGE_KEYS.transactions, []);
}

export function getTransaction(id: string): Transaction | undefined {
  return getTransactions().find((t) => t.id === id);
}

export function saveTransaction(transaction: Transaction): Transaction {
  const transactions = getTransactions();
  const existingIndex = transactions.findIndex((t) => t.id === transaction.id);

  if (existingIndex >= 0) {
    transactions[existingIndex] = transaction;
  } else {
    transactions.push(transaction);
  }

  setStorage(STORAGE_KEYS.transactions, transactions);
  return transaction;
}

export function saveTransactions(newTransactions: Transaction[]): void {
  const existing = getTransactions();

  // Dedupe by checking for same date, amount, and description
  const deduped = newTransactions.filter((newTxn) => {
    return !existing.some(
      (existingTxn) =>
        existingTxn.date === newTxn.date &&
        existingTxn.amount === newTxn.amount &&
        existingTxn.rawDescription === newTxn.rawDescription
    );
  });

  const combined = [...existing, ...deduped];
  setStorage(STORAGE_KEYS.transactions, combined);
}

export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | undefined {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index < 0) return undefined;

  transactions[index] = { ...transactions[index], ...updates };
  setStorage(STORAGE_KEYS.transactions, transactions);
  return transactions[index];
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter((t) => t.id !== id);
  setStorage(STORAGE_KEYS.transactions, transactions);
}

// Matching Rules
export function getMatchingRules(): MatchingRule[] {
  return getStorage<MatchingRule[]>(STORAGE_KEYS.rules, getDefaultRules());
}

export function saveMatchingRule(rule: MatchingRule): MatchingRule {
  const rules = getMatchingRules();
  const existingIndex = rules.findIndex((r) => r.id === rule.id);

  if (existingIndex >= 0) {
    rules[existingIndex] = rule;
  } else {
    rules.push(rule);
  }

  setStorage(STORAGE_KEYS.rules, rules);
  return rule;
}

export function deleteMatchingRule(id: string): void {
  const rules = getMatchingRules().filter((r) => r.id !== id);
  setStorage(STORAGE_KEYS.rules, rules);
}

// Import Sessions
export function getImportSessions(): ImportSession[] {
  return getStorage<ImportSession[]>(STORAGE_KEYS.imports, []);
}

export function saveImportSession(session: ImportSession): void {
  const sessions = getImportSessions();
  sessions.unshift(session); // Add to beginning
  setStorage(STORAGE_KEYS.imports, sessions.slice(0, 50)); // Keep last 50
}

// Creator Payment Info
export function getCreatorPaymentInfo(): CreatorPaymentInfo[] {
  return getStorage<CreatorPaymentInfo[]>(STORAGE_KEYS.creatorPayments, []);
}

export function saveCreatorPaymentInfo(info: CreatorPaymentInfo): void {
  const all = getCreatorPaymentInfo();
  const existingIndex = all.findIndex((c) => c.creatorId === info.creatorId);

  if (existingIndex >= 0) {
    all[existingIndex] = info;
  } else {
    all.push(info);
  }

  setStorage(STORAGE_KEYS.creatorPayments, all);
}

// Default matching rules
function getDefaultRules(): MatchingRule[] {
  return [
    {
      id: 'rule_zelle_out',
      name: 'Zelle Outgoing',
      pattern: 'ZELLE TO',
      isRegex: false,
      matchType: 'creator',
      category: 'creator_payout',
      priority: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rule_wire_out',
      name: 'Wire Outgoing',
      pattern: 'WIRE TRANSFER OUT',
      isRegex: false,
      matchType: 'creator',
      category: 'creator_payout',
      priority: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rule_ach_in',
      name: 'ACH Credit (Brand Payment)',
      pattern: 'ACH CREDIT',
      isRegex: false,
      matchType: 'brand',
      category: 'brand_payment',
      priority: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rule_wire_in',
      name: 'Wire Incoming (Brand Payment)',
      pattern: 'WIRE TYPE:WIRE IN',
      isRegex: false,
      matchType: 'brand',
      category: 'brand_payment',
      priority: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

// Clear all finance data (for testing)
export function clearAllFinanceData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// Export all data (for backup)
export function exportAllData(): string {
  return JSON.stringify({
    campaigns: getCampaigns(),
    transactions: getTransactions(),
    rules: getMatchingRules(),
    imports: getImportSessions(),
    creatorPayments: getCreatorPaymentInfo(),
    exportedAt: new Date().toISOString(),
  });
}

// Import data (from backup)
export function importAllData(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString);
    if (data.campaigns) setStorage(STORAGE_KEYS.campaigns, data.campaigns);
    if (data.transactions)
      setStorage(STORAGE_KEYS.transactions, data.transactions);
    if (data.rules) setStorage(STORAGE_KEYS.rules, data.rules);
    if (data.imports) setStorage(STORAGE_KEYS.imports, data.imports);
    if (data.creatorPayments)
      setStorage(STORAGE_KEYS.creatorPayments, data.creatorPayments);
  } catch (err) {
    throw new Error('Invalid backup data format');
  }
}
