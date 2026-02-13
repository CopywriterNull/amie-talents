import { Transaction, ChaseCSVRow, TransactionType } from './types';

// Generate a unique ID
function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Parse Chase CSV format
export function parseChaseCSV(csvContent: string): Transaction[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  // Parse header
  const header = parseCSVLine(lines[0]);
  const expectedHeaders = ['Details', 'Posting Date', 'Description', 'Amount', 'Type', 'Balance'];

  // Validate header (flexible matching)
  const hasRequiredHeaders = expectedHeaders.every(h =>
    header.some(col => col.toLowerCase().includes(h.toLowerCase()))
  );

  if (!hasRequiredHeaders) {
    throw new Error('Invalid Chase CSV format. Expected columns: Details, Posting Date, Description, Amount, Type, Balance');
  }

  // Create header index map
  const headerIndex: Record<string, number> = {};
  header.forEach((col, idx) => {
    headerIndex[col.trim()] = idx;
  });

  // Parse data rows
  const transactions: Transaction[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);

    try {
      const details = values[headerIndex['Details']] || '';
      const postingDate = values[headerIndex['Posting Date']] || '';
      const description = values[headerIndex['Description']] || '';
      const amountStr = values[headerIndex['Amount']] || '0';
      const type = values[headerIndex['Type']] || '';
      const balanceStr = values[headerIndex['Balance']] || '';
      const checkNumber = values[headerIndex['Check or Slip #']] || '';

      // Parse amount (remove commas, handle negatives)
      const amount = Math.abs(parseFloat(amountStr.replace(/[,$]/g, '')) || 0);
      const balance = parseFloat(balanceStr.replace(/[,$]/g, '')) || undefined;

      // Determine transaction type
      const txnType: TransactionType =
        details.toUpperCase().includes('CREDIT') || parseFloat(amountStr.replace(/[,$]/g, '')) > 0
          ? 'credit'
          : 'debit';

      // Parse date (MM/DD/YYYY format)
      const dateParts = postingDate.split('/');
      let isoDate = postingDate;
      if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      const transaction: Transaction = {
        id: generateId(),
        date: isoDate,
        description: cleanDescription(description),
        rawDescription: description,
        amount,
        type: txnType,
        balance,
        checkNumber: checkNumber || undefined,
        category: 'uncategorized',
        matchConfidence: 0,
        matchConfidenceLevel: 'none',
        matchedBy: 'auto',
        importedAt: now,
      };

      transactions.push(transaction);
    } catch (err) {
      console.warn(`Failed to parse line ${i + 1}:`, err);
    }
  }

  return transactions;
}

// Parse a single CSV line, handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Clean up description for better matching
function cleanDescription(description: string): string {
  return description
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace(/[#*]+/g, '')
    .trim();
}

// Extract potential identifiers from description
export function extractIdentifiers(description: string): {
  possibleNames: string[];
  possibleCompanies: string[];
  paymentMethod: string | null;
} {
  const upperDesc = description.toUpperCase();

  // Detect payment method
  let paymentMethod: string | null = null;
  if (upperDesc.includes('ZELLE')) paymentMethod = 'zelle';
  else if (upperDesc.includes('WIRE')) paymentMethod = 'wire';
  else if (upperDesc.includes('ACH')) paymentMethod = 'ach';
  else if (upperDesc.includes('CHECK')) paymentMethod = 'check';

  // Extract names after common patterns
  const namePatterns = [
    /ZELLE (?:TO|FROM) ([A-Z\s]+?)(?:\s+\d|$)/i,
    /(?:TO|FROM) ([A-Z][a-z]+ [A-Z][a-z]+)/,
    /ACH (?:CREDIT|DEBIT) ([A-Z\s]+?)(?:\s+PAYMENT|\s+TRANSFER|$)/i,
    /WIRE (?:TO|FROM) ([A-Z\s]+?)(?:\s+\d|$)/i,
  ];

  const possibleNames: string[] = [];
  for (const pattern of namePatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      possibleNames.push(match[1].trim());
    }
  }

  // Extract company names
  const companyPatterns = [
    /(?:ACH CREDIT|WIRE FROM) ([A-Z0-9\s&]+?)(?:\s+(?:PAYMENT|INC|LLC|CORP|CO)|$)/i,
    /([A-Z][A-Z0-9\s&]{2,})\s+(?:INC|LLC|CORP|CO)\.?/i,
  ];

  const possibleCompanies: string[] = [];
  for (const pattern of companyPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      possibleCompanies.push(match[1].trim());
    }
  }

  return {
    possibleNames,
    possibleCompanies,
    paymentMethod,
  };
}
