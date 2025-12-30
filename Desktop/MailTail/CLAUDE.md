# MailTail - Project Specification

## Overview

**Product:** MailTail
**Purpose:** SaaS platform that injects hidden footer text into Klaviyo email templates to improve Gmail inbox placement (Primary vs Promotions)
**Business Model:** Contractual, account-size basis (no self-serve billing in MVP)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **API Key Encryption:** AES-256-GCM via node:crypto

## Core User Flow

```
1. Sign up / Log in
2. Connect Klaviyo (paste API key)
3. Enter Template ID → Process
4. Get new template with footer injected
5. View processing history
```

---

## Database Schema (Already Created in Supabase)

```sql
-- Klaviyo connections
create table klaviyo_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  encrypted_api_key text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Processing history
create table processed_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  original_template_id text not null,
  new_template_id text not null,
  template_name text,
  processed_at timestamp with time zone default now()
);

-- RLS policies are enabled, users can only access their own data
```

---

## Pages & Routes

### Public Routes
- `/` - Landing page with value prop and CTA
- `/login` - Login page
- `/signup` - Sign up page

### Protected Routes (require auth)
- `/dashboard` - Main dashboard home
- `/dashboard/process` - Template processor
- `/dashboard/history` - Processing history
- `/dashboard/settings` - Klaviyo connection management

---

## API Routes

### Auth (handled by Supabase)
- Sign up, login, logout, password reset

### Klaviyo Connection
- `POST /api/klaviyo/connect` - Validate and save API key
- `GET /api/klaviyo/status` - Check if user has connected Klaviyo
- `DELETE /api/klaviyo/disconnect` - Remove API key

### Template Processing
- `POST /api/templates/process` - Main processing endpoint
- `GET /api/templates/history` - Get user's processing history

---

## Feature Details

### 1. Authentication
- Email/password auth via Supabase
- Middleware to protect `/dashboard/*` routes
- Redirect unauthenticated users to `/login`

### 2. Klaviyo Connection (Settings Page)
- Input field for Klaviyo Private API Key
- On submit:
  1. Validate key by making test call to Klaviyo API
  2. Encrypt key using AES-256-GCM
  3. Store encrypted key in `klaviyo_connections` table
- Show connection status (connected/not connected)
- Button to disconnect (deletes the row)

### 3. Template Processor
- Input field for Klaviyo Template ID
- "Process Template" button
- On submit:
  1. Check user has connected Klaviyo
  2. Decrypt their API key
  3. Fetch original template from Klaviyo API
  4. Inject footer text before `</body>`
  5. Create new template via Klaviyo API named "{Original Name} - MailTail"
  6. Save to `processed_templates` table
  7. Show success with new template ID
- Handle errors gracefully (invalid ID, API errors, no connection)

### 4. History Page
- Table showing all processed templates
- Columns: Template Name, Original ID, New ID, Processed Date
- Sort by most recent first
- Empty state if no history

### 5. Dashboard Home
- If not connected: prompt to connect Klaviyo
- If connected: show quick stats and links to process/history

---

## Footer Text to Inject

