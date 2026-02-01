# Shopify $0 Product Scanner - Design Document

## Overview

A tool to scan Shopify stores for $0.00 and low-priced products, collecting them for browsing, sourcing, and fun treasure hunting.

**Stack:** Vercel (Hobby) + Supabase (Database, Edge Functions, Cron)

**Scale:** 43k stores from CSV with rich metadata

---

## Architecture

```
┌─────────────────┐     ┌─────────────────────────────────┐
│  Vercel (UI)    │     │  Supabase                       │
│  - Next.js 14   │────▶│  - PostgreSQL (data)            │
│  - shadcn/ui    │     │  - Edge Functions (scanning)    │
│  - Recharts     │     │  - pg_cron (scheduling)         │
│  - Password     │     │  - Realtime (live updates)      │
└─────────────────┘     └─────────────────────────────────┘
```

---

## Database Schema

### `stores`
Your 43k domains with imported metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| domain | text | Store domain (unique) |
| domain_url | text | Full URL |
| category | text | e.g., "/Pets & Animals/Pet Food" |
| country_code | text | e.g., "US" |
| employee_count | integer | From CSV |
| estimated_monthly_sales | numeric | From CSV |
| plan | text | Shopify plan |
| platform | text | Should be "Shopify" |
| status | text | active/dormant/dead/paused/blocklisted |
| empty_scan_count | integer | Consecutive scans with 0 products |
| last_scanned_at | timestamptz | Last successful scan |
| scan_priority | integer | Higher = scanned first |
| created_at | timestamptz | Import date |

### `products`
Found products matching price criteria.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| store_id | uuid | FK to stores |
| shopify_product_id | bigint | Shopify's product ID |
| title | text | Product name |
| handle | text | URL slug |
| vendor | text | Brand name |
| product_type | text | Category from Shopify |
| image_url | text | Primary image |
| product_url | text | Direct link to product page |
| lowest_price | numeric | Lowest variant price |
| status | text | active/junk/claimed |
| first_seen_at | timestamptz | First discovery |
| last_seen_at | timestamptz | Last seen in scan |

### `variants`
Product variants (where price actually lives).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | FK to products |
| shopify_variant_id | bigint | Shopify's variant ID |
| title | text | Variant name (e.g., "3 Pack") |
| sku | text | SKU code |
| price | numeric | Variant price |
| compare_at_price | numeric | Original price |
| available | boolean | In stock |
| option1 | text | First option value |
| option2 | text | Second option value |
| created_at | timestamptz | First seen |

### `blocklist`
Brands, stores, or SKUs to never show again.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | brand/store/sku |
| value | text | The blocked value |
| reason | text | Optional note |
| products_hidden | integer | Count of products affected |
| created_at | timestamptz | When blocked |

### `scans`
Scan history and stats.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| store_id | uuid | FK to stores |
| started_at | timestamptz | Scan start |
| completed_at | timestamptz | Scan end |
| status | text | success/failed/timeout/aborted |
| products_found | integer | Count of matching products |
| error_message | text | If failed |

### `scan_queue`
Priority queue for scanning.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| store_id | uuid | FK to stores |
| priority | integer | Higher = first (default 0, priority scans = 100) |
| queued_at | timestamptz | When added |
| status | text | pending/processing/completed |

### `scan_control`
Global scan state (single row).

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Always 1 |
| status | text | running/paused/aborted |
| current_store_id | uuid | Currently scanning |
| updated_at | timestamptz | Last state change |

---

## Scanning Engine

### Edge Function: `scan-stores`

```
1. Check scan_control - if paused/aborted, exit
2. Fetch batch of stores from scan_queue (e.g., 50, ordered by priority DESC)
3. For each store (parallel, 10 concurrent):
   a. Check scan_control for abort signal
   b. Fetch /products.json?limit=250&page=1
   c. If 250 products returned, fetch page=2
   d. For each product:
      - Check vendor against blocklist → skip if blocked
      - Check each variant price against threshold
      - If price <= threshold, upsert product + variant
   e. Update store.last_scanned_at
   f. Log to scans table
   g. If 0 products found, increment empty_scan_count
      - If empty_scan_count >= 3, set status = 'dormant'
4. Broadcast updates via Supabase Realtime
```

### Price Thresholds (configurable)
- `$0.00` - Completely free
- `$0.01 - $0.99` - Penny items
- `$1.00 - $4.99` - Under $5
- Custom threshold

