# Amie Talents - Project Context

## Overview
Talent management agency website for Amie Talents. Includes public-facing site for brands/creators and internal admin tools for finance management.

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Storage**: localStorage (can migrate to Supabase)

## Project Structure
```
src/
├── app/
│   ├── admin/                    # Internal finance tools
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── transactions/page.tsx # CSV import, transaction list
│   │   └── campaigns/page.tsx    # Campaign management
│   ├── talent/
│   │   ├── page.tsx              # Talent roster listing
│   │   ├── talent-page-content.tsx
│   │   └── [id]/page.tsx         # Individual talent profiles
│   ├── contact/                  # Contact form
│   ├── about/, faq/, services/, privacy/, terms/
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # shadcn components
│   ├── talent-card.tsx           # Creator card component
│   ├── header.tsx, footer.tsx
│   └── [animation components]
├── lib/
│   ├── talents.ts                # Creator data & helpers
│   ├── finance/                  # Finance module
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── parser.ts             # Chase CSV parser
│   │   ├── store.ts              # localStorage persistence
│   │   ├── matcher.ts            # Transaction matching engine
│   │   └── index.ts              # Exports
│   └── utils.ts
└── public/
    └── talent/                   # Creator headshots (downloaded from amietalents.com)
        ├── helen.jpg, kai.jpg, alice.jpg, laura.jpg
        ├── erica.jpg, niwa.jpg, katie.jpg, lia.jpg
```

## Creators (from amietalents.com)
8 real creators with data in `src/lib/talents.ts`:
| Name | Handle | Categories | Socials |
|------|--------|------------|---------|
| Helen | @helenpenggg | Dance, Fashion | IG, TikTok, YT |
| Kai | @_kaiichu | Beauty, Lifestyle | IG, TikTok |
| Alice | @2.asc | Makeup, Beauty, Fashion | IG, TikTok, YT |
| Laura | @laurahwclx | Fashion | IG, TikTok |
| Erica | @erica.syl | Fashion, Beauty, Lifestyle | IG, TikTok, YT |
| Niwa | @kneewah | Makeup, Beauty, Fashion | IG, TikTok, YT |
| Katie | @kqtei | Dance, Fashion | IG, TikTok, YT |
| Lia | @sunnyliachoi | Lifestyle | IG, TikTok, YT |

## Admin Finance Tool (`/admin`)

### Dashboard (`/admin`)
- Total income/expenses/net cash flow
- Breakdown by category (brand payments, creator payouts, operating expenses)
- Pending receivables from active campaigns
- Recent transactions list
- Alert for uncategorized transactions

### Transactions (`/admin/transactions`)
- **CSV Import**: Upload Chase bank statement exports
- **Auto-matching** with confidence scoring:
  - Matches against creator names from talent roster
  - Matches against campaign brand names
  - Uses pattern rules (Zelle → creator payout, ACH Credit → brand payment)
- **Categories**: brand_payment, creator_payout, operating_expense, refund, uncategorized
- **Manual categorization**: Edit any transaction, link to creator/campaign
- **Filtering**: By category, type (credit/debit), search

### Campaigns (`/admin/campaigns`)
- Create campaigns with brand name, campaign name, budget
- Set agency fee (percentage or flat)
- Assign creators with payout amounts
- Track status: draft → active → completed → pending_payment → paid
- Budget calculator shows remaining funds

### Data Models (src/lib/finance/types.ts)
```typescript
interface Campaign {
  id, brandName, campaignName, description
  totalBudget, agencyFee, agencyFeeType
  creatorPayouts: CampaignPayout[]
  status: CampaignStatus
  startDate, endDate, expectedPaymentDate
}

interface Transaction {
  id, date, description, rawDescription
  amount, type (credit/debit), category
  matchedCampaignId, matchedCreatorId
  matchConfidence (0-100), matchedBy (auto/manual/rule)
}

interface MatchingRule {
  pattern, isRegex, matchType (brand/creator/expense)
  category, priority
}
```

### Storage
All finance data stored in localStorage:
- `amie_finance_campaigns`
- `amie_finance_transactions`
- `amie_finance_rules`
- `amie_finance_imports`
- `amie_finance_creator_payments`

Export/import functions available in `src/lib/finance/store.ts`.

## What's NOT Built Yet
1. **Creator Payment Tracker** - Outstanding balances per creator
2. **Invoice Generator** - PDF invoices for brands
3. **Admin Authentication** - Password protection for /admin
4. **Brand CRM** - Contact management, deal pipeline
5. **Campaign Reports** - PDF reports for brands
6. **Database** - Currently localStorage, needs Supabase migration
7. **Email notifications** - Payment alerts, reminders

## Commands
```bash
npm run dev    # Start dev server (port 3000)
npm run build  # Production build
npm run start  # Start production server
```

## Notes
- Chase CSV format: Details, Posting Date, Description, Amount, Type, Balance, Check or Slip #
- Matching engine in `src/lib/finance/matcher.ts` uses fuzzy string matching
- TikTok icon is custom SVG (no lucide icon available)
- Images downloaded from amietalents.com CDN to `/public/talent/`