```html
<div style="display:none;max-height:0px;overflow:hidden;">Hello, and thank you for taking the time to read this email. This message is part of an ongoing conversation between us, and I want to take a moment to ensure you have full transparency about why you received this message, how your information is handled, and what to expect from future emails. Why You're Receiving This Email You're receiving this email because at some point, you opted in to receive updates, news, or information on a specific topic we've previously discussed or shared. Whether it was through a subscription, a form submission, or another form of communication, your information was shared willingly, and we respect your decision to connect with us. If you're wondering about the nature of our correspondence, rest assured that we aim to keep all emails relevant, timely, and free from unnecessary clutter. This includes respecting your inbox and refraining from sending irrelevant messages. Your Privacy is Important We value your trust and take your privacy very seriously. The information you provide is securely stored and never shared, sold, or used outside the purpose for which you provided it. If you ever want to review how we handle your data, feel free to contact us directly. Transparency is our priority, and we're happy to address any questions you might have. You are always in control of the information you share. If you feel that any part of your subscription or interaction needs clarification, let us know. We're here to provide accurate answers and ensure your satisfaction. How to Unsubscribe or Manage Your Preferences We understand that everyone's inbox is different. If you ever find our emails no longer relevant, there's no hard feelings. You can easily manage your email preferences or unsubscribe using the link provided below. By clicking the unsubscribe link, you'll be taken to a page where you can either adjust your communication preferences (such as receiving fewer emails or only on specific topics) or completely remove yourself from our list. The process is straightforward, and any changes will take effect promptly. We don't use tricks or gimmicks to keep you subscribed. Our priority is to ensure that our emails add value to your day, and if they don't, we respect your decision to part ways. Accessibility and Communication If you have any trouble accessing the unsubscribe page, managing preferences, or understanding why you're receiving this email, you can reach out directly to our support team at hello[at]strshny[dot]com. We aim to provide a response within a reasonable time frame and address your concerns effectively. You can also call our friendly support team to answer any questions at +1 248.621.3860. Our communication is designed to be as inclusive as possible, but we know there's always room for improvement. If you have any feedback on how we can make our emails more accessible or relevant, please don't hesitate to share. A Commitment to Non-Intrusive Emails We aim to create a non-intrusive communication experience. This means we won't overwhelm your inbox with excessive messages, and we work hard to ensure our content remains clear and concise. The purpose of this email is to stay connected with you and provide updates or information that we believe is meaningful. If we ever fail to meet these standards, we encourage you to let us know. Feedback, whether positive or constructive, is always appreciated. Your thoughts help us understand how we can do better and improve our communication approach. While we cannot guarantee every suggestion will be implemented, we will take the time to carefully review and consider your input. Contact Information If you'd like to get in touch with us outside of managing your preferences, here's how you can reach us: Email: hello[at]strshny[dot]com Mailing Address: 15001 Kercheval Ave # 426701, Grosse Pointe MI 48230 United States We strive to ensure all communication channels are open and readily available to you. Whether it's a question, comment, or concern, our team is ready to assist. Legal Information We comply with all applicable laws and regulations regarding email communication. This includes adhering to anti-spam laws and maintaining the highest standards for consent-based communication. Your trust matters, and we work diligently to ensure every email you receive meets these requirements. If you need further clarification on our compliance policies or legal obligations, please feel free to ask. Transparency and accountability are central to our communication strategy, and we're happy to provide additional details if needed. A Final Note Emails are one of the many ways we stay connected, but we understand they aren't perfect for everyone. If there's another way you'd prefer to communicate or stay updated, let us know. Whether it's through social media, a direct call, or another channel, we're open to finding the most effective way to share information with you. We want to emphasize that our goal is never to disrupt or clutter your inbox. Every email sent is intended to provide value, and we genuinely appreciate your time and attention. Thank you for allowing us to stay in touch with you. This footer was designed to ensure transparency, provide essential information, and give you full control over your communication preferences. We hope it meets your expectations, but if there's anything you'd like to see improved, we're always here to listen.</div>
```

---

## Klaviyo API Reference

### Base URL
`https://a.klaviyo.com/api`

### Headers Required
```
Authorization: Klaviyo-API-Key {api_key}
Accept: application/json
revision: 2025-10-15
```

### Get Template
```
GET /templates/{template_id}
```

Response includes `data.attributes.html` and `data.attributes.name`

### Create Template
```
POST /templates/
Content-Type: application/json

{
  "data": {
    "type": "template",
    "attributes": {
      "name": "Template Name",
      "editor_type": "CODE",
      "html": "<html>...</html>"
    }
  }
}
```

Response includes `data.id` (the new template ID)

### Test Connection (List Templates)
```
GET /templates/?page[size]=1
```

Use this to validate an API key works.

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Encryption
ENCRYPTION_KEY=  # 32-byte hex string for AES-256
```

---

## UI Components to Use (shadcn/ui)

- Button
- Input
- Card
- Table
- Alert
- Dialog (for confirmations)
- Toast (for notifications)
- Skeleton (for loading states)
- Badge (for status indicators)

---

## File Structure

```
mailtail/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── process/page.tsx
│   │       ├── history/page.tsx
│   │       └── settings/page.tsx
│   ├── api/
│   │   ├── klaviyo/
│   │   │   ├── connect/route.ts
│   │   │   ├── status/route.ts
│   │   │   └── disconnect/route.ts
│   │   └── templates/
│   │       ├── process/route.ts
│   │       └── history/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/  (shadcn components)
│   ├── dashboard-nav.tsx
│   ├── auth-form.tsx
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── klaviyo.ts
│   ├── encryption.ts
│   └── utils.ts
├── middleware.ts
└── ...
```

---

## Error Handling

All API routes should return consistent error format:
```json
{
  "error": "Human readable error message"
}
```

Status codes:
- 400 - Bad request (missing fields, validation)
- 401 - Unauthorized (not logged in)
- 404 - Not found (template doesn't exist)
- 500 - Server error

---

## Security Considerations

1. **API Key Encryption:** Use AES-256-GCM with a secure key stored in env vars
2. **Row Level Security:** Supabase RLS ensures users only access their own data
3. **Input Validation:** Validate template IDs before making API calls
4. **Rate Limiting:** Consider adding rate limiting to prevent abuse (future)

## New Feature: Template Browser

### API Endpoints to Add

GET /api/klaviyo/templates - List all user's Klaviyo templates

### Klaviyo API: Get Templates
```
GET https://a.klaviyo.com/api/templates
Headers:
  Authorization: Klaviyo-API-Key {api_key}
  Accept: application/json
  revision: 2025-10-15