### Scheduling (pg_cron)
- **Weekly full scan:** Cycles through all active stores over 7 days (~6k/day)
- **Monthly dormant check:** Re-scan dormant stores to see if they have products now
- **On-demand:** Priority queue for manual triggers

### Error Handling
- 404/error → mark store as `dead`
- Rate limited → back off, continue with others
- Timeout → partial save, retry next run

---

## Dashboard UI

### Pages

**1. Dashboard Home (`/`)**
- Stats cards: total products, new this week, stores scanned, blocked brands
- Recent finds feed (last 24-48 hours)
- Scan status widget: running/paused, progress, next scheduled

**2. Live Scan Control (`/scans`)**
- Real-time status: currently scanning store, queue depth
- Progress bar: X/Y stores in current batch
- Live feed of finds as they happen
- Controls: Pause / Abort / Resume
- Priority queue: add stores/categories to front of line

**3. Products (`/products`)**
- Filterable table with columns:
  - Thumbnail, product name, vendor, price, store, first seen
- Filters: price range, category, store, vendor, status
- Quick actions: open product page, mark junk, block brand
- Bulk actions: select multiple → block vendor, mark junk
- Deduplication view: group by SKU, show "47 sources" badge

**4. Stores (`/stores`)**
- All 43k stores with metadata
- Status badges: active/dormant/dead/paused
- Toggle active/inactive for scanning
- Filter by category, country, sales range
- Trigger manual scan button
- Stats: "2,340 active / 38,000 dormant / 420 dead"

**5. Blocklist (`/blocklist`)**
- View all blocked brands/stores/SKUs
- See products hidden per block
- Unblock button if needed

**6. Settings (`/settings`)**
- Price threshold slider
- Scan frequency config
- Password change
- CSV re-import

### UI Stack
- Next.js 14 (App Router)
- shadcn/ui components
- Tailwind CSS
- Recharts for stats/charts
- Supabase Realtime for live updates

---

## Cleaning & Deduplication

### Block Brand
1. Click "Block Brand" on any product
2. Delete all products from that vendor
3. Add vendor to blocklist
4. Future scans skip this vendor

### Mark as Junk
- Flag product, keep visible but greyed out
- Default filter hides junk
- Reversible

### Deduplication
- Group products by SKU or title similarity
- Show collapsed view: "47 variants across 12 stores"
- Expand to see all sources
- One-click: "Block this SKU everywhere"

### Bulk Cleaning
- Multi-select → bulk junk / bulk block
- "Clean by vendor" - see all vendors ranked by product count
- "Clean by keyword" - block products matching "test", "sample", etc.

---

## Smart Store Flagging

### Auto-dormant
- Store returns 0 matching products → increment `empty_scan_count`
- After 3 consecutive empty scans → set status to `dormant`
- Dormant stores skipped in regular scans

### Revival
- Monthly "check-up scan" for dormant stores
- If products found → auto-reactivate to `active`
- Manual "Reactivate" button in UI

### Store Statuses
| Status | Description |
|--------|-------------|
| active | Scanned normally |
| dormant | Skipped (0 products found 3+ times) |
| dead | 404/unreachable, never retry |
| paused | Manually paused by user |
| blocklisted | Blocked entirely |

---

## Authentication

### Simple Password Protection
- Single password via `SITE_PASSWORD` env var
- Login page sets HTTP-only cookie (7-day expiry)
- No user accounts needed

### Environment Variables
```
SITE_PASSWORD=your-secret-password
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ... (Edge Functions only)
```

---

## CSV Import

### Expected Format
```csv
domain,categories,country_code,created,domain_url,employee_count,estimated_monthly_sales,plan,platform
petbox.walmart.com,/Pets & Animals/Pet Food,US,2022/09/16,https://petbox.walmart.com,310692,$56529333333.33,,Shopify
```

### Import Flow
1. Upload CSV in Settings page
2. Parse and validate rows
3. Upsert to stores table (match on domain)
4. Set all new stores to `status = 'active'`
5. Show import stats: added/updated/skipped

---

## Future Considerations

- **Export to CSV:** Download found products for external use
- **Notifications:** Email/webhook when high-value finds discovered
- **Multi-user:** If sharing with friends, add proper auth
- **Product tracking:** Monitor price changes over time
- **Cart automation:** Auto-add to cart (browser extension?)