Query params:
  sort: -updated (newest first)
  page[size]: 20
```

Response includes array of templates with id, name, editor_type, html, created, updated

### UI Changes

**Process Template Page:**
- Replace single input field with template browser
- Grid view showing template cards:
  - Template name
  - Preview thumbnail (HTML rendered in small iframe)
  - Last updated date
  - "Select" button
- Search/filter by name
- Pagination for large accounts
- Selected template shows larger preview
- Keep manual ID input as fallback option

**Template Preview:**
- Render raw HTML in sandboxed iframe
- Show template name and metadata
- "Process This Template" button

---

## Admin Panel

### Overview

Internal admin panel for managing brands, users, trials, and subscriptions. Accessible at `/admin/*` routes.

**First Admin:** lennyhuynh526@gmail.com (manual DB insert as super_admin)

### Existing Database Structure

The following tables already exist:
- `profiles` - User profiles with `brand_name`
- `teams` - Team/organization entities with `owner_id`
- `team_members` - User-team associations with roles (owner, admin, member)
- `team_invites` - Team invitation system
- `klaviyo_connections` - Has `team_id` column (one connection per team)
- `processed_templates` - Has `team_id` column

### New Database Tables Required

```sql
-- Plans/subscription tiers
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,                    -- 'Free Trial', 'Starter', 'Pro', 'Enterprise'
  type text not null,                    -- 'trial_time', 'trial_usage', 'paid'
  template_limit integer,                -- null = unlimited
  trial_days integer,                    -- for time-based trials
  is_default boolean default false,      -- default plan for new signups
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team subscriptions
create table team_subscriptions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade unique,
  plan_id uuid references plans(id),
  status text default 'trial',           -- 'trial', 'active', 'expired', 'suspended'

  -- Trial tracking (either/or - usage overrides time)
  trial_type text,                       -- 'time', 'usage', null if paid
  trial_ends_at timestamptz,             -- for time-based
  trial_template_limit integer,          -- for usage-based
  trial_templates_used integer default 0,

  -- Admin overrides
  custom_template_limit integer,         -- override plan limit
  custom_ends_at timestamptz,            -- custom expiration
  admin_notes text,

  started_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Admin users
create table admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  role text default 'support',           -- 'super_admin', 'admin', 'support'
  created_at timestamptz default now()
);

-- Admin audit log
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id),
  action text not null,                  -- 'start_trial', 'extend_trial', 'end_trial', 'change_plan', etc.
  target_type text,                      -- 'team', 'user', 'plan'
  target_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- Activity/usage log
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,                  -- 'template_processed', 'klaviyo_connected', 'login', etc.
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_team_subscriptions_team_id on team_subscriptions(team_id);
create index idx_team_subscriptions_status on team_subscriptions(status);
create index idx_admin_audit_log_admin_id on admin_audit_log(admin_id);
create index idx_admin_audit_log_created_at on admin_audit_log(created_at);
create index idx_activity_log_team_id on activity_log(team_id);
create index idx_activity_log_created_at on activity_log(created_at);
```

### Trial System Logic

**Priority Order:** Usage limit > Time limit > Paid status

```typescript
function getSubscriptionStatus(subscription: TeamSubscription): 'active' | 'expired' {
  // 1. Check usage limit first (if set)
  if (subscription.trial_type === 'usage' && subscription.trial_template_limit) {
    if (subscription.trial_templates_used >= subscription.trial_template_limit) {
      return 'expired';
    }
    return 'active';
  }

  // 2. Check time limit (if set)
  if (subscription.trial_type === 'time' && subscription.trial_ends_at) {
    if (new Date() > new Date(subscription.trial_ends_at)) {
      return 'expired';
    }
    return 'active';
  }

  // 3. Check paid/active status
  if (subscription.status === 'active') {
    return 'active';
  }

  return 'expired';
}

function canProcessTemplate(team: Team): { allowed: boolean; reason?: string } {
  const subscription = getSubscription(team.id);

  if (!subscription) {
    return { allowed: false, reason: 'No subscription found' };
  }

  if (subscription.status === 'suspended') {
    return { allowed: false, reason: 'Account suspended' };
  }

  const status = getSubscriptionStatus(subscription);

  if (status === 'expired') {
    return { allowed: false, reason: 'Trial expired' };
  }

  // Check monthly limits for paid plans
  if (subscription.custom_template_limit) {
    const monthlyUsage = getMonthlyUsage(team.id);
    if (monthlyUsage >= subscription.custom_template_limit) {
      return { allowed: false, reason: 'Monthly limit reached' };
    }
  }

  return { allowed: true };
}
```

### Admin Panel Routes

```
/admin                    - Dashboard (stats overview)
/admin/brands             - All brands/teams list
/admin/brands/[id]        - Brand detail & management
/admin/users              - All users list
/admin/plans              - Plan management (create/edit)
/admin/activity           - Activity log viewer
/admin/audit              - Admin audit log
/admin/settings           - Admin settings
```

### Admin Panel Pages

**1. Dashboard (`/admin`)**
- Total brands, users, active trials
- Templates processed (today/week/month)
- Recent signups (last 7 days)
- Trial conversion rate
- Quick alerts (expiring trials, etc.)

**2. Brands List (`/admin/brands`)**
- Table: Name, Owner, Status, Plan, Templates Used, Created
- Search by name, owner email
- Filter by status (trial, active, expired, suspended)
- Sort by created, name, usage
- Click row → Brand detail

**3. Brand Detail (`/admin/brands/[id]`)**
- Brand info (name, created, owner)
- Team members list
- Subscription info (plan, status, limits, usage)
- Klaviyo connection status
- Usage stats (templates processed, by day/week)
- Activity log for this brand
- Actions:
  - Start/Extend/End trial
  - Change plan
  - Set custom limits
  - Connect/Disconnect Klaviyo (admin override)
  - Suspend/Unsuspend
  - Add admin notes

**4. Users List (`/admin/users`)**
- Table: Email, Name, Brand, Role, Joined
- Search by email, name
- Click → Brand detail (of their team)

**5. Plans (`/admin/plans`)**
- List all plans
- Create new plan (name, type, limits)
- Edit existing plans
- Set default plan for new signups

**6. Activity Log (`/admin/activity`)**
- All activity across all brands
- Filter by action type, brand, user, date range
- Export to CSV

**7. Audit Log (`/admin/audit`)**
- All admin actions
- Filter by admin, action type, date range
- Shows who did what, when

### Admin API Routes

```
GET  /api/admin/stats              - Dashboard stats
GET  /api/admin/brands             - List brands (with pagination, filters)
GET  /api/admin/brands/[id]        - Brand detail
POST /api/admin/brands/[id]/trial  - Start/extend/end trial
POST /api/admin/brands/[id]/plan   - Change plan
POST /api/admin/brands/[id]/suspend - Suspend/unsuspend
POST /api/admin/brands/[id]/klaviyo - Connect/disconnect Klaviyo
GET  /api/admin/users              - List users
GET  /api/admin/plans              - List plans
POST /api/admin/plans              - Create plan
PUT  /api/admin/plans/[id]         - Update plan
GET  /api/admin/activity           - Activity log
GET  /api/admin/audit              - Audit log
```

### Trial Expired UX (User-Facing)

When trial expires, users see a degraded dashboard:
- Can log in and access dashboard
- Can view processing history (read-only)
- Can view team members (read-only)
- CANNOT process new templates (button disabled with message)
- CANNOT connect/change Klaviyo connection
- Shows banner: "Your trial has ended. Contact us to continue using MailTail."
- Shows usage stats (how many templates they processed)

### Admin Roles

| Role | Capabilities |
|------|-------------|
| super_admin | Everything, including managing other admins |
| admin | Manage brands, trials, plans, view logs |
| support | View-only access, cannot modify |

### Security

- Admin routes protected by middleware checking `admins` table
- All admin actions logged to `admin_audit_log`
- RLS policies for admin tables
- Rate limiting on admin API routes